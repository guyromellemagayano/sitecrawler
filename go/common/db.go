package common

import "github.com/go-pg/pg"

func NewDatabase(env string) *pg.DB {
	dbPass := Env("DB_PASS", "crawldev")
	var pgOptions *pg.Options
	if env == "production" {
		pgOptions = &pg.Options{
			Addr:     "terraform-20200810173347645600000001.ceavi2ewfiqg.us-east-1.rds.amazonaws.com:5432",
			User:     "production",
			Password: dbPass,
			Database: "production",
		}
	} else {
		pgOptions = &pg.Options{
			Addr:     "db:5432",
			User:     "postgres",
			Password: dbPass,
			Database: "postgres",
		}
	}
	db := pg.Connect(pgOptions)
	if Env("LOG_SQL", "false") == "true" {
		db.AddQueryHook(DbLogger{})
	}
	return db
}
