package common

import (
	"strings"
	"testing"

	"github.com/PuerkitoBio/goquery"
)

const (
	pageWithoutMeta = `
<html>
	<head>
	</head>
	<body>
	</body>
</html>`
	pageWithWrongID = `
<html>
	<head>
		<meta name="epic-crawl-id" content="wrong">
	</head>
	<body>
	</body>
</html>`
	pageWithCorrectID = `
<html>
	<head>
		<meta name="epic-crawl-id" content="correct">
	</head>
	<body>
	</body>
</html>`
	pageWithMultipleIDs = `
<html>
	<head>
		<meta name="epic-crawl-id" content="first">
		<meta name="epic-crawl-id" content="correct">
		<meta name="epic-crawl-id" content="third">
	</head>
	<body>
	</body>
</html>`
)

func TestWithoutMeta(t *testing.T) {
	service := &VerifyService{}
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(pageWithoutMeta))
	if err != nil {
		t.Fatal(err)
	}

	err = service.Verify(doc, "correct")
	if err == nil || err.Error() != "meta tag does not exist" {
		t.Errorf("Verify() = %v, want \"meta tag does not exist\"", err)
	}
}

func TestWithWrongID(t *testing.T) {
	service := &VerifyService{}
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(pageWithWrongID))
	if err != nil {
		t.Fatal(err)
	}

	err = service.Verify(doc, "correct")
	if err == nil || err.Error() != "meta tag not correct \"wrong\" != \"correct\"" {
		t.Errorf("Verify() = %v, want \"meta tag does not exist\"", err)
	}
}

func TestWithCorrectID(t *testing.T) {
	service := &VerifyService{}
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(pageWithCorrectID))
	if err != nil {
		t.Fatal(err)
	}

	err = service.Verify(doc, "correct")
	if err != nil {
		t.Errorf("Verify() = %v, want nil", err)
	}
}

func TestWithMultipleIDs(t *testing.T) {
	service := &VerifyService{}
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(pageWithMultipleIDs))
	if err != nil {
		t.Fatal(err)
	}

	err = service.Verify(doc, "correct")
	if err != nil {
		t.Errorf("Verify() = %v, want nil", err)
	}
}
