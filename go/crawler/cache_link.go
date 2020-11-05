package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

type LinkCache struct {
	LinkIDs   map[string]int
	PageCount int
}

func NewLinkCache(db *database.Database, scanID int) (*LinkCache, error) {
	c := &LinkCache{
		LinkIDs:   make(map[string]int),
		PageCount: 0,
	}
	err := db.LinkDao.ForEach(func(l *database.CrawlLink) error {
		c.Add(l)
		return nil
	}, database.Where("scan_id = ?", scanID))
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (c *LinkCache) Add(link *database.CrawlLink) {
	c.LinkIDs[link.Url] = link.ID
	if link.Type == common.TYPE_PAGE {
		c.PageCount++
	}
}
