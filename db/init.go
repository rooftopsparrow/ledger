package db

import (
	"fmt"
	"os"

	pg "github.com/go-pg/pg/v10"
)

// Init starts the database pool
func Init() *pg.DB {
	host := os.Getenv("POSTGRES_HOST")
	if host == "" {
		host = "localhost"
	}
	port := os.Getenv("POSTGRES_PORT")
	if port == "" {
		port = "5432"
	}
	user := os.Getenv("POSTGRES_DB")
	if user == "" {
		user = "postgres"
	}
	password := os.Getenv("POSTGRES_PASSWORD")
	opts := &pg.Options{
		ApplicationName: "ledger",
		Addr:            fmt.Sprintf("%s:%s", host, port),
		Password:        password,
		User:            user,
	}
	return pg.Connect(opts)
}

// const directory = "db/migrations"
// func main() {
// 	db := Init()
// 	err := migrations.Run(db, directory, os.Args)
// 	if err != nil {
// 		log.Fatalln(err)
// 	}
// }
