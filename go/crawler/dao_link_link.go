package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/go-pg/pg"
)

type LinkLinkDao struct {
	DB *pg.DB
}

func (s *LinkLinkDao) ByID(id int) (*common.CrawlLinkLink, error) {
	link_link := &common.CrawlLinkLink{ID: id}
	if err := s.DB.Select(link_link); err != nil {
		return nil, err
	}
	return link_link, nil
}

func (s *LinkLinkDao) Save(link_link *common.CrawlLinkLink) error {
	if link_link.ID == 0 {
		return s.DB.Insert(link_link)
	}
	return s.DB.Update(link_link)
}

func (s *LinkLinkDao) DeleteAllForScan(scanID int) error {
	subquery := s.DB.Model(&common.CrawlLink{}).Column("id").Where("scan_id = ?", scanID)
	_, err := s.DB.Model(&common.CrawlLinkLink{}).Where("from_link_id IN (?)", subquery).Delete()
	return err
}
