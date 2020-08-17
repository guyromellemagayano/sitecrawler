package common

import (
	"github.com/go-pg/pg"
	"go.uber.org/zap"
)

type DbLogger struct {
	Log *zap.SugaredLogger
}

func (d DbLogger) BeforeQuery(q *pg.QueryEvent) {}

func (d DbLogger) AfterQuery(q *pg.QueryEvent) {
	d.Log.Info(q.FormattedQuery())
}
