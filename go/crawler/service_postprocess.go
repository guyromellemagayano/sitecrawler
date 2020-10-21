package main

import "github.com/Epic-Design-Labs/web-crawl-app/go/common/database"

type PostprocessService struct {
	Postprocessors []Postprocessor
}

type Postprocessor interface {
	OnLink(l *database.CrawlLink) error
	OnLinkLink(l *database.CrawlLinkLink) error
	OnLinkImage(l *database.CrawlLinkImage) error
	OnLinkScript(l *database.CrawlLinkScript) error
	OnLinkStylesheet(l *database.CrawlLinkStylesheet) error
}

func (p *PostprocessService) OnLink(l *database.CrawlLink) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLink(l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessService) OnLinkLink(l *database.CrawlLinkLink) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkLink(l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessService) OnLinkImage(l *database.CrawlLinkImage) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkImage(l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessService) OnLinkScript(l *database.CrawlLinkScript) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkScript(l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessService) OnLinkStylesheet(l *database.CrawlLinkStylesheet) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkStylesheet(l); err != nil {
			return err
		}
	}
	return nil
}
