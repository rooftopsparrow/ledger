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
)

// UserInfo form fields.
type UserInfo struct {
	Email    string
	Name     string `json:"name"`
	Password string `json:"password"`
}

var repo *repos.Repo
var signKey = []byte("")

func main() {

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
	err = http.ListenAndServe(":8080", nil)
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
