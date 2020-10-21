package common

import (
	"time"

	"github.com/go-pg/pg"
	"go.uber.org/zap"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

func ConfigureDatabase(log *zap.SugaredLogger, env string) *database.Database {
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
		db.AddQueryHook(database.DbLogger{log})
	}
	for {
		if _, err := db.Exec("SELECT 1"); err != nil {
			log.Infof("Waiting for db: %v", err)
			time.Sleep(time.Second)
			continue
		}
		break
	}
	return database.NewDatabase(db)
}
