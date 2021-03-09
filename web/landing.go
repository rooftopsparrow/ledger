package main

// Landing page (ledger.html) on local server with form fields.
// Reference:
// https://astaxie.gitbooks.io/build-web-application-with-golang/content/en/04.1.html

import (
	"fmt"
	"log"
	"net/http"
	"time"


	jwt "github.com/dgrijalva/jwt-go"
	_ "github.com/joho/godotenv/autoload"
	"msudenver.edu/ledger/db"
	"msudenver.edu/ledger/repos"
    "os"

    "github.com/plaid/plaid-go/plaid"
    "github.com/gin-gonic/gin"

)

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

var repo *repos.Repo
var signKey = []byte("")

var clientOptions = plaid.ClientOptions{
    os.Getenv("PLAID_CLIENT_ID"),
    os.Getenv("PLAID_SECRET"),
    plaid.Sandbox, // Available environments are Sandbox, Development, and Production
    &http.Client{}, // This parameter is optional
}

var client, err = plaid.NewClient(clientOptions)

func main() {
	//r := gin.Default()
	//r.POST("/create_link_token", create_link_token)
	//r.GET("/get_access_token", get_access_token)
	//r.Run()

	database := db.Init()
	repo = repos.CreateRepo(database)
	if err := repo.CreateSchema(database); err != nil {
		log.Fatal("Unable to create schemas", err)
	}

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	// *** Stuck on displaying info in current page ***
	http.HandleFunc("/welcome", registerBtn)

	log.Println("Listening on port :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
	http.ListenAndServe(":8080", nil)
}

func registerBtn(w http.ResponseWriter, r *http.Request) {

	details := UserInfo{
		Email:    r.FormValue("email"),
		Name:     r.FormValue("name"),
		Password: r.FormValue("password"),
	}

	user, err := repo.Users.CreateUser(details.Name, details.Email)
	if err != nil {
		panic(err)
	}

	str := fmt.Sprintf(
		"Welcome to Ledger! user: %s, email: %s, ID: %d, Registered on: %s",
		user.FullName,
		user.Email,
		user.ID,
		user.CreatedAt,
	)
	// Display user entered name & email in browser.
	fmt.Fprintf(w, str)

	tokenString, err := GenerateJWT(user)
	if err != nil {
		fmt.Println("Error creating JWT.")
	}
	fmt.Println(tokenString)

}

// GenerateJWT ...
func GenerateJWT(usr *repos.User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = usr.ID
	claims["user"] = usr.FullName
	claims["iat"] = time.Now().Unix()
	claims["exp"] = time.Now().Add(time.Minute * 60).Unix()

	// I think this is in the wrong place/incorrect usage (Brian 2.23.21)
	// Nav to: https://jwt.io/  paste tokenString in text field.
	signKey = []byte("supersecret")

	tokenString, err := token.SignedString(signKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func create_link_token(c *gin.Context) {

	// Create a link_token for the given user
	linkTokenResp, err := client.CreateLinkToken(plaid.LinkTokenConfigs{
		User: &plaid.LinkTokenUser{
		  ClientUserID:             "123-test-user-id",
		},
		ClientName:            "My App",
		Products:              []string{"auth", "transactions"},
		CountryCodes:          []string{"US"},
		Language:              "en",
		Webhook:               "https://webhook-uri.com",
		LinkCustomizationName: "default",
		AccountFilters: &map[string]map[string][]string{
		  "depository": map[string][]string{
			"account_subtypes": []string{"checking", "savings"},
		  },
		},
	  })
	linkToken := linkTokenResp.LinkToken
	if err != nil {
		panic(err)
	}
	fmt.Println(linkToken)

	// Send the data to the client
	c.JSON(http.StatusOK, gin.H{
	  "link_token": linkToken,
	})
  }

func getAccessToken(c *gin.Context) {
	publicToken := c.PostForm("public_token")
	response, err := client.ExchangePublicToken(publicToken)
	accessToken = response.AccessToken
	itemID = response.ItemID
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("public token: " + publicToken)
	fmt.Println("access token: " + accessToken)
	fmt.Println("item ID: " + itemID)
	c.JSON(http.StatusOK, gin.H{
		"access_token": accessToken,
		"item_id":      itemID,
	})
}