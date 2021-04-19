package common

import (
	"fmt"
	"sync"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type occurenceData struct {
	LinkOccurences       int
	ImageOccurences      int
	ScriptOccurences     int
	StylesheetOccurences int
}

type OccurencesPostprocessor struct {
	mtx   sync.Mutex
	cache map[int]occurenceData
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
	p.mtx.Lock()
	defer p.mtx.Unlock()

	if p.cache == nil {
		p.cache = make(map[int]occurenceData)
	}
	v := p.cache[toID]
	switch name {
	case "link":
		v.LinkOccurences += 1
	case "image":
		v.ImageOccurences += 1
	case "script":
		v.ScriptOccurences += 1
	case "stylesheet":
		v.StylesheetOccurences += 1
	default:
		return errors.Errorf("Invalid occurence name: %v", name)
	}
	p.cache[toID] = v

	return nil
}

func (p *OccurencesPostprocessor) Flush(db *database.Database) error {
	p.mtx.Lock()
	defer p.mtx.Unlock()

	for id, data := range p.cache {
		statements := []string{}
		if data.LinkOccurences > 0 {
			statements = append(statements, fmt.Sprintf("cached_link_occurences = COALESCE(cached_link_occurences, 0) + %v", data.LinkOccurences))
		}
		if data.ImageOccurences > 0 {
			statements = append(statements, fmt.Sprintf("cached_image_occurences = COALESCE(cached_image_occurences, 0) + %v", data.ImageOccurences))
		}
		if data.ScriptOccurences > 0 {
			statements = append(statements, fmt.Sprintf("cached_script_occurences = COALESCE(cached_script_occurences, 0) + %v", data.ScriptOccurences))
		}
		if data.StylesheetOccurences > 0 {
			statements = append(statements, fmt.Sprintf("cached_stylesheet_occurences = COALESCE(cached_stylesheet_occurences, 0) + %v", data.StylesheetOccurences))
		}
		if len(statements) > 0 {
			err := db.LinkDao.Update(id, statements...)
			if err != nil {
				return errors.Wrap(err, "occurences postprocessor")
			}
		}
	}

	// clear cache
	p.cache = make(map[int]occurenceData)

	return nil
}
