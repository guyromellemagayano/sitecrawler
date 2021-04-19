package common

import (
	"fmt"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type TlsPostprocessor struct {
}

func (p *TlsPostprocessor) OnLink(db *database.Database, l *database.CrawlLink) error {
	if l.Type != TYPE_PAGE {
		return nil
	}
	tlsTotal := "cached_tls_total = true"
	if l.TlsStatus != TLS_OK {
		tlsTotal = "cached_tls_total = false"
	}
	return db.LinkDao.Update(l.ID,
		"cached_num_non_tls_images = 0",
		"cached_num_non_tls_scripts = 0",
		"cached_num_non_tls_stylesheets = 0",
		"cached_num_tls_images = 0",
		"cached_num_tls_scripts = 0",
		"cached_num_tls_stylesheets = 0",
		"cached_tls_images = true",
		"cached_tls_scripts = true",
		"cached_tls_stylesheets = true",
		tlsTotal,
	)
}

func (p *TlsPostprocessor) OnLinkLink(db *database.Database, l *database.CrawlLinkLink) error {
	return nil
}

func (p *TlsPostprocessor) OnLinkImage(db *database.Database, l *database.CrawlLinkImage) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "images")
}

func (p *TlsPostprocessor) OnLinkScript(db *database.Database, l *database.CrawlLinkScript) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "scripts")
}

func (p *TlsPostprocessor) OnLinkStylesheet(db *database.Database, l *database.CrawlLinkStylesheet) error {
	return p.handleChild(db, l.FromLinkID, l.ToLinkID, "stylesheets")
}

func (p *TlsPostprocessor) handleChild(db *database.Database, fromID, toID int, name string) error {
	toLink := &database.CrawlLink{ID: toID}
	err := db.ByID(toLink)
	if err != nil {
		return errors.Wrap(err, "tls postprocessor")
	}

	if toLink.TlsStatus == TLS_OK {
		if err := db.LinkDao.Update(fromID, fmt.Sprintf("cached_num_tls_%s = cached_num_tls_%s + 1", name, name)); err != nil {
			return errors.Wrap(err, "tls postprocessor")
		}
	} else {
		err := db.LinkDao.Update(fromID,
			fmt.Sprintf("cached_num_non_tls_%s = cached_num_non_tls_%s + 1", name, name),
			fmt.Sprintf("cached_tls_%s = false", name),
			"cached_tls_total = false",
		)
		if err != nil {
			return errors.Wrap(err, "tls postprocessor")
		}
	}

	return nil
}

func (p *TlsPostprocessor) Flush(db *database.Database) error {
	return nil
}
