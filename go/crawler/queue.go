package main

import "github.com/Epic-Design-Labs/web-crawl-app/go/common/database"

type QueueEntry struct {
	Url   string
	Depth uint
}

type QueueRelation struct {
	ParentId  int
	ChildType uint8
	Data      map[string]interface{}
}

func (r *QueueRelation) SetData(k string, v interface{}) {
	if r.Data == nil {
		r.Data = make(map[string]interface{})
	}
	r.Data[k] = v
}

type Queue interface {
	Len(*database.Database) (int, error)
	Exists(*database.Database, string) (bool, error)
	Front(*database.Database) (*QueueEntry, error)
	DeleteFront(*database.Database) error
	GetRelations(*database.Database, string) ([]QueueRelation, error)
	Add(*database.Database, *QueueEntry) error
	AddRelation(*database.Database, string, QueueRelation) error
}
