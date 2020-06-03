package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-pg/pg"
)

func env(name, def string) string {
	if value, ok := os.LookupEnv(name); ok {
		return value
	}
	return def
}

func main() {
	port := env("PORT", "8000")
	dbPass := env("DB_PASS", "crawldev")

	db := pg.Connect(&pg.Options{
		Addr:     "db:5432",
		User:     "postgres",
		Password: dbPass,
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
