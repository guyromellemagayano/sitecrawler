package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/go-pg/pg"
)

type ScanDao struct {
	DB *pg.DB
}

func (s *ScanDao) Latest(siteID int) (*common.CrawlScan, error) {
	scan := &common.CrawlScan{}
	err := s.DB.Model(scan).Where("site_id = ?", siteID).Order("started_at DESC").Limit(1).Select()
	if err != nil {
		return nil, err
	}
	return scan, nil
}

func (s *ScanDao) Save(scan *common.CrawlScan) error {
	if scan.ID == 0 {
		return s.DB.Insert(scan)
	}
	return s.DB.Update(scan)
}
