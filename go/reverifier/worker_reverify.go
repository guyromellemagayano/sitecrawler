package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"go.uber.org/zap"
)

func ReverifyWorker(logger *zap.SugaredLogger, db *database.Database, verifyService *common.VerifyService) error {
	logger.Info("Starting reverifier")
	defer logger.Info("Reverifier finished")
	return db.SiteDao.ForEach(func(site *database.CrawlSite) error {
		log := logger.With("site_id", site.ID)

		return verifyService.VerifySite(log, site.ID)
	},
		database.Where("t.deleted_at IS NULL"),
	)
}
