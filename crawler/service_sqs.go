package main

import (
	"log"
	"time"

	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/service/sqs"
)

var (
	VisibilityTimeout int64 = 60
	WaitTimeSeconds   int64 = 5
	PingInterval            = 10 * time.Second
)

type SQSService struct {
	Sqs *sqs.SQS
	url *string
}

func NewSQSService(Sqs *sqs.SQS, queue string) (*SQSService, error) {
	result, err := Sqs.GetQueueUrl(&sqs.GetQueueUrlInput{
		QueueName: &queue,
	})
	if err != nil {
		if awsErr, ok := err.(awserr.Error); ok {
			if awsErr.Code() == "AWS.SimpleQueueService.NonExistentQueue" {
				_, err := Sqs.CreateQueue(&sqs.CreateQueueInput{
					QueueName: &queue,
				})
				if err != nil {
					return nil, err
				}
				result, err = Sqs.GetQueueUrl(&sqs.GetQueueUrlInput{
					QueueName: &queue,
				})
				if err != nil {
					return nil, err
				}
			} else {
				return nil, err
			}
		} else {
			return nil, err
		}
	}

	return &SQSService{
		Sqs: Sqs,
		url: result.QueueUrl,
	}, nil
}

func (s *SQSService) Read() (*SQSMessage, error) {
	for {
		response, err := s.Sqs.ReceiveMessage(&sqs.ReceiveMessageInput{
			QueueUrl:          s.url,
			VisibilityTimeout: &VisibilityTimeout,
			WaitTimeSeconds:   &WaitTimeSeconds,
		})
		if err != nil {
			return nil, err
		}
		if len(response.Messages) != 1 {
			continue
		}

		sqsMsg := &SQSMessage{
			svc:  s,
			msg:  response.Messages[0],
			done: make(chan bool),
		}
		go sqsMsg.startPinger()
		return sqsMsg, nil
	}
}

type SQSMessage struct {
	svc  *SQSService
	msg  *sqs.Message
	done chan bool
}

func (m *SQSMessage) Body() string {
	return *m.msg.Body
}

func (m *SQSMessage) Done() error {
	m.done <- true
	_, err := m.svc.Sqs.DeleteMessage(&sqs.DeleteMessageInput{
		QueueUrl:      m.svc.url,
		ReceiptHandle: m.msg.ReceiptHandle,
	})
	return err
}

func (m *SQSMessage) startPinger() {
	ticker := time.NewTicker(PingInterval)
	defer ticker.Stop()
	for {
		select {
		case <-m.done:
			return
		case <-ticker.C:
			if err := m.ping(); err != nil {
				log.Printf("Sqs ping failed: %v", err)
			}
		}
	}
}

func (m *SQSMessage) ping() error {
	_, err := m.svc.Sqs.ChangeMessageVisibility(&sqs.ChangeMessageVisibilityInput{
		QueueUrl:          m.svc.url,
		ReceiptHandle:     m.msg.ReceiptHandle,
		VisibilityTimeout: &VisibilityTimeout,
	})
	return err
}
