package common

import (
	"fmt"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

type IsTypePostprocessor struct {
	Database *database.Database
}

func (p *IsTypePostprocessor) OnLink(l *database.CrawlLink) error {
	return nil
}

func (p *IsTypePostprocessor) OnLinkLink(l *database.CrawlLinkLink) error {
	return p.handleChild(l.ToLinkID, "link")
}

func (p *IsTypePostprocessor) OnLinkImage(l *database.CrawlLinkImage) error {
	return p.handleChild(l.ToLinkID, "image")
}

func (p *IsTypePostprocessor) OnLinkScript(l *database.CrawlLinkScript) error {
	return p.handleChild(l.ToLinkID, "script")
}

func (p *IsTypePostprocessor) OnLinkStylesheet(l *database.CrawlLinkStylesheet) error {
	return p.handleChild(l.ToLinkID, "stylesheet")
}

func (p *IsTypePostprocessor) handleChild(toID int, name string) error {
	return p.Database.LinkDao.Update(toID, fmt.Sprintf("cached_is_%s = true", name))
}
