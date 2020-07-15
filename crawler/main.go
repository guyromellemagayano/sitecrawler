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
	if env("LOG_SQL", "false") == "true" {
		db.AddQueryHook(dbLogger{})
	}

	siteDao := &SiteDao{DB: db}
	scanDao := &ScanDao{DB: db}
	linkDao := &LinkDao{DB: db}
	linkLinkDao := &LinkLinkDao{DB: db}

	loadService := &LoadService{}
	verifyService := &VerifyService{SiteDao: siteDao, LoadService: loadService}
	scanService := &ScanService{
		ScanDao:       scanDao,
		LinkDao:       linkDao,
		LinkLinkDao:   linkLinkDao,
		VerifyService: verifyService,
		LoadService:   loadService,
	}

	http.Handle("/verify", &VerifyEndpoint{VerifyService: verifyService})
	http.Handle("/scan", &ScanEndpoint{ScanService: scanService})

	listen := fmt.Sprintf(":%s", port)
	log.Printf("Listening on: %s", listen)
	log.Fatal(http.ListenAndServe(listen, nil))
}

type dbLogger struct{}

func (d dbLogger) BeforeQuery(q *pg.QueryEvent) {}

func (d dbLogger) AfterQuery(q *pg.QueryEvent) {
	log.Println(q.FormattedQuery())
}
