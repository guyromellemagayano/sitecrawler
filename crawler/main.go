package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-pg/pg"
)

func main() {
	port := "8000"
	if portEnv, ok := os.LookupEnv("PORT"); ok {
		port = portEnv
	}

	db := pg.Connect(&pg.Options{
		Addr:     "db:5432",
		User:     "postgres",
		Password: "crawldev",
		Database: "postgres",
	})
	defer db.Close()

	siteDao := &SiteDao{DB: db}

	verifyService := &VerifyService{SiteDao: siteDao}

	http.Handle("/verify", &VerifyEndpoint{VerifyService: verifyService})

	listen := fmt.Sprintf(":%s", port)
	log.Printf("Listening on: %s", listen)
	log.Fatal(http.ListenAndServe(listen, nil))
}
