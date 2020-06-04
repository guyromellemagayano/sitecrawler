package main

import "github.com/go-pg/pg"

type ScanDao struct {
	DB *pg.DB
}

func (s *ScanDao) ByID(id int) (*CrawlScan, error) {
	scan := &CrawlScan{ID: id}
	if err := s.DB.Model(scan).WherePK().Relation("Site").Select(); err != nil {
		return nil, err
	}
	return scan, nil
}

func (s *ScanDao) Save(scan *CrawlScan) error {
	if scan.ID == 0 {
		return s.DB.Insert(scan)
	}
	return s.DB.Update(scan)
}
