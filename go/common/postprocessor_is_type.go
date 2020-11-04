package common

import (
	"fmt"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

type IsTypePostprocessor struct {
}

func (p *IsTypePostprocessor) OnLink(db *database.Database, l *database.CrawlLink) error {
	return nil
}

func (p *IsTypePostprocessor) OnLinkLink(db *database.Database, l *database.CrawlLinkLink) error {
	return p.handleChild(db, l.ToLinkID, "link")
}

func (p *IsTypePostprocessor) OnLinkImage(db *database.Database, l *database.CrawlLinkImage) error {
	return p.handleChild(db, l.ToLinkID, "image")
}

func (p *IsTypePostprocessor) OnLinkScript(db *database.Database, l *database.CrawlLinkScript) error {
	return p.handleChild(db, l.ToLinkID, "script")
}

func (p *IsTypePostprocessor) OnLinkStylesheet(db *database.Database, l *database.CrawlLinkStylesheet) error {
	return p.handleChild(db, l.ToLinkID, "stylesheet")
}

func (p *IsTypePostprocessor) handleChild(db *database.Database, toID int, name string) error {
	return db.LinkDao.Update(toID, fmt.Sprintf("cached_is_%s = true", name))
}
