package common

import (
	"log"

	"github.com/go-pg/pg"
)

type DbLogger struct{}

func (d DbLogger) BeforeQuery(q *pg.QueryEvent) {}

func (d DbLogger) AfterQuery(q *pg.QueryEvent) {
	log.Println(q.FormattedQuery())
}
