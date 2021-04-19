package common

import (
	"fmt"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type SizePostprocessor struct {
}

func (p *SizePostprocessor) OnLink(db *database.Database, l *database.CrawlLink) error {
	if l.Type != TYPE_PAGE {
		return nil
	}
	return db.LinkDao.Update(l.ID,
		"cached_size_images = 0",
		"cached_size_scripts = 0",
		"cached_size_stylesheets = 0",
		"cached_size_total = size",
	)
}

func (p *SizePostprocessor) OnLinkLink(db *database.Database, l *database.CrawlLinkLink) error {
	return nil
}

func (p *SizePostprocessor) OnLinkImage(db *database.Database, l *database.CrawlLinkImage) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "images")
}

func (p *SizePostprocessor) OnLinkScript(db *database.Database, l *database.CrawlLinkScript) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "scripts")
}

func (p *SizePostprocessor) OnLinkStylesheet(db *database.Database, l *database.CrawlLinkStylesheet) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "stylesheets")
}

func (p *SizePostprocessor) handleChild(db *database.Database, fromID, toID int, name string) error {
	toLink := &database.CrawlLink{ID: toID}
	err := db.ByID(toLink)
	if err != nil {
		return errors.Wrap(err, "size postprocessor")
	}

	err = db.LinkDao.Update(fromID,
		fmt.Sprintf("cached_size_%s = cached_size_%s + %v", name, name, toLink.Size),
		fmt.Sprintf("cached_size_total = cached_size_total + %v", toLink.Size),
	)
	if err != nil {
		return errors.Wrap(err, "size postprocessor")
	}

	return nil
}

func (p *SizePostprocessor) Flush(db *database.Database) error {
	return nil
}
