package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/go-pg/pg"
)

type LinkImageDao struct {
	DB *pg.DB
}

func (s *LinkImageDao) ByID(id int) (*common.CrawlLinkImage, error) {
	link_image := &common.CrawlLinkImage{ID: id}
	if err := s.DB.Select(link_image); err != nil {
		return nil, err
	}
	return link_image, nil
}

func (s *LinkImageDao) Save(link_image *common.CrawlLinkImage) error {
	if link_image.ID == 0 {
		return s.DB.Insert(link_image)
	}
	return s.DB.Update(link_image)
}

func (s *LinkImageDao) DeleteAllForScan(scanID int) error {
	subquery := s.DB.Model(&common.CrawlLink{}).Column("id").Where("scan_id = ?", scanID)
	_, err := s.DB.Model(&common.CrawlLinkImage{}).Where("from_link_id IN (?)", subquery).Delete()
	return err
}
