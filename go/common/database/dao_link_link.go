package database

import (
	"github.com/go-pg/pg"
)

type LinkLinkDao struct {
	DB *pg.DB
}

func (s *LinkLinkDao) ByID(id int) (*CrawlLinkLink, error) {
	link_link := &CrawlLinkLink{ID: id}
	if err := s.DB.Select(link_link); err != nil {
		return nil, err
	}
	return link_link, nil
}

func (s *LinkLinkDao) Save(link_link *CrawlLinkLink) error {
	if link_link.ID == 0 {
		return s.DB.Insert(link_link)
	}
	return s.DB.Update(link_link)
}

func (s *LinkLinkDao) DeleteAllForScan(scanID int) error {
	subquery := s.DB.Model(&CrawlLink{}).Column("id").Where("scan_id = ?", scanID)
	_, err := s.DB.Model(&CrawlLinkLink{}).Where("from_link_id IN (?)", subquery).Delete()
	return err
}

func (s *LinkLinkDao) AllForLinkForEach(linkID int, f func(*CrawlLinkLink) error) error {
	pageSize := 10
	results := make([]*CrawlLinkLink, 0, pageSize)
	for page := 0; true; page++ {
		err := s.DB.Model(&results).Where("from_link_id = ?", linkID).Order("id ASC").Limit(pageSize).Offset(page * pageSize).Select(&results)
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
