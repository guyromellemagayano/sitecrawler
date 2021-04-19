package common

import (
	"fmt"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type RelCountsPostprocessor struct {
}

func (p *RelCountsPostprocessor) OnLink(db *database.Database, l *database.CrawlLink) error {
	if l.Type != TYPE_PAGE {
		return nil
	}
	return db.LinkDao.Update(l.ID,
		"cached_num_links = 0",
		"cached_num_images = 0",
		"cached_num_scripts = 0",
		"cached_num_stylesheets = 0",
		"cached_num_ok_links = 0",
		"cached_num_ok_images = 0",
		"cached_num_ok_scripts = 0",
		"cached_num_ok_stylesheets = 0",
		"cached_num_non_ok_links = 0",
		"cached_num_non_ok_images = 0",
		"cached_num_non_ok_scripts = 0",
		"cached_num_non_ok_stylesheets = 0",
	)
}

func (p *RelCountsPostprocessor) OnLinkLink(db *database.Database, l *database.CrawlLinkLink) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "link")
}

func (p *RelCountsPostprocessor) OnLinkImage(db *database.Database, l *database.CrawlLinkImage) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "image")
}

func (p *RelCountsPostprocessor) OnLinkScript(db *database.Database, l *database.CrawlLinkScript) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "script")
}

func (p *RelCountsPostprocessor) OnLinkStylesheet(db *database.Database, l *database.CrawlLinkStylesheet) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "stylesheet")
}

func (p *RelCountsPostprocessor) handleChild(db *database.Database, fromID, toID int, name string) error {
	status := "ok"

	toLink := &database.CrawlLink{ID: toID}
	err := db.ByID(toLink)
	if err != nil {
		return errors.Wrap(err, "rel counts postprocessor")
	}
	if toLink.Status != STATUS_OK {
		status = "non_ok"
	}

	err = db.LinkDao.Update(fromID,
		fmt.Sprintf("cached_num_%ss = cached_num_%ss + 1", name, name),
		fmt.Sprintf("cached_num_%s_%ss = cached_num_%s_%ss + 1", status, name, status, name),
	)
	if err != nil {
		return errors.Wrap(err, "rel counts postprocessor")
	}

	return nil
}

func (p *RelCountsPostprocessor) Flush(db *database.Database) error {
	return nil
}
