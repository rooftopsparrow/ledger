package main

import (
	"github.com/go-pg/pg/v10/orm"
	migrations "github.com/robinjoseph08/go-pg-migrations/v3"
)

func init() {
	up := func(db orm.DB) error {
		_, err := db.Exec(`
		CREATE TABLE users (
			-- internal user identity ( reserve first 5k for internal use )
			id INT GENERATED BY DEFAULT AS IDENTITY (START WITH 5000),
			full_name TEXT NOT NULL CHECK (full_name != ''),
			email TEXT NOT NULL CHECK (email != ''),
			password TEXT NOT NULL,
			verified_at TIMESTAMP,
			created_at TIMESTAMP,
			updated_at TIMESTAMP,
			disabled_at TIMESTAMP
		);
		`)
		return err
	}
	down := func(db orm.DB) error {
		_, err := db.Exec(`DROP TABLE users;`)
		return err
	}

	opts := migrations.MigrationOptions{}

	migrations.Register("20210208055128_users", up, down, opts)
}