package database

import (
	"github.com/go-pg/pg"
)

type LinkStylesheetDao struct {
	DB *pg.DB
}

func (s *LinkStylesheetDao) ByID(id int) (*CrawlLinkStylesheet, error) {
	link_stylesheet := &CrawlLinkStylesheet{ID: id}
	if err := s.DB.Select(link_stylesheet); err != nil {
		return nil, err
	}
	return link_stylesheet, nil
}

func (s *LinkStylesheetDao) Save(link_stylesheet *CrawlLinkStylesheet) error {
	if link_stylesheet.ID == 0 {
		return s.DB.Insert(link_stylesheet)
	}
	return s.DB.Update(link_stylesheet)
}

func (s *LinkStylesheetDao) DeleteAllForScan(scanID int) error {
	subquery := s.DB.Model(&CrawlLink{}).Column("id").Where("scan_id = ?", scanID)
	_, err := s.DB.Model(&CrawlLinkStylesheet{}).Where("from_link_id IN (?)", subquery).Delete()
	return err
}

func (s *LinkStylesheetDao) AllForLinkForEach(linkID int, f func(*CrawlLinkStylesheet) error) error {
	pageSize := 10
	results := make([]*CrawlLinkStylesheet, 0, pageSize)
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
