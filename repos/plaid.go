package repos

import (
	"time"
	"github.com/go-pg/pg/v10"
)

type PlaidRepo struct {
	db *pg.DB
}

type PlaidItem struct {
	tableName struct{}   `pg:"plaid_newest"`
	ID        int64     `json:"-"`
	User		  string
	AccessToken   string `pg:",unique,notnull"`
	ItemId 		  string
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func (r *PlaidRepo) CreatePlaid(token string, itemId string) (*PlaidItem, error) {
	now := time.Now()
	plaid := &PlaidItem{
		AccessToken:  token,
		ItemId:		itemId,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if _, err := r.db.Model(plaid).Returning("*").Insert(); err != nil {
		return nil, err
	}

	return plaid, nil
}

type LinkEvent struct {
	ID            uint64
	Type          string
	UserID        uint64
	LinkSessionID string
	RequestID     string
	ErrorType     string
	ErrorCode     string
	CreatedAt     time.Time `pg:"default:now()"`
}

type ApiEvent struct {
	ID         uint64
	ItemID     uint64
	PlaidMethd string
	Arguments  string
	RequestID  string
	ErrorType  string
	ErrorCode  string
	CreatedAt  time.Time
}

func LinkAccount() {

}
