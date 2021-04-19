package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

type Postprocessor interface {
	OnLink(db *database.Database, l *database.CrawlLink) error
	OnLinkLink(db *database.Database, l *database.CrawlLinkLink) error
	OnLinkImage(db *database.Database, l *database.CrawlLinkImage) error
	OnLinkScript(db *database.Database, l *database.CrawlLinkScript) error
	OnLinkStylesheet(db *database.Database, l *database.CrawlLinkStylesheet) error
	Flush(db *database.Database) error
}

type PostprocessorStack struct {
	Postprocessors []Postprocessor
}

func NewPostprocessorStack() *PostprocessorStack {
	return &PostprocessorStack{
		Postprocessors: []Postprocessor{
			&common.TlsPostprocessor{},
			&common.SizePostprocessor{},
			&common.OccurencesPostprocessor{},
			&AltPostprocessor{},
			&common.RelCountsPostprocessor{},
		},
	}
}

func (p *PostprocessorStack) OnLink(db *database.Database, l *database.CrawlLink) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLink(db, l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessorStack) OnLinkLink(db *database.Database, l *database.CrawlLinkLink) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkLink(db, l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessorStack) OnLinkImage(db *database.Database, l *database.CrawlLinkImage) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkImage(db, l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessorStack) OnLinkScript(db *database.Database, l *database.CrawlLinkScript) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkScript(db, l); err != nil {
			return err
		}
	}
	return nil
}
func (p *PostprocessorStack) OnLinkStylesheet(db *database.Database, l *database.CrawlLinkStylesheet) error {
	for _, p := range p.Postprocessors {
		if err := p.OnLinkStylesheet(db, l); err != nil {
			return err
		}
	}
	return nil
}

func (p *PostprocessorStack) Flush(db *database.Database) error {
	for _, p := range p.Postprocessors {
		if err := p.Flush(db); err != nil {
			return err
		}
	}
	return nil
}
