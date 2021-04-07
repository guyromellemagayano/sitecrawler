package main

type QueueCache interface {
	Len() int
	Exists(string) bool
	Front() *QueueEntry
	DeleteFront()
	Add(*QueueEntry)
	AddRelation(string)
}
