package main

import "github.com/go-pg/pg"

type SiteDao struct {
	DB *pg.DB
}

func (s *SiteDao) ByID(id int) (*CrawlSite, error) {
	site := &CrawlSite{ID: id}
	if err := s.DB.Select(site); err != nil {
		return nil, err
	}
	return site, nil
}

func (s *SiteDao) Save(site *CrawlSite) error {
	if site.ID == 0 {
		return s.DB.Insert(site)
	}
	return s.DB.Update(site)
}
