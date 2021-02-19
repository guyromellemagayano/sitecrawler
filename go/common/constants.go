package common

const (
	TYPE_PAGE     = 1
	TYPE_EXTERNAL = 2
	TYPE_OTHER    = 3
	TYPE_NON_WEB  = 4

	STATUS_OK                 = 1
	STATUS_TIMEOUT            = 2
	STATUS_HTTP_ERROR         = 3
	STATUS_OTHER_ERROR        = 4
	STATUS_TOO_MANY_REDIRECTS = 5
	STATUS_TLS_ERROR          = 6 // This is only used by uptimer, not by crawler

	TLS_NONE  = 1
	TLS_OK    = 2
	TLS_ERROR = 3
)
