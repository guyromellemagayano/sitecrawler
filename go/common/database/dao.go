package database

type GenericDao struct {
	model interface{}
	db    DB
}

func (d GenericDao) Update(id int, fields ...string) error {
	if len(fields) == 0 {
		return nil
	}
	q := d.db.Model(d.model).Where("id = ?", id)

	for _, f := range fields {
		q.Set(f)
	}

	_, err := q.Update()
	return err
}

func (d GenericDao) Exists(id int) (bool, error) {
	exists, err := d.db.Model(&CrawlScan{}).Where("id = ?", id).Exists()
	if err != nil {
		return false, err
	}
	return exists, nil
}
