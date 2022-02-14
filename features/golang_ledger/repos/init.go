package repos

import (
	"os"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

var tables = []interface{}{
	(*User)(nil),
	(*PlaidItem)(nil),
	(*Account)(nil),
}

type Repo struct {
	db    *pg.DB
	Users interface {
		CreateUser(name string, email string, password string) (*User, error)
		FetchUserbyID(id int64) (*User, error)
		SaveUserbyID(u *User) (*User, error)
	}
	Accounts interface {
	}
}

func CreateRepo(db *pg.DB) *Repo {
	repo := &Repo{
		db:       db,
		Users:    &UserRepo{db: db},
		Accounts: &AccountRepo{db: db},
	}
	return repo
}

// CreateSchema creates the tables in the database
func (r *Repo) CreateSchema(db *pg.DB) error {
	temp := os.Getenv("POSTGRES_TEMP") == "true"
	for _, table := range tables {
		opts := &orm.CreateTableOptions{
			IfNotExists: true,
			Temp:        temp,
		}
		if err := db.Model(table).CreateTable(opts); err != nil {
			return err
		}
	}
	return nil
}
