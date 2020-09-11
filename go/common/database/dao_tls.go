package database

import (
	"github.com/go-pg/pg"
)

type TlsDao struct {
	DB *pg.DB
}

func (t *TlsDao) Save(tls *CrawlTl) error {
	if tls.ID == 0 {
		return t.DB.Insert(tls)
	}
	return t.DB.Update(tls)
}

func (t *TlsDao) DeleteAllForScan(scanID int) error {
	subquery := t.DB.Model(&CrawlLink{}).Column("tls_id").Where("scan_id = ?", scanID)
	_, err := t.DB.Model(&CrawlTl{}).Where("id IN (?)", subquery).Delete()
	return err
}
