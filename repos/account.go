package repos

import (
	"time"

	"github.com/Rhymond/go-money"
	"github.com/go-pg/pg/v10"
)

type AccountRepo struct {
	db *pg.DB
}

// Item reprensents a generic element from Plaid
type PlaidItem struct {
	ID            uint64
	User          *User  `pg:",notnull"`
	AccessToken   string `pg:",unique,notnull"`
	ItemID        string `pg:"on_delete:CASCADE,notnull"`
	InstitutionID string `pg:",notnull"`
	Status        string `pg:",notnull"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type Account struct {
	ID               uint64
	Item             *PlaidItem
	AccountID        string `pg:",notnull"`
	Name             string `pg:",notnull"`
	Mask             string `pg:",notnull"`
	LongName         string
	CurrentBalance   money.Amount
	AvailableBalance money.Amount
	Currency         money.Currency
	Type             string
	Subtype          string
	CreatedAt        time.Time
	UpdatedAt        time.Time
	DeletedAt        time.Time
}
