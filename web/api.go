package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
	"github.com/plaid/plaid-go/plaid"
	bc "golang.org/x/crypto/bcrypt"
	"msudenver.edu/ledger/db"
	"msudenver.edu/ledger/repos"
	"encoding/json"
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

// Temp env var expires on session close
var jwtEnv = os.Getenv("jwt")
var signKey = []byte("")

// User pw byte slice
var bcryptPW = []byte("")

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
		encryptPassword(details.Password)
		// *** TODO: Hash pw added to CreateUser/db ****
		user, err := repo.Users.CreateUser(details.Name, details.Email)
		if err != nil {
			return err
		}

		tokenString, err := GenerateJWT(user)
		if err != nil {
			server.Logger.Errorf("Error creating JWT: %v", err)
		}
		return c.String(http.StatusCreated, tokenString)
	})

	server.POST("/create_link_token", func(c echo.Context) error {
		// Create a link_token for the given user
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

		response, err := client.ExchangePublicToken(req.Token)
		if err != nil {
			return c.String(http.StatusBadRequest, err.Error())
		}

		accessToken = response.AccessToken
		itemID = response.ItemID

		c.Logger().Info("public token: ", req.Token)
		c.Logger().Info("access token: ", accessToken)
		c.Logger().Infof("item ID: %s", itemID)

		repo.Plaids.CreatePlaid(accessToken, itemID)

		// Check if this item already exists
		// GetItem retrieves an item associated with an access token.
		// See https://plaid.com/docs/api/items/#itemget.
		// itemResp, errrrr := client.GetItem(accessToken)
		// item := itemResp.Item
		// status := itemResp.Status
		// if errrrr != nil {
		// 	http.Error(w, errrrr.Error(), 400)
		// 	return
		// }

		//fmt.Println("Item: %s" + item.Products)
		//fmt.Println("Status: %s" + status["transactions"])

		// Endpoint: /accounts/get
		// GetAccounts retrieves accounts associated with an Item.
		// See https://plaid.com/docs/api/accounts/.

		responsee, err := client.GetAccounts(accessToken)
		if err != nil {
			return c.String(http.StatusBadGateway, err.Error())
		}

		c.Logger().Infof("Got accounts: %v", responsee.Accounts)
		return c.String(http.StatusCreated, accessToken)
	})



	// Start the server
	server.Logger.Fatal(server.Start(":8080"))
}

func GenerateJWT(usr *repos.User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = usr.ID
	claims["user"] = usr.FullName
	claims["iat"] = time.Now().Unix()
	claims["exp"] = time.Now().Add(time.Minute * 60).Unix()

	// Nav to: https://jwt.io/  paste tokenString in text field.
	var signKey = []byte(jwtEnv)

	tokenString, err := token.SignedString(signKey)
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
	bcryptPW = []byte(password)
	// Hashing the password with the default cost of 10
	hashedPassword, err := bc.GenerateFromPassword(bcryptPW, bc.DefaultCost)
	if err != nil {
		panic(err)
	}

	// Out hashed pw
	fmt.Println("HASH'D PW: " + string(hashedPassword) + "\n")

	// Test hash validation, nil == match
	confirmPassword(hashedPassword)

	return string(hashedPassword)
}

// Compare password to db pw hash record (login pw validation).
func confirmPassword(hash []byte) {
	err := bc.CompareHashAndPassword(hash, bcryptPW)
	fmt.Print("Confirm PW (nil if match): ")
	fmt.Println(err)
}
