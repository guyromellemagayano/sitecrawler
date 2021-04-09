package main

import (
	"container/list"
)

type QueueCacheFifo struct {
	fifo   *list.List
	inFifo map[string]*QueueEntry
}

func NewQueueCacheFifo() *QueueCacheFifo {
	return &QueueCacheFifo{
		fifo:   list.New(),
		inFifo: make(map[string]*QueueEntry),
	}
}

func (c *QueueCacheFifo) Exists(url string) bool {
	_, ok := c.inFifo[url]
	return ok
}

func (c *QueueCacheFifo) Add(entry *QueueEntry) {
	c.fifo.PushBack(entry)
	c.inFifo[entry.Url] = entry
}

func (c *QueueCacheFifo) AddRelation(url string) {
}

func (c *QueueCacheFifo) Front() *QueueEntry {
	element := c.fifo.Front()
	entry := element.Value.(*QueueEntry)
	return entry
}

func (c *QueueCacheFifo) DeleteFront() {
	element := c.fifo.Front()
	entry := element.Value.(*QueueEntry)

	c.fifo.Remove(element)
	delete(c.inFifo, entry.Url)
}

func (c QueueCacheFifo) Len() int {
	return c.fifo.Len()
}
