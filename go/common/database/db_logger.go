package database

import (
	"context"

	"github.com/go-pg/pg/v9"
	"go.uber.org/zap"
)

type DbLogger struct {
	Log *zap.SugaredLogger
}

func (d DbLogger) BeforeQuery(ctx context.Context, q *pg.QueryEvent) (context.Context, error) {
	return ctx, nil
}

func (d DbLogger) AfterQuery(ctx context.Context, q *pg.QueryEvent) error {
	d.Log.Info(q.FormattedQuery())
	return nil
}
