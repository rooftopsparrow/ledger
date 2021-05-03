package repos

import (
	"time"

	"github.com/Rhymond/go-money"
	"github.com/go-pg/pg/v10"
)

type AccountRepo struct {
	db *pg.DB
}

type Account struct {
	ID        uint64
	UserID    uint64
	User      *User
	AccountID string `pg:",notnull"`
	Name      string `pg:",notnull"`
	Mask      string `pg:",notnull"`
	Balance   money.Money
	Type      string
	Subtype   string
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt time.Time
}

func (r *AccountRepo) CreateAccount(accountId, name, mask string, balance money.Money) (*Account, error) {
	account := &Account{
		AccountID: accountId,
		Name:      name,
		Mask:      mask,
		Type:      "depository",
		Subtype:   "checking",
	}
	_, err := r.db.Model(account).Insert()
	if err != nil {
		return nil, err
	}
	return account, nil
}
