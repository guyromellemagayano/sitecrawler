package main

import "github.com/Epic-Design-Labs/web-crawl-app/go/common/database"

type PostprocessService struct {
	Postprocessors []Postprocessor
}

type Postprocessor interface {
	OnLink(db *database.Database, l *database.CrawlLink) error
	OnLinkLink(db *database.Database, l *database.CrawlLinkLink) error
	OnLinkImage(db *database.Database, l *database.CrawlLinkImage) error
	OnLinkScript(db *database.Database, l *database.CrawlLinkScript) error
	OnLinkStylesheet(db *database.Database, l *database.CrawlLinkStylesheet) error
}

func (p *PostprocessService) OnLink(db *database.Database, l *database.CrawlLink) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLink(db, l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessService) OnLinkLink(db *database.Database, l *database.CrawlLinkLink) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkLink(db, l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessService) OnLinkImage(db *database.Database, l *database.CrawlLinkImage) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkImage(db, l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessService) OnLinkScript(db *database.Database, l *database.CrawlLinkScript) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkScript(db, l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessService) OnLinkStylesheet(db *database.Database, l *database.CrawlLinkStylesheet) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkStylesheet(db, l); err != nil {
			return err
		}
	}
	return nil
}
