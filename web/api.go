package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"encoding/json"

	jwt "github.com/dgrijalva/jwt-go"
	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
	"github.com/plaid/plaid-go/plaid"
	bc "golang.org/x/crypto/bcrypt"
	"msudenver.edu/ledger/db"
	"msudenver.edu/ledger/repos"
)

type Item struct {
	AvailableProducts     []string  `json:"available_products"`
	BilledProducts        []string  `json:"billed_products"`
	Error                 error     `json:"error"`
	InstitutionID         string    `json:"institution_id"`
	ItemID                string    `json:"item_id"`
	Webhook               string    `json:"webhook"`
	ConsentExpirationTime time.Time `json:"consent_expiration_time"`
}

var (
	PLAID_CLIENT_ID     = os.Getenv("PLAID_CLIENT_ID")
	PLAID_SECRET        = os.Getenv("PLAID_SECRET")
	PLAID_PRODUCTS      = os.Getenv("PLAID_PRODUCTS")
	PLAID_COUNTRY_CODES = os.Getenv("PLAID_COUNTRY_CODES")
)
var accessToken string
var itemID string

// UserInfo form fields.
type UserInfo struct {
	Email    string
	Name     string `json:"name"`
	Password string `json:"password"`
}
type Access struct {
	Token string `json:"public_token"`
}

var repo *repos.Repo

var JWT_KEY = []byte(os.Getenv("JWT_SECRET"))

var clientOptions = plaid.ClientOptions{
	os.Getenv("PLAID_CLIENT_ID"),
	os.Getenv("PLAID_SECRET"),
	plaid.Sandbox,  // Available environments are Sandbox, Development, and Production
	&http.Client{}, // This parameter is optional
}

var client, err = plaid.NewClient(clientOptions)

func main() {
	server := echo.New()

	database := db.Init()
	repo = repos.CreateRepo(database)
	if err := repo.CreateSchema(database); err != nil {
		server.Logger.Fatal("Unable to create schemas", err)
	}

	// Serve assets
	server.File("/", "./static/ledger.html")
	server.Static("/", "./static")
	// Routes
	server.GET("/ping", func(c echo.Context) error {
		return c.String(http.StatusOK, "pong")
	})

	server.POST("/welcome", func(c echo.Context) error {
		// extract form details
		details := UserInfo{
			Email:    c.FormValue("email"),
			Name:     c.FormValue("name"),
			Password: c.FormValue("password"),
		}

		server.Logger.Infof("got form %v", details)

		// Hash user password.
		// *** TODO: Hash pw added to CreateUser/db ****
		pwEncyrpted := encryptPassword(details.Password)

		user, err := repo.Users.CreateUser(details.Name, details.Email, pwEncyrpted)
		if err != nil {
			return err
		}

		tokenString, err := GenerateJWT(user)
		if err != nil {
			server.Logger.Errorf("Error creating JWT: %v", err)
		}
		return c.String(http.StatusCreated, tokenString)
	})

	server.POST("/login", func(c echo.Context) error {

		email := c.FormValue("email")
		password := c.FormValue("password")

		// FIXME: don't log passwords
		server.Logger.Infof("got form %s, %s", email, password)

		user, err := repo.Users.GetUser(email)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid email or password", err)
		}

		if !confirmPassword(user.PW, password) {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid email or password", fmt.Errorf("password did not match for %s", email))
		}

		tokenString, err := GenerateJWT(user)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "unknown error", err)
		}

		return c.String(http.StatusOK, tokenString)
	})

	server.POST("/create_link_token", func(c echo.Context) error {
		linkTokenResp, err := client.CreateLinkToken(plaid.LinkTokenConfigs{
			User: &plaid.LinkTokenUser{
				ClientUserID: "123-test-user-id",
			},
			ClientName:            "My App",
			Products:              []string{"auth", "transactions"},
			CountryCodes:          []string{"US"},
			Language:              "en",
			Webhook:               "https://webhook-uri.com",
			LinkCustomizationName: "default",
			AccountFilters: &map[string]map[string][]string{
				"depository": {
					"account_subtypes": {"checking", "savings"},
				},
			},
		})
		if err != nil {
			return err
		}
		linkToken := linkTokenResp.LinkToken
		return c.String(http.StatusCreated, linkToken)
	})

	server.POST("/get_access_token", func(c echo.Context) error {

		req := new(Access)
		err := json.NewDecoder(c.Request().Body).Decode(&req)
		if err != nil {
			return c.String(http.StatusBadRequest, err.Error())
		}

		accessAndItemResponse, err := client.ExchangePublicToken(req.Token)
		if err != nil {
			return c.String(http.StatusBadRequest, err.Error())
		}

		accessToken = accessAndItemResponse.AccessToken
		itemID = accessAndItemResponse.ItemID

		c.Logger().Info("public token: ", req.Token)
		c.Logger().Info("access token: ", accessToken)
		c.Logger().Infof("item ID: %s", itemID)

		repo.Plaids.CreatePlaid(accessToken, itemID)

		accountsResponse, err := client.GetAccounts(accessToken)
		if err != nil {
			return c.String(http.StatusBadGateway, err.Error())
		}

		c.Logger().Infof("Got accounts: %v", accountsResponse.Accounts)

		return c.String(http.StatusCreated, accessToken)
	})

	// Start the server
	server.Logger.Fatal(server.Start(":8080"))
}

func removeItem(c echo.Context, accessToken string) {
	response, err := client.RemoveItem(accessToken)
	if err != nil {
		c.String(http.StatusBadGateway, err.Error())
	}
	// The Item was removed and the access_token is now invalid
	fmt.Println(response)
}

func getCategories(c echo.Context){
	response, err := client.GetCategories()
	categories := response.Categories

	if err != nil {
		c.String(http.StatusBadGateway, err.Error())
	}

	fmt.Println(categories)
}

func getTransactions(c echo.Context, accessToken string){
	const iso8601TimeFormat = "2006-01-02"

	startDate := time.Now().Add(-365 * 24 * time.Hour).Format(iso8601TimeFormat)
	endDate := time.Now().Format(iso8601TimeFormat)

	transactionsResp, err := client.GetTransactions(accessToken, startDate, endDate)

	if err != nil {
		c.String(http.StatusBadGateway, err.Error())
	}

	fmt.Println(transactionsResp)
}

func refreshTransactions(c echo.Context, accessToken string){
	refreshedTransactions, err := client.RefreshTransactions(accessToken)

	if err != nil {
		c.String(http.StatusBadGateway, err.Error())
	}

	fmt.Println(refreshedTransactions)
}

func getAccountBalances(c echo.Context, accessToken string){
	balanceResp, err := client.GetBalances(accessToken)

	if err != nil {
		c.String(http.StatusBadGateway, err.Error())
	}

	fmt.Println(balanceResp)
}

func getPlaidItem(c echo.Context, accessToken string){
		// Check if this item already exists
		// GetItem retrieves an item associated with an access token.
		// See https://plaid.com/docs/api/items/#itemget.
		itemResp, err := client.GetItem(accessToken)
		item := itemResp.Item
		status := itemResp.Status

		if err != nil {
			c.String(http.StatusBadGateway, err.Error())
		}

		fmt.Println(status)
		fmt.Println(item)
}

func GenerateJWT(usr *repos.User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = usr.ID
	claims["name"] = usr.FullName
	claims["iat"] = time.Now().Unix()
	claims["exp"] = time.Now().Add(time.Minute * 60).Unix()

	tokenString, err := token.SignedString(JWT_KEY)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

/*
 encryptPassword() & confirmPassword() funcs
 Ref: https://stackoverflow.com/questions/23259586/bcrypt-password-hashing-in-golang-compatible-with-node-js
*/
func encryptPassword(password string) string {
	// Byte slice of User password to use bcrypt.
	pw := []byte(password)
	// Hashing the password with the default cost of 10
	hashedPassword, err := bc.GenerateFromPassword(pw, bc.DefaultCost)
	if err != nil {
		panic(err)
	}
	return string(hashedPassword)
}

// Compare password to db pw hash record (login pw validation).
func confirmPassword(hash string, password string) bool {
	h := []byte(hash)
	p := []byte(password)
	err := bc.CompareHashAndPassword(h, p)
	return err == nil
}
