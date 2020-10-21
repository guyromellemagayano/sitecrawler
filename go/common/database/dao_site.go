package database

import (
	"github.com/go-pg/pg"
)

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

func (s *SiteDao) AllVerifiedForGroup(groupID int) ([]CrawlSite, error) {
	var sites []CrawlSite
	err := s.DB.Model(&sites).
		Join("JOIN auth_user AS u ON u.id = t.user_id").
		Join("JOIN auth_user_groups as ug ON ug.user_id = u.id").
		Where("ug.group_id = ?", groupID).
		Where("t.verified = true").
		Select()
	if err != nil {
		return nil, err
	}
	return sites, nil
}

func (s *SiteDao) AllForEach(f func(*CrawlSite) error) error {
	pageSize := 10
	results := make([]*CrawlSite, 0, pageSize)
	for page := 0; true; page++ {
		err := s.DB.Model(&results).Order("id ASC").Limit(pageSize).Offset(page * pageSize).Select(&results)
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
