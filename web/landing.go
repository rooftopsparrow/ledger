package main

// Landing page (ledger.html) on local server with form fields.
// Reference:
// https://astaxie.gitbooks.io/build-web-application-with-golang/content/en/04.1.html

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	_ "github.com/joho/godotenv/autoload"
	bc "golang.org/x/crypto/bcrypt"
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

// Temp env var expires on session close ("superduper")
var jwtEnv = os.Getenv("jwt")
var signKey = []byte("")

// User pw encrypted
var bcryptPW = []byte("")

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

	encryptPassword(details.Password)

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

	// tokenString, err := GenerateJWT(user)
	// if err != nil {
	// 	fmt.Println("Error creating JWT.")
	// }
	// fmt.Println(tokenString)

}

/*
 encryptPassword() & confirmPassword()
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
	fmt.Println("HASH: " + string(hashedPassword))

	// Test hash validation. 
	confirmPassword(hashedPassword)

	return string(hashedPassword)
}

// Compare password to db pw hash record (login pw validation).
func confirmPassword(hash []byte) {
	err := bc.CompareHashAndPassword(hash, bcryptPW)
	fmt.Println(err) // nil means it is a match
}

// GenerateJWT ...
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
