package database

import (
	"github.com/go-pg/pg"
)

type LinkScriptDao struct {
	DB *pg.DB
}

func (s *LinkScriptDao) ByID(id int) (*CrawlLinkScript, error) {
	link_script := &CrawlLinkScript{ID: id}
	if err := s.DB.Select(link_script); err != nil {
		return nil, err
	}
	return link_script, nil
}

func (s *LinkScriptDao) Save(link_script *CrawlLinkScript) error {
	if link_script.ID == 0 {
		return s.DB.Insert(link_script)
	}
	return s.DB.Update(link_script)
}

func (s *LinkScriptDao) DeleteAllForScan(scanID int) error {
	subquery := s.DB.Model(&CrawlLink{}).Column("id").Where("scan_id = ?", scanID)
	_, err := s.DB.Model(&CrawlLinkScript{}).Where("from_link_id IN (?)", subquery).Delete()
	return err
}
