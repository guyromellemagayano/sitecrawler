package common

import (
	"fmt"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

type OccurencesPostprocessor struct {
}

func (p *OccurencesPostprocessor) OnLink(db *database.Database, l *database.CrawlLink) error {
	return nil
}

func (p *OccurencesPostprocessor) OnLinkLink(db *database.Database, l *database.CrawlLinkLink) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "link")
}

func (p *OccurencesPostprocessor) OnLinkImage(db *database.Database, l *database.CrawlLinkImage) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "image")
}

func (p *OccurencesPostprocessor) OnLinkScript(db *database.Database, l *database.CrawlLinkScript) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "script")
}

func (p *OccurencesPostprocessor) OnLinkStylesheet(db *database.Database, l *database.CrawlLinkStylesheet) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "stylesheet")
}

func (p *OccurencesPostprocessor) handleChild(db *database.Database, fromID, toID int, name string) error {
	err := db.LinkDao.Update(toID,
		fmt.Sprintf("cached_%s_occurences = COALESCE(cached_%s_occurences, 0) + 1", name, name),
	)
	if err != nil {
		return err
	}

	return nil
}
