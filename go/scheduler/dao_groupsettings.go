package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/go-pg/pg"
)

type GroupSettingsDao struct {
	DB *pg.DB
}

func (g *GroupSettingsDao) All() ([]common.CrawlGroupsetting, error) {
	var groups []common.CrawlGroupsetting
	err := g.DB.Model(&groups).Select()
	if err != nil {
		return nil, err
	}
	return groups, nil
}
