package database

import (
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/go-pg/pg"
	"go.uber.org/zap"
)

type Database struct {
	GroupSettingsDao  *GroupSettingsDao
	LinkDao           *LinkDao
	LinkImageDao      *LinkImageDao
	LinkLinkDao       *LinkLinkDao
	LinkScriptDao     *LinkScriptDao
	LinkStylesheetDao *LinkStylesheetDao
	PageDataDao       *PageDataDao
	ScanDao           *ScanDao
	SiteDao           *SiteDao
	TlsDao            *TlsDao
	db                *pg.DB
}

func NewDatabase(log *zap.SugaredLogger, env string) *Database {
	dbPass := common.Env("DB_PASS", "crawldev")
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
	if common.Env("LOG_SQL", "false") == "true" {
		db.AddQueryHook(DbLogger{log})
	}
	for {
		if _, err := db.Exec("SELECT 1"); err != nil {
			log.Infof("Waiting for db: %v", err)
			time.Sleep(time.Second)
			continue
		}
		break
	}

	return &Database{
		GroupSettingsDao:  &GroupSettingsDao{db},
		LinkDao:           &LinkDao{db},
		LinkImageDao:      &LinkImageDao{db},
		LinkLinkDao:       &LinkLinkDao{db},
		LinkScriptDao:     &LinkScriptDao{db},
		LinkStylesheetDao: &LinkStylesheetDao{db},
		PageDataDao:       &PageDataDao{db},
		ScanDao:           &ScanDao{db},
		SiteDao:           &SiteDao{db},
		TlsDao:            &TlsDao{db},
		db:                db,
	}
}

func (d *Database) Close() error {
	return d.db.Close()
}
