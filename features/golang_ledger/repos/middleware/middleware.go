package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	u "msudenver.edu/ledger/repos/utility"
)

// IsLogin ...
func IsLogin(r http.Header) ([]byte, error) {

	tokenString := r.Get("Authorization")
	if len(tokenString) == 0 {
		return nil, errors.New("UnAuthorized")
	}
	tokenString = strings.Replace(tokenString, "Bearer ", "", 1)
	claims, err := verifyToken(tokenString)
	if err != nil {

		return nil, err
	}
	return u.Marshal(claims), nil
}

func verifyToken(tokenString string) (jwt.Claims, error) {
	signingKey := []byte(os.Getenv("jwt"))
	fmt.Println("key", string(signingKey))
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})
	if err != nil {
		return nil, err
	}
	return token.Claims, err
}
