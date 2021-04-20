package common

import (
	"fmt"
	"sync"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type relCountsData struct {
	Links            int
	Images           int
	Scripts          int
	Stylesheets      int
	OkLinks          int
	OkImages         int
	OkScripts        int
	OkStylesheets    int
	NonOkLinks       int
	NonOkImages      int
	NonOkScripts     int
	NonOkStylesheets int
}

type RelCountsPostprocessor struct {
	mtx         sync.Mutex
	cache       map[int]relCountsData
	statusCache map[int]int
}

func (p *RelCountsPostprocessor) OnLink(db *database.Database, l *database.CrawlLink) error {
	p.mtx.Lock()
	defer p.mtx.Unlock()

	if p.statusCache == nil {
		p.statusCache = make(map[int]int)
	}
	p.statusCache[l.ID] = l.Status

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
	p.mtx.Lock()
	defer p.mtx.Unlock()

	status, err := p.getStatus(db, toID)
	if err != nil {
		return err
	}

	if p.cache == nil {
		p.cache = make(map[int]relCountsData)
	}
	v := p.cache[fromID]
	switch name {
	case "link":
		v.Links += 1
		if status == STATUS_OK {
			v.OkLinks += 1
		} else {
			v.NonOkLinks += 1
		}
	case "image":
		v.Images += 1
		if status == STATUS_OK {
			v.OkImages += 1
		} else {
			v.NonOkImages += 1
		}
	case "script":
		v.Scripts += 1
		if status == STATUS_OK {
			v.OkScripts += 1
		} else {
			v.NonOkScripts += 1
		}
	case "stylesheet":
		v.Stylesheets += 1
		if status == STATUS_OK {
			v.OkStylesheets += 1
		} else {
			v.NonOkStylesheets += 1
		}
	default:
		return errors.Errorf("Invalid occurence name: %v", name)
	}
	p.cache[fromID] = v

	return nil
}

func (p *RelCountsPostprocessor) getStatus(db *database.Database, id int) (int, error) {
	if p.statusCache == nil {
		p.statusCache = make(map[int]int)
	}

	if status, ok := p.statusCache[id]; ok {
		return status, nil
	}

	link := &database.CrawlLink{ID: id}
	err := db.ByID(link)
	if err != nil {
		return -1, errors.Wrap(err, "rel counts postprocessor")
	}

	p.statusCache[id] = link.Status

	return link.Status, nil
}

func (p *RelCountsPostprocessor) Flush(db *database.Database) error {
	p.mtx.Lock()
	defer p.mtx.Unlock()

	for id, data := range p.cache {
		statements := []string{}
		if data.Links > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_links = cached_num_links + %v", data.Links))
		}
		if data.Images > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_images = cached_num_images + %v", data.Images))
		}
		if data.Scripts > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_scripts = cached_num_scripts + %v", data.Scripts))
		}
		if data.Stylesheets > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_stylesheets = cached_num_stylesheets + %v", data.Stylesheets))
		}
		if data.OkLinks > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_ok_links = cached_num_ok_links + %v", data.OkLinks))
		}
		if data.OkImages > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_ok_images = cached_num_ok_images + %v", data.OkImages))
		}
		if data.OkScripts > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_ok_scripts = cached_num_ok_scripts + %v", data.OkScripts))
		}
		if data.OkStylesheets > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_ok_stylesheets = cached_num_ok_stylesheets + %v", data.OkStylesheets))
		}
		if data.NonOkLinks > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_non_ok_links = cached_num_non_ok_links + %v", data.NonOkLinks))
		}
		if data.NonOkImages > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_non_ok_images = cached_num_non_ok_images + %v", data.NonOkImages))
		}
		if data.NonOkScripts > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_non_ok_scripts = cached_num_non_ok_scripts + %v", data.NonOkScripts))
		}
		if data.NonOkStylesheets > 0 {
			statements = append(statements, fmt.Sprintf("cached_num_non_ok_stylesheets = cached_num_non_ok_stylesheets + %v", data.NonOkStylesheets))
		}
		if len(statements) > 0 {
			err := db.LinkDao.Update(id, statements...)
			if err != nil {
				return errors.Wrap(err, "rel counts postprocessor")
			}
		}
	}

	// clear cache
	p.cache = make(map[int]relCountsData)

	return nil
}
