package main

import "github.com/go-pg/pg"

type LinkDao struct {
	DB *pg.DB
}

func (s *LinkDao) ByID(id int) (*CrawlLink, error) {
	link := &CrawlLink{ID: id}
	if err := s.DB.Select(link); err != nil {
		return nil, err
	}
	return link, nil
}

func (s *LinkDao) Save(link *CrawlLink) error {
	if link.ID == 0 {
		return s.DB.Insert(link)
	}
	return s.DB.Update(link)
}

func (s *LinkDao) DeleteAllForScan(scanID int) error {
	_, err := s.DB.Model(&CrawlLink{}).Where("scan_id = ?", scanID).Delete()
	return err
}
