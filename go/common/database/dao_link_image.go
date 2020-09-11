package database

import (
	"github.com/go-pg/pg"
)

type LinkImageDao struct {
	DB *pg.DB
}

func (s *LinkImageDao) ByID(id int) (*CrawlLinkImage, error) {
	link_image := &CrawlLinkImage{ID: id}
	if err := s.DB.Select(link_image); err != nil {
		return nil, err
	}
	return link_image, nil
}

func (s *LinkImageDao) Save(link_image *CrawlLinkImage) error {
	if link_image.ID == 0 {
		return s.DB.Insert(link_image)
	}
	return s.DB.Update(link_image)
}

func (s *LinkImageDao) DeleteAllForScan(scanID int) error {
	subquery := s.DB.Model(&CrawlLink{}).Column("id").Where("scan_id = ?", scanID)
	_, err := s.DB.Model(&CrawlLinkImage{}).Where("from_link_id IN (?)", subquery).Delete()
	return err
}
