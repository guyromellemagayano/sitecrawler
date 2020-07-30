package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/go-pg/pg"
)

type LinkStylesheetDao struct {
	DB *pg.DB
}

func (s *LinkStylesheetDao) ByID(id int) (*common.CrawlLinkStylesheet, error) {
	link_stylesheet := &common.CrawlLinkStylesheet{ID: id}
	if err := s.DB.Select(link_stylesheet); err != nil {
		return nil, err
	}
	return link_stylesheet, nil
}

func (s *LinkStylesheetDao) Save(link_stylesheet *common.CrawlLinkStylesheet) error {
	if link_stylesheet.ID == 0 {
		return s.DB.Insert(link_stylesheet)
	}
	return s.DB.Update(link_stylesheet)
}

func (s *LinkStylesheetDao) DeleteAllForScan(scanID int) error {
	subquery := s.DB.Model(&common.CrawlLink{}).Column("id").Where("scan_id = ?", scanID)
	_, err := s.DB.Model(&common.CrawlLinkStylesheet{}).Where("from_link_id IN (?)", subquery).Delete()
	return err
}
