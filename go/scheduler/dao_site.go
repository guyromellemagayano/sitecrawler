package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/go-pg/pg"
)

type SiteDao struct {
	DB *pg.DB
}

func (s *SiteDao) AllVerifiedForGroup(groupID int) ([]common.CrawlSite, error) {
	var sites []common.CrawlSite
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
