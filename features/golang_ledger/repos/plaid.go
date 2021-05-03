package repos

import "time"

type PlaidItem struct {
	ID            uint64
	User          *User  `pg:",notnull"`
	AccessToken   string `pg:",unique,notnull"`
	ItemID        string `pg:",notnull"`
	InstitutionID string `pg:",notnull"`
	Status        string `pg:",notnull"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
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
