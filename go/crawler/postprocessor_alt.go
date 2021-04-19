package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type AltPostprocessor struct {
}

func (p *AltPostprocessor) OnLink(db *database.Database, l *database.CrawlLink) error {
	return nil
}

func (p *AltPostprocessor) OnLinkLink(db *database.Database, l *database.CrawlLinkLink) error {
	return nil
}

func (p *AltPostprocessor) OnLinkImage(db *database.Database, l *database.CrawlLinkImage) error {
	if l.AltText == nil || *l.AltText == "" {
		err := db.LinkDao.Update(l.ToLinkID, "cached_image_missing_alts = COALESCE(cached_image_missing_alts, 0) + 1")
		if err != nil {
			return errors.Wrap(err, "alt postprocessor")
		}
	}
	return nil
}

func (p *AltPostprocessor) OnLinkScript(db *database.Database, l *database.CrawlLinkScript) error {
	return nil
}

func (p *AltPostprocessor) OnLinkStylesheet(db *database.Database, l *database.CrawlLinkStylesheet) error {
	return nil
}

func (p *AltPostprocessor) Flush(db *database.Database) error {
	return nil
}
