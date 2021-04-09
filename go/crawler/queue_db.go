package main

import (
	"log"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type QueueDb struct {
	scanID int
	cache  QueueCache

	dbIdByUrl map[string]int
}

func NewQueueDb(db *database.Database, scanID int, cache QueueCache) (*QueueDb, error) {
	q := &QueueDb{
		scanID:    scanID,
		cache:     cache,
		dbIdByUrl: make(map[string]int),
	}

	err := db.FifoEntryDao.ForEach(func(l *database.CrawlFifoentry) error {
		q.addSaved(l)
		return nil
	}, database.Where("scan_id = ?", scanID))
	if err != nil {
		return nil, err
	}

	return q, nil
}

func (q *QueueDb) Len(db *database.Database) (int, error) {
	return q.cache.Len(), nil
}

func (q *QueueDb) Exists(db *database.Database, url string) (bool, error) {
	return q.cache.Exists(url), nil
}

func (q *QueueDb) Front(db *database.Database) (*QueueEntry, error) {
	return q.cache.Front(), nil
}

func (q *QueueDb) DeleteFront(db *database.Database) error {
	entry := q.cache.Front()
	entryId := q.dbIdByUrl[entry.Url]

	if err := db.FifoRelationDao.DeleteAll(database.Where("entry_id = ?", entryId)); err != nil {
		return errors.Wrapf(err, "could not delete fifo relations for entry_id=%v", entryId)
	}
	if err := db.FifoEntryDao.DeleteAll(database.Where("id = ?", entryId)); err != nil {
		return errors.Wrapf(err, "could not delete fifo entry_id=%v", entryId)
	}

	q.cache.DeleteFront()

	return nil
}

func (q *QueueDb) GetRelations(db *database.Database, url string) ([]QueueRelation, error) {
	entryId := q.dbIdByUrl[url]

	var dbRelations []*database.CrawlFiforelation
	err := db.All(&dbRelations,
		database.Where("entry_id = ?", entryId),
	)
	if err != nil {
		return nil, errors.Wrapf(err, "could not get relations for fifo entry %v", url)
	}

	queueRelations := make([]QueueRelation, len(dbRelations))
	for i, dbRel := range dbRelations {
		queueRelations[i] = QueueRelation{
			ParentId:  dbRel.ParentID,
			ChildType: uint8(dbRel.ChildType),
			Data:      dbRel.Data,
		}
	}

	return queueRelations, nil
}

func (q *QueueDb) Add(db *database.Database, entry *QueueEntry) error {
	log.Printf("Add: %v", entry.Url)
	cfe := &database.CrawlFifoentry{
		ScanID: q.scanID,
		Url:    entry.Url,
		Depth:  int(entry.Depth),
	}
	err := db.Insert(cfe)
	if err != nil {
		return errors.Wrap(err, "could not insert fifo")
	}

	q.addSaved(cfe)

	return nil
}

func (q *QueueDb) addSaved(l *database.CrawlFifoentry) {
	q.cache.Add(&QueueEntry{
		Url:   l.Url,
		Depth: uint(l.Depth),
	})
	q.dbIdByUrl[l.Url] = l.ID
}

func (q *QueueDb) AddRelation(db *database.Database, url string, relation QueueRelation) error {
	entryId := q.dbIdByUrl[url]

	cfr := &database.CrawlFiforelation{
		EntryID:   entryId,
		ParentID:  relation.ParentId,
		ChildType: int(relation.ChildType),
		Data:      relation.Data,
	}
	err := db.Insert(cfr)
	if err != nil {
		return errors.Wrapf(err, "could not insert fifo relation for entry_id=%v", entryId)
	}

	q.cache.AddRelation(url)

	return nil
}
