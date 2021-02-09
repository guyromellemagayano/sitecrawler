package main

import (
	"container/list"
	"net/url"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type relation struct {
	ParentId  int
	ChildType uint8
	Data      map[string]interface{}
}

func (r *relation) SetData(k string, v interface{}) {
	if r.Data == nil {
		r.Data = make(map[string]interface{})
	}
	r.Data[k] = v
}

type fifoEntry struct {
	Id        int
	Url       *url.URL
	Depth     uint
	Relations []relation
}
type FifoCache struct {
	fifo   *list.List
	inFifo map[string]*fifoEntry
}

func NewFifoCache(db *database.Database, scanID int) (*FifoCache, error) {
	c := &FifoCache{
		fifo:   list.New(),
		inFifo: make(map[string]*fifoEntry),
	}

	relMap := make(map[int][]relation)
	err := db.FifoRelationDao.ForEach(func(l *database.CrawlFiforelation) error {
		relMap[l.EntryID] = append(relMap[l.EntryID], relation{
			ParentId:  l.ParentID,
			ChildType: uint8(l.ChildType),
			Data:      l.Data,
		})
		return nil
	}, database.Where("entry_id IN (SELECT id FROM crawl_fifoentry WHERE scan_id = ?)", scanID))
	if err != nil {
		return nil, err
	}

	err = db.FifoEntryDao.ForEach(func(l *database.CrawlFifoentry) error {
		url, err := url.Parse(l.Url)
		if err != nil {
			return err
		}
		c.add(&fifoEntry{
			Id:        l.ID,
			Url:       url,
			Depth:     uint(l.Depth),
			Relations: relMap[l.ID],
		})
		return nil
	}, database.Where("scan_id = ?", scanID))
	if err != nil {
		return nil, err
	}

	return c, nil
}

func (c *FifoCache) Get(url string) *fifoEntry {
	return c.inFifo[url]
}

func (c *FifoCache) Add(db *database.Database, scanID int, fe *fifoEntry) error {
	c.add(fe)

	cfe := &database.CrawlFifoentry{
		ScanID: scanID,
		Url:    fe.Url.String(),
		Depth:  int(fe.Depth),
	}
	err := db.Insert(cfe)
	if err != nil {
		return err
	}
	fe.Id = cfe.ID

	for _, r := range fe.Relations {
		if err := c.addRelationDb(db, fe, r); err != nil {
			return err
		}
	}

	return nil
}

func (c *FifoCache) add(fe *fifoEntry) {
	c.fifo.PushBack(fe)
	c.inFifo[fe.Url.String()] = fe
}

func (c *FifoCache) AddRelation(db *database.Database, url string, r relation) error {
	fe := c.inFifo[url]
	fe.Relations = append(fe.Relations, r)
	return c.addRelationDb(db, fe, r)
}

func (c *FifoCache) addRelationDb(db *database.Database, fe *fifoEntry, r relation) error {
	cfr := &database.CrawlFiforelation{
		EntryID:   fe.Id,
		ParentID:  r.ParentId,
		ChildType: int(r.ChildType),
		Data:      r.Data,
	}
	err := db.Insert(cfr)
	if err != nil {
		return errors.Wrapf(err, "could not insert relation for entry_id=%v", fe.Id)
	}
	return nil
}

func (c *FifoCache) Front() *fifoEntry {
	element := c.fifo.Front()
	entry := element.Value.(*fifoEntry)
	return entry
}

func (c *FifoCache) DeleteFront(db *database.Database) error {
	element := c.fifo.Front()
	entry := element.Value.(*fifoEntry)

	c.fifo.Remove(element)
	delete(c.inFifo, entry.Url.String())

	if err := db.FifoRelationDao.DeleteAll(database.Where("entry_id = ?", entry.Id)); err != nil {
		return errors.Wrapf(err, "could not delete relations for entry_id=%v", entry.Id)
	}
	if err := db.FifoEntryDao.DeleteAll(database.Where("id = ?", entry.Id)); err != nil {
		return errors.Wrapf(err, "could not delete entry_id=%v", entry.Id)
	}
	return nil
}

func (c FifoCache) Len() int {
	return c.fifo.Len()
}
