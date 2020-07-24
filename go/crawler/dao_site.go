package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/go-pg/pg"
)

type SiteDao struct {
	DB *pg.DB
}

func (s *SiteDao) ByID(id int) (*common.CrawlSite, error) {
	site := &common.CrawlSite{ID: id}
	if err := s.DB.Select(site); err != nil {
		return nil, err
	}
	return site, nil
}

func (s *SiteDao) Save(site *common.CrawlSite) error {
	if site.ID == 0 {
		return s.DB.Insert(site)
	}
	return s.DB.Update(site)
}
