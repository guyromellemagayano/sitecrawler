package common

import (
	"fmt"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

type TlsPostprocessor struct {
	Database *database.Database
}

func (p *TlsPostprocessor) OnLink(l *database.CrawlLink) error {
	if l.Type != TYPE_PAGE {
		return nil
	}
	tlsTotal := "cached_tls_total = true"
	if l.TlsStatus != TLS_OK {
		tlsTotal = "cached_tls_total = false"
	}
	return p.Database.LinkDao.Update(l.ID,
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

func (p *TlsPostprocessor) OnLinkLink(l *database.CrawlLinkLink) error {
	return nil
}

func (p *TlsPostprocessor) OnLinkImage(l *database.CrawlLinkImage) error {
	return p.handleChild(l.FromLinkID, l.ToLinkID, "images")
}

func (p *TlsPostprocessor) OnLinkScript(l *database.CrawlLinkScript) error {
	return p.handleChild(l.FromLinkID, l.ToLinkID, "scripts")
}

func (p *TlsPostprocessor) OnLinkStylesheet(l *database.CrawlLinkStylesheet) error {
	return p.handleChild(l.FromLinkID, l.ToLinkID, "stylesheets")
}

func (p *TlsPostprocessor) handleChild(fromID, toID int, name string) error {
	toLink, err := p.Database.LinkDao.ByID(toID)
	if err != nil {
		return err
	}

	if toLink.TlsStatus == TLS_OK {
		if err := p.Database.LinkDao.Update(fromID, fmt.Sprintf("cached_num_tls_%s = cached_num_tls_%s + 1", name, name)); err != nil {
			return err
		}
	} else {
		err := p.Database.LinkDao.Update(fromID,
			fmt.Sprintf("cached_num_non_tls_%s = cached_num_non_tls_%s + 1", name, name),
			fmt.Sprintf("cached_tls_%s = false", name),
			"cached_tls_total = false",
		)
		if err != nil {
			return err
		}
	}

	return nil
}
