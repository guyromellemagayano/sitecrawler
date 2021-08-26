package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"go.uber.org/zap"

	"github.com/pkg/errors"
	"github.com/robfig/cron/v3"
)

type ScheduleService struct {
	Database       *database.Database
	Logger         *zap.SugaredLogger
	BackendService *common.BackendService

	cron  *cron.Cron
	plans map[int]*planEntry
}

func NewScheduleService(log *zap.SugaredLogger, db *database.Database, backendService *common.BackendService) *ScheduleService {
	s := &ScheduleService{
		Database:       db,
		Logger:         log,
		BackendService: backendService,

		cron:  cron.New(),
		plans: make(map[int]*planEntry),
	}
	s.cron.Start()
	return s
}

type planEntry struct {
	ID       int
	Schedule string
	EntryID  cron.EntryID
}

func (s *ScheduleService) Reload() error {
	var plans []database.TeamPlan
	err := s.Database.All(&plans)
	if err != nil {
		return errors.Wrap(err, "could not get all plans")
	}

	for _, plan := range plans {
		existing, ok := s.plans[plan.ID]
		if !ok {
			if err := s.add(plan); err != nil {
				return err
			}
			continue
		}
		if existing.Schedule != plan.UptimeSchedule {
			s.remove(existing)
			if err := s.add(plan); err != nil {
				return err
			}
		}
	}
	return nil
}

func (s *ScheduleService) add(plan database.TeamPlan) error {
	s.Logger.Infof("Adding %v at %v", plan.ID, plan.UptimeSchedule)

	pe := &planEntry{
		ID:       plan.ID,
		Schedule: plan.UptimeSchedule,
	}
	entryID, err := s.cron.AddJob(plan.UptimeSchedule, &UptimeJob{
		Database:       s.Database,
		Logger:         s.Logger,
		BackendService: s.BackendService,
		Plan:           pe,
	})
	if err != nil {
		return err
	}
	pe.EntryID = entryID
	s.plans[plan.ID] = pe
	return nil
}

func (s *ScheduleService) remove(p *planEntry) {
	delete(s.plans, p.ID)
	s.cron.Remove(p.EntryID)
}
