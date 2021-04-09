package repos

import (
	"fmt"
	"regexp"
	"time"

	"github.com/go-pg/pg/v10"
)

// UserRepo is a custom model type which wraps
// the sql.DB connection pool and other needed types
type UserRepo struct {
	db *pg.DB
}

// CreateUser inserts new user records
func (r *UserRepo) CreateUser(name string, email string, password string,) (*User, error) {
	now := time.Now()
	user := &User{
		FullName:  name,
		Email:     email,
		PW:  	   password,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := user.isValid(); err != nil {
		return nil, err
	}
	if _, err := r.db.Model(user).Returning("*").Insert(); err != nil {
		return nil, err
	}
	return user, nil
}

// Thanks to Edd Turtle https://golangcode.com/validate-an-email-address/
var emailRegex = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")

// User is the struct we use to represent a user of the system
type User struct {
	tableName struct{}  `pg:"users"`
	ID        int64     `json:"-"`
	FullName  string    `pg:",notnull"`
	Email     string    `pg:",notnull,unique"`
	PW 	  string 	
	CreatedAt time.Time `pg:"default:now()"`
	UpdatedAt time.Time
	DeletedAt time.Time `pg:",soft_delete"`
}

func (u User) isValid() error {
	var errs []error
	if u.FullName == "" {
		errs = append(errs, fmt.Errorf("Name is required"))
	}
	if u.Email == "" {
		errs = append(errs, fmt.Errorf("Email is required"))
	} else if !emailRegex.MatchString(u.Email) {
		errs = append(errs, fmt.Errorf("Email is not a valid address"))
	}
	if len(errs) > 0 {
		return fmt.Errorf("Invalid: %s", errs)
	}
	return nil
}
