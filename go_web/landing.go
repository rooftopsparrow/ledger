package main

// Landing page (ledger.html) on local server.
// Reference: https://www.alexedwards.net/blog/serving-static-sites-with-go

import (
	// "fmt"
	"log"
	"net/http"
)

func main() {

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	log.Println("Listening on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
	http.ListenAndServe(":8080", nil)
}
