package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/go-pg/pg"
)

type PageDataDao struct {
	DB *pg.DB
}

func (s *PageDataDao) ByID(id int) (*common.CrawlPagedatum, error) {
	pageData := &common.CrawlPagedatum{ID: id}
	if err := s.DB.Select(pageData); err != nil {
		return nil, err
	}
	return pageData, nil
}

func (s *PageDataDao) Save(pageData *common.CrawlPagedatum) error {
	if pageData.ID == 0 {
		return s.DB.Insert(pageData)
	}
	return s.DB.Update(pageData)
}

func (s *PageDataDao) DeleteAllForScan(scanID int) error {
	subquery := s.DB.Model(&common.CrawlLink{}).Column("id").Where("scan_id = ?", scanID)
	_, err := s.DB.Model(&common.CrawlPagedatum{}).Where("link_id IN (?)", subquery).Delete()
	return err
}
