package main

import (
	"log"
	"os"

	"github.com/go-pg/pg/v10"
	migrations "github.com/robinjoseph08/go-pg-migrations/v3"
)

const directory = "db/migrations"

func main() {
	// host, hostIsSet := os.LookupEnv("POSTGRES_HOST")
	// if !hostIsSet {
	// 	host = "localhost"
	// }
	// port, portIsSet := os.LookupEnv("POSTGRES_PORT")
	// if !portIsSet {
	// 	port = "5432"
	// }
	// user, userIsSet := os.LookupEnv("POSTGRES_DB")

	// addr := fmt.Sprint("%s:%d", host, port)
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Password: "mysecretpassword",
	})
	err := migrations.Run(db, directory, os.Args)
	if err != nil {
		log.Fatalln(err)
	}
}
