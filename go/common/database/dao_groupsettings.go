package database

import (
	"github.com/go-pg/pg"
)

type GroupSettingsDao struct {
	DB *pg.DB
}

func (g *GroupSettingsDao) All() ([]CrawlGroupsetting, error) {
	var groups []CrawlGroupsetting
	err := g.DB.Model(&groups).Select()
	if err != nil {
		return nil, err
	}
	return groups, nil
}
