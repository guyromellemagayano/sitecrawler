package common

import (
	"fmt"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

type SizePostprocessor struct {
	Database *database.Database
}

func (p *SizePostprocessor) OnLink(l *database.CrawlLink) error {
	if l.Type != TYPE_PAGE {
		return nil
	}
	return p.Database.LinkDao.Update(l.ID,
		"cached_size_images = 0",
		"cached_size_scripts = 0",
		"cached_size_stylesheets = 0",
		"cached_size_total = size",
	)
}

func (p *SizePostprocessor) OnLinkLink(l *database.CrawlLinkLink) error {
	return nil
}

func (p *SizePostprocessor) OnLinkImage(l *database.CrawlLinkImage) error {
	return p.handleChild(l.FromLinkID, l.ToLinkID, "images")
}

func (p *SizePostprocessor) OnLinkScript(l *database.CrawlLinkScript) error {
	return p.handleChild(l.FromLinkID, l.ToLinkID, "scripts")
}

func (p *SizePostprocessor) OnLinkStylesheet(l *database.CrawlLinkStylesheet) error {
	return p.handleChild(l.FromLinkID, l.ToLinkID, "stylesheets")
}

func (p *SizePostprocessor) handleChild(fromID, toID int, name string) error {
	toLink, err := p.Database.LinkDao.ByID(toID)
	if err != nil {
		return err
	}

	err = p.Database.LinkDao.Update(fromID,
		fmt.Sprintf("cached_size_%s = cached_size_%s + %v", name, name, toLink.Size),
		fmt.Sprintf("cached_size_total = cached_size_total + %v", toLink.Size),
	)
	if err != nil {
		return err
	}

	return nil
}
