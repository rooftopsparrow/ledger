package repos

import (
	"os"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

var tables = []interface{}{
	(*User)(nil),
}

// CreateSchema creates the tables in the database
func CreateSchema(db *pg.DB) error {
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
