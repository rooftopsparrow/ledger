package repos

import (
	"fmt"
	"github.com/go-pg/pg/v10"
	"math/rand"
	"time"
	// "msudenver.edu/ledger/db"
	// "msudenver.edu/ledger/repos"
)

type EnvelopeRepo struct {
	db *pg.DB
}

// Basic struct for "Goals" & "Expenses" envelope'ing (From Ledger proposal)
type EnvelopeInfo struct {
	ID             int64  `json:"-"`
	Name           string `pg:",unique,notnull"`
	CurrentBalance int
	StartDate      string `pg:",notnull"`
	TargetDate     string `pg:",notnull"`
	Notes          string
	TargetAmount   int
}

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
date := time.Date(2009, time.January, 10, 23, 0, 0, 0, time.UTC
*/
// func CreateEnvelope(name, startDate, targetDate, notes string, balance int, targetAmount int) (string, int) {

// 	envelope := name + " " + startDate + " " + targetDate + " " + notes

// 	return envelope, targetAmount
// }

func (r *EnvelopeRepo) CreateEnvelope(name string, balance int) (*EnvelopeInfo, error) {
	envelope := &EnvelopeInfo{
		Name:           name,
		CurrentBalance: balance,
	}

	return envelope, nil
}

func DeleteEnvelope(name string) {

}

func AddFunds(name string, funds int) {

}

func RemoveFunds(name string, funds int) {

}

func CheckAvailableBalance(name string) {
	// Compare current "Safe-to-Spend" value w/ this User's envelope amount.

}

// func main() {
// 	// now := time.Now()
// 	// fmt.Printf("current time is :%s", now)

// 	date := time.Date(2009, time.January, 10, 23, 0, 0, 0, time.UTC)
// 	fmt.Printf("\nExample date: %s\n\n", date.Local())
// 	name := "Bills"
// 	start := date.String()
// 	// mockData()
// 	// fmt.Println(CreateEnvelope(name, start, start, "Yooo", 50, 150))

// }
