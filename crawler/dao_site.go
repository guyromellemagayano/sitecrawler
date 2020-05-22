package main

import "github.com/go-pg/pg"

type SiteDao struct {
	DB *pg.DB
}

func (s *SiteDao) ByID(id int) (*CrawlSite, error) {
	site := &CrawlSite{ID: id}
	if err := s.DB.Model(site).Select(); err != nil {
		return nil, err
	}
	return site, nil
}

func (s *SiteDao) Save(site *CrawlSite) error {
	return s.DB.Update(site)
}
