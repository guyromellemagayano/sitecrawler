package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"go.uber.org/zap"

	"github.com/pkg/errors"
	"github.com/robfig/cron/v3"
)

type ScheduleService struct {
	Database *database.Database
	Logger   *zap.SugaredLogger

	cron   *cron.Cron
	groups map[int]*group
}

func NewScheduleService(log *zap.SugaredLogger, db *database.Database) *ScheduleService {
	s := &ScheduleService{
		Database: db,
		Logger:   log,

		cron:   cron.New(),
		groups: make(map[int]*group),
	}
	s.cron.Start()
	return s
}

type group struct {
	ID       int
	GroupID  int
	Schedule string
	EntryID  cron.EntryID
}

func (s *ScheduleService) Reload() error {
	var groupSettings []database.CrawlGroupsetting
	err := s.Database.All(&groupSettings)
	if err != nil {
		return errors.Wrap(err, "could not get all group settings")
	}

	for _, gs := range groupSettings {
		g, ok := s.groups[gs.ID]
		if !ok {
			if err := s.add(gs); err != nil {
				return err
			}
			continue
		}
		if g.Schedule != gs.UptimeSchedule {
			s.remove(g)
			if err := s.add(gs); err != nil {
				return err
			}
		}
	}
	return nil
}

func (s *ScheduleService) add(gs database.CrawlGroupsetting) error {
	s.Logger.Infof("Adding %v at %v", gs.GroupID, gs.UptimeSchedule)

	g := &group{
		ID:       gs.ID,
		GroupID:  gs.GroupID,
		Schedule: gs.UptimeSchedule,
	}
	entryID, err := s.cron.AddJob(gs.UptimeSchedule, &UptimeJob{
		Database: s.Database,
		Logger:   s.Logger,
		Group:    g,
	})
	if err != nil {
		return err
	}
	g.EntryID = entryID
	s.groups[gs.ID] = g
	return nil
}

func (s *ScheduleService) remove(g *group) {
	delete(s.groups, g.ID)
	s.cron.Remove(g.EntryID)
}
