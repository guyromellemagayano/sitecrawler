package database

import (
	"github.com/go-pg/pg"
)

type LinkDao struct {
	DB *pg.DB
}

func (s *LinkDao) ByID(id int) (*CrawlLink, error) {
	link := &CrawlLink{ID: id}
	if err := s.DB.Select(link); err != nil {
		return nil, err
	}
	return link, nil
}

func (s *LinkDao) Save(link *CrawlLink) error {
	if link.ID == 0 {
		return s.DB.Insert(link)
	}
	return s.DB.Update(link)
}

func (s *LinkDao) DeleteAllForScan(scanID int) error {
	_, err := s.DB.Model(&CrawlLink{}).Where("scan_id = ?", scanID).Delete()
	return err
}

func (s *LinkDao) Update(id int, fields ...string) error {
	if len(fields) == 0 {
		return nil
	}
	q := s.DB.Model(&CrawlLink{ID: id}).WherePK()

	for _, f := range fields {
		q.Set(f)
	}

	_, err := q.Update()
	return err
}

func (s *LinkDao) AllForScanForEach(scanID int, f func(*CrawlLink) error) error {
	pageSize := 10
	results := make([]*CrawlLink, 0, pageSize)
	for page := 0; true; page++ {
		err := s.DB.Model(&results).Where("scan_id = ?", scanID).Order("id ASC").Limit(pageSize).Offset(page * pageSize).Select(&results)
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
