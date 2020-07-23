package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/go-pg/pg"
)

type ScanDao struct {
	DB *pg.DB
}

func (s *ScanDao) ByID(id int) (*common.CrawlScan, error) {
	scan := &common.CrawlScan{ID: id}
	if err := s.DB.Model(scan).WherePK().Relation("Site").Select(); err != nil {
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
