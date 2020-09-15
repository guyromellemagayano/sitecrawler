package main

import (
	"net/url"
	"testing"
)

func TestNormalizeURLWithoutBase(t *testing.T) {
	sut := &scanner{}
	testCases := []struct {
		Input    string
		Expected string
	}{
		{"https://something.com/a/b/c", "https://something.com/a/b/c"},
		{"https://something.com/a/b/c#a1", "https://something.com/a/b/c"},
		{"https://something.com/a/b/c?action=add&b=c", "https://something.com/a/b/c"},
		{"https://something.com/a/b/c?action=add&b=c#a2", "https://something.com/a/b/c"},
	}

	for _, tc := range testCases {
		t.Run(tc.Input, func(t *testing.T) {
			result, err := sut.normalizeURL(nil, tc.Input)
			if err != nil {
				t.Fatal(err)
			}
			if result.String() != tc.Expected {
				t.Errorf("normalizeURL(%v) = %v, want %v", tc.Input, result, tc.Expected)
			}
		})
	}
}

func TestNormalizeURLWithBase(t *testing.T) {
	sut := &scanner{}
	testCases := []struct {
		Input    string
		Expected string
	}{
		{"/a/b/c", "https://something.com/a/b/c"},
		{"/a/b/c#a1", "https://something.com/a/b/c"},
		{"/a/b/c?action=add&b=c", "https://something.com/a/b/c"},
		{"/a/b/c?action=add&b=c#a2", "https://something.com/a/b/c"},
		{"c", "https://something.com/a/c"},
		{"http://other.com/d/d", "http://other.com/d/d"},
	}

	url, err := url.Parse("https://something.com/a/")
	if err != nil {
		t.Fatal(err)
	}

	for _, tc := range testCases {
		t.Run(tc.Input, func(t *testing.T) {
			result, err := sut.normalizeURL(url, tc.Input)
			if err != nil {
				t.Fatal(err)
			}
			if result.String() != tc.Expected {
				t.Errorf("normalizeURL(%v) = %v, want %v", tc.Input, result, tc.Expected)
			}
		})
	}
}
