package database

import (
	"github.com/go-pg/pg"
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

func NewDatabase(db *pg.DB) *Database {
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
