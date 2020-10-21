package database

import (
	"github.com/go-pg/pg"
)

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

func (s *ScanDao) Latest(siteID int) (*CrawlScan, error) {
	scan := &CrawlScan{}
	err := s.DB.Model(scan).Where("site_id = ?", siteID).Order("started_at DESC").Limit(1).Select()
	if err != nil {
		return nil, err
	}
	return scan, nil
}

func (s *ScanDao) Exists(id int) (bool, error) {
	scan := &CrawlScan{ID: id}
	exists, err := s.DB.Model(scan).WherePK().Relation("Site").Exists()
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (s *ScanDao) AllForSiteForEach(siteID int, f func(*CrawlScan) error) error {
	pageSize := 10
	results := make([]*CrawlScan, 0, pageSize)
	for page := 0; true; page++ {
		err := s.DB.Model(&results).Where("site_id = ?", siteID).Order("id ASC").Limit(pageSize).Offset(page * pageSize).Select(&results)
		if err != nil {
			return err
		}

		for _, el := range results {
			if err := f(el); err != nil {
				return err
			}
		}

		if len(results) < pageSize {
			break
		}

		results = results[:0]
	}
	return nil
}
