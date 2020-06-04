package main

import "github.com/go-pg/pg"

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
