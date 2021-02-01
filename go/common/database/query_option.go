package database

import "github.com/go-pg/pg/v9/orm"

type QueryOption func(q *orm.Query) *orm.Query

func WithRelation(r string) QueryOption {
	return func(q *orm.Query) *orm.Query {
		return q.Relation(r)
	}
}

func Where(cond string, args ...interface{}) QueryOption {
	return func(q *orm.Query) *orm.Query {
		return q.Where(cond, args...)
	}
}

func WhereIn(cond string, slice interface{}) QueryOption {
	return func(q *orm.Query) *orm.Query {
		return q.WhereIn(cond, slice)
	}
}

func Join(join string, args ...interface{}) QueryOption {
	return func(q *orm.Query) *orm.Query {
		return q.Join(join, args...)
	}
}

func Limit(n int) QueryOption {
	return func(q *orm.Query) *orm.Query {
		return q.Limit(n)
	}
}

func Order(o string) QueryOption {
	return func(q *orm.Query) *orm.Query {
		return q.Order(o)
	}
}

func DistinctOn(distinct string, args ...interface{}) QueryOption {
	return func(q *orm.Query) *orm.Query {
		return q.DistinctOn(distinct, args...)
	}
}

func IgnoreDuplicates(q *orm.Query) *orm.Query {
	return q.OnConflict("DO NOTHING")
}
