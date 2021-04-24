/*
	Initial outline of Envelope repo w/ funcs to complete MVP (from Ledger Proposal)
	Input needed:
		1. Ideas of any missing, additional, or removeable funcs for MVP?
		2. Ideas for how we can apply to achieve MVP? (front end interaction, database, mocked, etc.)
*/

package main

import (
	"fmt"
	"math/rand"
	"time"
	// "net/http"
	// "encoding/json"
	// jwt "github.com/dgrijalva/jwt-go"
	// "github.com/labstack/echo/v4"
	// "github.com/plaid/plaid-go/plaid"
	// bc "golang.org/x/crypto/bcrypt"
	// "msudenver.edu/ledger/db"
	// "msudenver.edu/ledger/repos"
)

// Basic struct for "Goals" & "Expenses" envelope'ing (From Ledger proposal)
type EnvelopeInfo struct {
	Name         string
	StartDate    string
	TargetDate   string
	Notes        string
	TargetAmount int
}

// var repo *repos.Repo

func mockData() {
	// Randomize a "Safe-to-Spend" amount?
	// rand.Seed(time.Now().UnixNano())
	// min := 1000
	// max := 10000
	var balance = rand.Intn((10000 - 1000) + 1000)
	fmt.Println("Safe-to-Spend: $", balance)

}

/*
TODO:
Prompt user for Name, StartDate, TargetDate (by schedule params),
notes/details, and TargetAmount of envelope.

Start/Target Date format:
func Date(year int, month Month, day, hour, min, sec, nsec int, loc *Location) Time
date := time.Date(2009, time.January, 10, 23, 0, 0, 0, time.UTC)

 *** hardcoded not using all required Time pkg Date func args. 4.23.21 ***

*/
func CreateEnvelope(name, startDate, targetDate, notes string, targetAmount int) (string, int) {

	envelope := name + " " + startDate + " " + targetDate + " " + notes

	return envelope, targetAmount
}

/*
 TODO:
 Remove existing envelope by name (Return funds to "Safe-to-Spend"?).
*/
func DeleteEnvelope(name string) {

}

/*
 TODO:
 Add funds to envelope (manually or automatically).

 AddFunds(User name, env name string, amount int, schedule Date)
*/
func AddFunds(name string, funds int) {

}

/*
 TODO:
 Remove funds from envelope (manually or automatically).

 RemoveFunds(User name, env name string, amount int, schedule Date)
*/
func RemoveFunds(name string, funds int) {

}

/*
 TODO:
 Determine envelope availability. "Safe-to-Spend" funds and/or "Overdraft"

CheckAvailableBalance(User name, env name string, amount int)
*/
func CheckAvailableBalance(name string) {
	// Compare current "Safe-to-Spend" value w/ this User's envelope amount.

}

func main() {
	// now := time.Now()
	// fmt.Printf("current time is :%s", now)

	date := time.Date(2009, time.January, 10, 23, 0, 0, 0, time.UTC)
	fmt.Printf("\nExample date: %s\n\n", date.Local())

	// mockData()
	fmt.Println(CreateEnvelope(
		"New Car\n",
		" Start Date: 2021-01-10\n ",
		"Target Date: 2022-12-31\n ",
		"'Afford new car by end of next year, if amount: X is placed into envelope bi-weekly.'\n "+
			" Target Amount: ", 30000))

}
