//nolint
//lint:file-ignore U1000 ignore unused code, it's generated
package database

import (
	"time"
)

var Columns = struct {
	AccountEmailaddress struct {
		ID, Email, Verified, Primary, UserID string

		User string
	}
	AccountEmailconfirmation struct {
		ID, Created, Sent, Key, EmailAddressID string

		EmailAddress string
	}
	AuthGroup struct {
		ID, Name string
	}
	AuthGroupPermission struct {
		ID, GroupID, PermissionID string

		Permission, Group string
	}
	AuthPermission struct {
		ID, Name, ContentTypeID, Codename string

		ContentType string
	}
	AuthUser struct {
		ID, Password, LastLogin, IsSuperuser, Username, FirstName, LastName, Email, IsStaff, IsActive, DateJoined string
	}
	AuthUserGroup struct {
		ID, UserID, GroupID string

		Group, User string
	}
	AuthUserUserPermission struct {
		ID, UserID, PermissionID string

		Permission, User string
	}
	AuthtokenToken struct {
		ID, Created, UserID string

		User string
	}
	CrawlFifoentry struct {
		ID, Url, Depth, ScanID string

		Scan string
	}
	CrawlFiforelation struct {
		ID, ParentID, ChildType, EntryID, Data string

		Entry string
	}
	CrawlGroupsetting struct {
		ID, MaxSites, GroupID, RecrawlSchedule, UptimeSchedule, RecrawlFrequency string

		Group string
	}
	CrawlLink struct {
		ID, CreatedAt, Type, Url, Status, HttpStatus, ResponseTime, Error, ScanID, Size, TlsStatus, TlsID, CachedNumNonTlsImages, CachedNumNonTlsScripts, CachedNumNonTlsStylesheets, CachedNumTlsImages, CachedNumTlsScripts, CachedNumTlsStylesheets, CachedTlsImages, CachedTlsScripts, CachedTlsStylesheets, CachedTlsTotal, CachedSizeImages, CachedSizeScripts, CachedSizeStylesheets, CachedSizeTotal, CachedImageOccurences, CachedLinkOccurences, CachedScriptOccurences, CachedStylesheetOccurences, CachedImageMissingAlts, CachedNumImages, CachedNumLinks, CachedNumNonOkImages, CachedNumNonOkLinks, CachedNumNonOkScripts, CachedNumNonOkStylesheets, CachedNumOkImages, CachedNumOkLinks, CachedNumOkScripts, CachedNumOkStylesheets, CachedNumScripts, CachedNumStylesheets string

		Scan, Tls string
	}
	CrawlLinkImage struct {
		FromLinkID, ToLinkID, AltText string

		FromLink, ToLink string
	}
	CrawlLinkLink struct {
		FromLinkID, ToLinkID string

		FromLink, ToLink string
	}
	CrawlLinkScript struct {
		FromLinkID, ToLinkID string

		FromLink, ToLink string
	}
	CrawlLinkStylesheet struct {
		FromLinkID, ToLinkID string

		FromLink, ToLink string
	}
	CrawlPagedatum struct {
		ID, Title, Description, H1First, H1Second, H2First, H2Second, LinkID string

		Link string
	}
	CrawlScan struct {
		ID, StartedAt, FinishedAt, SiteID, ForceHttps string

		Site string
	}
	CrawlScanarchive struct {
		ID, StartedAt, FinishedAt, ScanID, Data, SiteID string

		Site string
	}
	CrawlScancache struct {
		ID, CreatedAt, Data string

		Scan string
	}
	CrawlSite struct {
		ID, CreatedAt, UpdatedAt, Url, VerificationID, Verified, UserID, LastVerifyError, Name, LargePageSizeThreshold, DeletedAt string

		User string
	}
	CrawlTl struct {
		ID, NotBefore, NotAfter, CommonName, Organization, DnsNames, IssuerOrganization, IssuerCn, CipherSuite, Version, Errors string
	}
	CrawlUserprofile struct {
		ID, Settings, UserID, LargePageSizeThreshold string

		User string
	}
	DjangoAdminLog struct {
		ID, ActionTime, ObjectID, ObjectRepr, ActionFlag, ChangeMessage, ContentTypeID, UserID string

		ContentType, User string
	}
	DjangoContentType struct {
		ID, AppLabel, Model string
	}
	DjangoMigration struct {
		ID, App, Name, Applied string
	}
	DjangoSession struct {
		ID, SessionData, ExpireDate string
	}
	DjangoSite struct {
		ID, Domain, Name string
	}
	HealthCheckDbTestmodel struct {
		ID, Title string
	}
	PaymentStripecustomer struct {
		ID, CustomerID, UserID string

		User string
	}
	PaymentSubscription struct {
		ID, PriceID, GroupID, Features, Name string

		Group string
	}
	PaymentUsersubscription struct {
		ID, SubscriptionID, UserID, StripeID, Status, CancelAt string

		Subscription, User string
	}
	SignupSignup struct {
		ID, CreatedAt, FirstName, LastName, Username, Email, Url, Token string
	}
	SocialaccountSocialaccount struct {
		ID, Provider, Uid, LastLogin, DateJoined, ExtraData, UserID string

		User string
	}
	SocialaccountSocialapp struct {
		ID, Provider, Name, ClientID, Secret, Key string
	}
	SocialaccountSocialappSite struct {
		ID, SocialappID, SiteID string

		Site, Socialapp string
	}
	SocialaccountSocialtoken struct {
		ID, Token, TokenSecret, ExpiresAt, AccountID, AppID string

		Account, App string
	}
	UptimeUptimestat struct {
		ID, CreatedAt, Status, HttpStatus, ResponseTime, Error, SiteID string

		Site string
	}
}{
	AccountEmailaddress: struct {
		ID, Email, Verified, Primary, UserID string

		User string
	}{
		ID:       "id",
		Email:    "email",
		Verified: "verified",
		Primary:  "primary",
		UserID:   "user_id",

		User: "User",
	},
	AccountEmailconfirmation: struct {
		ID, Created, Sent, Key, EmailAddressID string

		EmailAddress string
	}{
		ID:             "id",
		Created:        "created",
		Sent:           "sent",
		Key:            "key",
		EmailAddressID: "email_address_id",

		EmailAddress: "EmailAddress",
	},
	AuthGroup: struct {
		ID, Name string
	}{
		ID:   "id",
		Name: "name",
	},
	AuthGroupPermission: struct {
		ID, GroupID, PermissionID string

		Permission, Group string
	}{
		ID:           "id",
		GroupID:      "group_id",
		PermissionID: "permission_id",

		Permission: "Permission",
		Group:      "Group",
	},
	AuthPermission: struct {
		ID, Name, ContentTypeID, Codename string

		ContentType string
	}{
		ID:            "id",
		Name:          "name",
		ContentTypeID: "content_type_id",
		Codename:      "codename",

		ContentType: "ContentType",
	},
	AuthUser: struct {
		ID, Password, LastLogin, IsSuperuser, Username, FirstName, LastName, Email, IsStaff, IsActive, DateJoined string
	}{
		ID:          "id",
		Password:    "password",
		LastLogin:   "last_login",
		IsSuperuser: "is_superuser",
		Username:    "username",
		FirstName:   "first_name",
		LastName:    "last_name",
		Email:       "email",
		IsStaff:     "is_staff",
		IsActive:    "is_active",
		DateJoined:  "date_joined",
	},
	AuthUserGroup: struct {
		ID, UserID, GroupID string

		Group, User string
	}{
		ID:      "id",
		UserID:  "user_id",
		GroupID: "group_id",

		Group: "Group",
		User:  "User",
	},
	AuthUserUserPermission: struct {
		ID, UserID, PermissionID string

		Permission, User string
	}{
		ID:           "id",
		UserID:       "user_id",
		PermissionID: "permission_id",

		Permission: "Permission",
		User:       "User",
	},
	AuthtokenToken: struct {
		ID, Created, UserID string

		User string
	}{
		ID:      "key",
		Created: "created",
		UserID:  "user_id",

		User: "User",
	},
	CrawlFifoentry: struct {
		ID, Url, Depth, ScanID string

		Scan string
	}{
		ID:     "id",
		Url:    "url",
		Depth:  "depth",
		ScanID: "scan_id",

		Scan: "Scan",
	},
	CrawlFiforelation: struct {
		ID, ParentID, ChildType, EntryID, Data string

		Entry string
	}{
		ID:        "id",
		ParentID:  "parent_id",
		ChildType: "child_type",
		EntryID:   "entry_id",
		Data:      "data",

		Entry: "Entry",
	},
	CrawlGroupsetting: struct {
		ID, MaxSites, GroupID, RecrawlSchedule, UptimeSchedule, RecrawlFrequency string

		Group string
	}{
		ID:               "id",
		MaxSites:         "max_sites",
		GroupID:          "group_id",
		RecrawlSchedule:  "recrawl_schedule",
		UptimeSchedule:   "uptime_schedule",
		RecrawlFrequency: "recrawl_frequency",

		Group: "Group",
	},
	CrawlLink: struct {
		ID, CreatedAt, Type, Url, Status, HttpStatus, ResponseTime, Error, ScanID, Size, TlsStatus, TlsID, CachedNumNonTlsImages, CachedNumNonTlsScripts, CachedNumNonTlsStylesheets, CachedNumTlsImages, CachedNumTlsScripts, CachedNumTlsStylesheets, CachedTlsImages, CachedTlsScripts, CachedTlsStylesheets, CachedTlsTotal, CachedSizeImages, CachedSizeScripts, CachedSizeStylesheets, CachedSizeTotal, CachedImageOccurences, CachedLinkOccurences, CachedScriptOccurences, CachedStylesheetOccurences, CachedImageMissingAlts, CachedNumImages, CachedNumLinks, CachedNumNonOkImages, CachedNumNonOkLinks, CachedNumNonOkScripts, CachedNumNonOkStylesheets, CachedNumOkImages, CachedNumOkLinks, CachedNumOkScripts, CachedNumOkStylesheets, CachedNumScripts, CachedNumStylesheets string

		Scan, Tls string
	}{
		ID:                         "id",
		CreatedAt:                  "created_at",
		Type:                       "type",
		Url:                        "url",
		Status:                     "status",
		HttpStatus:                 "http_status",
		ResponseTime:               "response_time",
		Error:                      "error",
		ScanID:                     "scan_id",
		Size:                       "size",
		TlsStatus:                  "tls_status",
		TlsID:                      "tls_id",
		CachedNumNonTlsImages:      "cached_num_non_tls_images",
		CachedNumNonTlsScripts:     "cached_num_non_tls_scripts",
		CachedNumNonTlsStylesheets: "cached_num_non_tls_stylesheets",
		CachedNumTlsImages:         "cached_num_tls_images",
		CachedNumTlsScripts:        "cached_num_tls_scripts",
		CachedNumTlsStylesheets:    "cached_num_tls_stylesheets",
		CachedTlsImages:            "cached_tls_images",
		CachedTlsScripts:           "cached_tls_scripts",
		CachedTlsStylesheets:       "cached_tls_stylesheets",
		CachedTlsTotal:             "cached_tls_total",
		CachedSizeImages:           "cached_size_images",
		CachedSizeScripts:          "cached_size_scripts",
		CachedSizeStylesheets:      "cached_size_stylesheets",
		CachedSizeTotal:            "cached_size_total",
		CachedImageOccurences:      "cached_image_occurences",
		CachedLinkOccurences:       "cached_link_occurences",
		CachedScriptOccurences:     "cached_script_occurences",
		CachedStylesheetOccurences: "cached_stylesheet_occurences",
		CachedImageMissingAlts:     "cached_image_missing_alts",
		CachedNumImages:            "cached_num_images",
		CachedNumLinks:             "cached_num_links",
		CachedNumNonOkImages:       "cached_num_non_ok_images",
		CachedNumNonOkLinks:        "cached_num_non_ok_links",
		CachedNumNonOkScripts:      "cached_num_non_ok_scripts",
		CachedNumNonOkStylesheets:  "cached_num_non_ok_stylesheets",
		CachedNumOkImages:          "cached_num_ok_images",
		CachedNumOkLinks:           "cached_num_ok_links",
		CachedNumOkScripts:         "cached_num_ok_scripts",
		CachedNumOkStylesheets:     "cached_num_ok_stylesheets",
		CachedNumScripts:           "cached_num_scripts",
		CachedNumStylesheets:       "cached_num_stylesheets",

		Scan: "Scan",
		Tls:  "Tls",
	},
	CrawlLinkImage: struct {
		FromLinkID, ToLinkID, AltText string

		FromLink, ToLink string
	}{
		FromLinkID: "from_link_id",
		ToLinkID:   "to_link_id",
		AltText:    "alt_text",

		FromLink: "FromLink",
		ToLink:   "ToLink",
	},
	CrawlLinkLink: struct {
		FromLinkID, ToLinkID string

		FromLink, ToLink string
	}{
		FromLinkID: "from_link_id",
		ToLinkID:   "to_link_id",

		FromLink: "FromLink",
		ToLink:   "ToLink",
	},
	CrawlLinkScript: struct {
		FromLinkID, ToLinkID string

		FromLink, ToLink string
	}{
		FromLinkID: "from_link_id",
		ToLinkID:   "to_link_id",

		FromLink: "FromLink",
		ToLink:   "ToLink",
	},
	CrawlLinkStylesheet: struct {
		FromLinkID, ToLinkID string

		FromLink, ToLink string
	}{
		FromLinkID: "from_link_id",
		ToLinkID:   "to_link_id",

		FromLink: "FromLink",
		ToLink:   "ToLink",
	},
	CrawlPagedatum: struct {
		ID, Title, Description, H1First, H1Second, H2First, H2Second, LinkID string

		Link string
	}{
		ID:          "id",
		Title:       "title",
		Description: "description",
		H1First:     "h1_first",
		H1Second:    "h1_second",
		H2First:     "h2_first",
		H2Second:    "h2_second",
		LinkID:      "link_id",

		Link: "Link",
	},
	CrawlScan: struct {
		ID, StartedAt, FinishedAt, SiteID, ForceHttps string

		Site string
	}{
		ID:         "id",
		StartedAt:  "started_at",
		FinishedAt: "finished_at",
		SiteID:     "site_id",
		ForceHttps: "force_https",

		Site: "Site",
	},
	CrawlScanarchive: struct {
		ID, StartedAt, FinishedAt, ScanID, Data, SiteID string

		Site string
	}{
		ID:         "id",
		StartedAt:  "started_at",
		FinishedAt: "finished_at",
		ScanID:     "scan_id",
		Data:       "data",
		SiteID:     "site_id",

		Site: "Site",
	},
	CrawlScancache: struct {
		ID, CreatedAt, Data string

		Scan string
	}{
		ID:        "scan_id",
		CreatedAt: "created_at",
		Data:      "data",

		Scan: "Scan",
	},
	CrawlSite: struct {
		ID, CreatedAt, UpdatedAt, Url, VerificationID, Verified, UserID, LastVerifyError, Name, LargePageSizeThreshold, DeletedAt string

		User string
	}{
		ID:                     "id",
		CreatedAt:              "created_at",
		UpdatedAt:              "updated_at",
		Url:                    "url",
		VerificationID:         "verification_id",
		Verified:               "verified",
		UserID:                 "user_id",
		LastVerifyError:        "last_verify_error",
		Name:                   "name",
		LargePageSizeThreshold: "large_page_size_threshold",
		DeletedAt:              "deleted_at",

		User: "User",
	},
	CrawlTl: struct {
		ID, NotBefore, NotAfter, CommonName, Organization, DnsNames, IssuerOrganization, IssuerCn, CipherSuite, Version, Errors string
	}{
		ID:                 "id",
		NotBefore:          "not_before",
		NotAfter:           "not_after",
		CommonName:         "common_name",
		Organization:       "organization",
		DnsNames:           "dns_names",
		IssuerOrganization: "issuer_organization",
		IssuerCn:           "issuer_cn",
		CipherSuite:        "cipher_suite",
		Version:            "version",
		Errors:             "errors",
	},
	CrawlUserprofile: struct {
		ID, Settings, UserID, LargePageSizeThreshold string

		User string
	}{
		ID:                     "id",
		Settings:               "settings",
		UserID:                 "user_id",
		LargePageSizeThreshold: "large_page_size_threshold",

		User: "User",
	},
	DjangoAdminLog: struct {
		ID, ActionTime, ObjectID, ObjectRepr, ActionFlag, ChangeMessage, ContentTypeID, UserID string

		ContentType, User string
	}{
		ID:            "id",
		ActionTime:    "action_time",
		ObjectID:      "object_id",
		ObjectRepr:    "object_repr",
		ActionFlag:    "action_flag",
		ChangeMessage: "change_message",
		ContentTypeID: "content_type_id",
		UserID:        "user_id",

		ContentType: "ContentType",
		User:        "User",
	},
	DjangoContentType: struct {
		ID, AppLabel, Model string
	}{
		ID:       "id",
		AppLabel: "app_label",
		Model:    "model",
	},
	DjangoMigration: struct {
		ID, App, Name, Applied string
	}{
		ID:      "id",
		App:     "app",
		Name:    "name",
		Applied: "applied",
	},
	DjangoSession: struct {
		ID, SessionData, ExpireDate string
	}{
		ID:          "session_key",
		SessionData: "session_data",
		ExpireDate:  "expire_date",
	},
	DjangoSite: struct {
		ID, Domain, Name string
	}{
		ID:     "id",
		Domain: "domain",
		Name:   "name",
	},
	HealthCheckDbTestmodel: struct {
		ID, Title string
	}{
		ID:    "id",
		Title: "title",
	},
	PaymentStripecustomer: struct {
		ID, CustomerID, UserID string

		User string
	}{
		ID:         "id",
		CustomerID: "customer_id",
		UserID:     "user_id",

		User: "User",
	},
	PaymentSubscription: struct {
		ID, PriceID, GroupID, Features, Name string

		Group string
	}{
		ID:       "id",
		PriceID:  "price_id",
		GroupID:  "group_id",
		Features: "features",
		Name:     "name",

		Group: "Group",
	},
	PaymentUsersubscription: struct {
		ID, SubscriptionID, UserID, StripeID, Status, CancelAt string

		Subscription, User string
	}{
		ID:             "id",
		SubscriptionID: "subscription_id",
		UserID:         "user_id",
		StripeID:       "stripe_id",
		Status:         "status",
		CancelAt:       "cancel_at",

		Subscription: "Subscription",
		User:         "User",
	},
	SignupSignup: struct {
		ID, CreatedAt, FirstName, LastName, Username, Email, Url, Token string
	}{
		ID:        "id",
		CreatedAt: "created_at",
		FirstName: "first_name",
		LastName:  "last_name",
		Username:  "username",
		Email:     "email",
		Url:       "url",
		Token:     "token",
	},
	SocialaccountSocialaccount: struct {
		ID, Provider, Uid, LastLogin, DateJoined, ExtraData, UserID string

		User string
	}{
		ID:         "id",
		Provider:   "provider",
		Uid:        "uid",
		LastLogin:  "last_login",
		DateJoined: "date_joined",
		ExtraData:  "extra_data",
		UserID:     "user_id",

		User: "User",
	},
	SocialaccountSocialapp: struct {
		ID, Provider, Name, ClientID, Secret, Key string
	}{
		ID:       "id",
		Provider: "provider",
		Name:     "name",
		ClientID: "client_id",
		Secret:   "secret",
		Key:      "key",
	},
	SocialaccountSocialappSite: struct {
		ID, SocialappID, SiteID string

		Site, Socialapp string
	}{
		ID:          "id",
		SocialappID: "socialapp_id",
		SiteID:      "site_id",

		Site:      "Site",
		Socialapp: "Socialapp",
	},
	SocialaccountSocialtoken: struct {
		ID, Token, TokenSecret, ExpiresAt, AccountID, AppID string

		Account, App string
	}{
		ID:          "id",
		Token:       "token",
		TokenSecret: "token_secret",
		ExpiresAt:   "expires_at",
		AccountID:   "account_id",
		AppID:       "app_id",

		Account: "Account",
		App:     "App",
	},
	UptimeUptimestat: struct {
		ID, CreatedAt, Status, HttpStatus, ResponseTime, Error, SiteID string

		Site string
	}{
		ID:           "id",
		CreatedAt:    "created_at",
		Status:       "status",
		HttpStatus:   "http_status",
		ResponseTime: "response_time",
		Error:        "error",
		SiteID:       "site_id",

		Site: "Site",
	},
}

var Tables = struct {
	AccountEmailaddress struct {
		Name, Alias string
	}
	AccountEmailconfirmation struct {
		Name, Alias string
	}
	AuthGroup struct {
		Name, Alias string
	}
	AuthGroupPermission struct {
		Name, Alias string
	}
	AuthPermission struct {
		Name, Alias string
	}
	AuthUser struct {
		Name, Alias string
	}
	AuthUserGroup struct {
		Name, Alias string
	}
	AuthUserUserPermission struct {
		Name, Alias string
	}
	AuthtokenToken struct {
		Name, Alias string
	}
	CrawlFifoentry struct {
		Name, Alias string
	}
	CrawlFiforelation struct {
		Name, Alias string
	}
	CrawlGroupsetting struct {
		Name, Alias string
	}
	CrawlLink struct {
		Name, Alias string
	}
	CrawlLinkImage struct {
		Name, Alias string
	}
	CrawlLinkLink struct {
		Name, Alias string
	}
	CrawlLinkScript struct {
		Name, Alias string
	}
	CrawlLinkStylesheet struct {
		Name, Alias string
	}
	CrawlPagedatum struct {
		Name, Alias string
	}
	CrawlScan struct {
		Name, Alias string
	}
	CrawlScanarchive struct {
		Name, Alias string
	}
	CrawlScancache struct {
		Name, Alias string
	}
	CrawlSite struct {
		Name, Alias string
	}
	CrawlTl struct {
		Name, Alias string
	}
	CrawlUserprofile struct {
		Name, Alias string
	}
	DjangoAdminLog struct {
		Name, Alias string
	}
	DjangoContentType struct {
		Name, Alias string
	}
	DjangoMigration struct {
		Name, Alias string
	}
	DjangoSession struct {
		Name, Alias string
	}
	DjangoSite struct {
		Name, Alias string
	}
	HealthCheckDbTestmodel struct {
		Name, Alias string
	}
	PaymentStripecustomer struct {
		Name, Alias string
	}
	PaymentSubscription struct {
		Name, Alias string
	}
	PaymentUsersubscription struct {
		Name, Alias string
	}
	SignupSignup struct {
		Name, Alias string
	}
	SocialaccountSocialaccount struct {
		Name, Alias string
	}
	SocialaccountSocialapp struct {
		Name, Alias string
	}
	SocialaccountSocialappSite struct {
		Name, Alias string
	}
	SocialaccountSocialtoken struct {
		Name, Alias string
	}
	UptimeUptimestat struct {
		Name, Alias string
	}
}{
	AccountEmailaddress: struct {
		Name, Alias string
	}{
		Name:  "account_emailaddress",
		Alias: "t",
	},
	AccountEmailconfirmation: struct {
		Name, Alias string
	}{
		Name:  "account_emailconfirmation",
		Alias: "t",
	},
	AuthGroup: struct {
		Name, Alias string
	}{
		Name:  "auth_group",
		Alias: "t",
	},
	AuthGroupPermission: struct {
		Name, Alias string
	}{
		Name:  "auth_group_permissions",
		Alias: "t",
	},
	AuthPermission: struct {
		Name, Alias string
	}{
		Name:  "auth_permission",
		Alias: "t",
	},
	AuthUser: struct {
		Name, Alias string
	}{
		Name:  "auth_user",
		Alias: "t",
	},
	AuthUserGroup: struct {
		Name, Alias string
	}{
		Name:  "auth_user_groups",
		Alias: "t",
	},
	AuthUserUserPermission: struct {
		Name, Alias string
	}{
		Name:  "auth_user_user_permissions",
		Alias: "t",
	},
	AuthtokenToken: struct {
		Name, Alias string
	}{
		Name:  "authtoken_token",
		Alias: "t",
	},
	CrawlFifoentry: struct {
		Name, Alias string
	}{
		Name:  "crawl_fifoentry",
		Alias: "t",
	},
	CrawlFiforelation: struct {
		Name, Alias string
	}{
		Name:  "crawl_fiforelation",
		Alias: "t",
	},
	CrawlGroupsetting: struct {
		Name, Alias string
	}{
		Name:  "crawl_groupsettings",
		Alias: "t",
	},
	CrawlLink: struct {
		Name, Alias string
	}{
		Name:  "crawl_link",
		Alias: "t",
	},
	CrawlLinkImage: struct {
		Name, Alias string
	}{
		Name:  "crawl_link_images",
		Alias: "t",
	},
	CrawlLinkLink: struct {
		Name, Alias string
	}{
		Name:  "crawl_link_links",
		Alias: "t",
	},
	CrawlLinkScript: struct {
		Name, Alias string
	}{
		Name:  "crawl_link_scripts",
		Alias: "t",
	},
	CrawlLinkStylesheet: struct {
		Name, Alias string
	}{
		Name:  "crawl_link_stylesheets",
		Alias: "t",
	},
	CrawlPagedatum: struct {
		Name, Alias string
	}{
		Name:  "crawl_pagedata",
		Alias: "t",
	},
	CrawlScan: struct {
		Name, Alias string
	}{
		Name:  "crawl_scan",
		Alias: "t",
	},
	CrawlScanarchive: struct {
		Name, Alias string
	}{
		Name:  "crawl_scanarchive",
		Alias: "t",
	},
	CrawlScancache: struct {
		Name, Alias string
	}{
		Name:  "crawl_scancache",
		Alias: "t",
	},
	CrawlSite: struct {
		Name, Alias string
	}{
		Name:  "crawl_site",
		Alias: "t",
	},
	CrawlTl: struct {
		Name, Alias string
	}{
		Name:  "crawl_tls",
		Alias: "t",
	},
	CrawlUserprofile: struct {
		Name, Alias string
	}{
		Name:  "crawl_userprofile",
		Alias: "t",
	},
	DjangoAdminLog: struct {
		Name, Alias string
	}{
		Name:  "django_admin_log",
		Alias: "t",
	},
	DjangoContentType: struct {
		Name, Alias string
	}{
		Name:  "django_content_type",
		Alias: "t",
	},
	DjangoMigration: struct {
		Name, Alias string
	}{
		Name:  "django_migrations",
		Alias: "t",
	},
	DjangoSession: struct {
		Name, Alias string
	}{
		Name:  "django_session",
		Alias: "t",
	},
	DjangoSite: struct {
		Name, Alias string
	}{
		Name:  "django_site",
		Alias: "t",
	},
	HealthCheckDbTestmodel: struct {
		Name, Alias string
	}{
		Name:  "health_check_db_testmodel",
		Alias: "t",
	},
	PaymentStripecustomer: struct {
		Name, Alias string
	}{
		Name:  "payments_stripecustomer",
		Alias: "t",
	},
	PaymentSubscription: struct {
		Name, Alias string
	}{
		Name:  "payments_subscription",
		Alias: "t",
	},
	PaymentUsersubscription: struct {
		Name, Alias string
	}{
		Name:  "payments_usersubscription",
		Alias: "t",
	},
	SignupSignup: struct {
		Name, Alias string
	}{
		Name:  "signup_signup",
		Alias: "t",
	},
	SocialaccountSocialaccount: struct {
		Name, Alias string
	}{
		Name:  "socialaccount_socialaccount",
		Alias: "t",
	},
	SocialaccountSocialapp: struct {
		Name, Alias string
	}{
		Name:  "socialaccount_socialapp",
		Alias: "t",
	},
	SocialaccountSocialappSite: struct {
		Name, Alias string
	}{
		Name:  "socialaccount_socialapp_sites",
		Alias: "t",
	},
	SocialaccountSocialtoken: struct {
		Name, Alias string
	}{
		Name:  "socialaccount_socialtoken",
		Alias: "t",
	},
	UptimeUptimestat: struct {
		Name, Alias string
	}{
		Name:  "uptime_uptimestat",
		Alias: "t",
	},
}

type AccountEmailaddress struct {
	tableName struct{} `pg:"account_emailaddress,alias:t,,discard_unknown_columns"`

	ID       int    `pg:"id,pk"`
	Email    string `pg:"email,use_zero"`
	Verified bool   `pg:"verified,use_zero"`
	Primary  bool   `pg:"primary,use_zero"`
	UserID   int    `pg:"user_id,use_zero"`

	User *AuthUser `pg:"fk:user_id"`
}

type AccountEmailconfirmation struct {
	tableName struct{} `pg:"account_emailconfirmation,alias:t,,discard_unknown_columns"`

	ID             int        `pg:"id,pk"`
	Created        time.Time  `pg:"created,use_zero"`
	Sent           *time.Time `pg:"sent"`
	Key            string     `pg:"key,use_zero"`
	EmailAddressID int        `pg:"email_address_id,use_zero"`

	EmailAddress *AccountEmailaddress `pg:"fk:email_address_id"`
}

type AuthGroup struct {
	tableName struct{} `pg:"auth_group,alias:t,,discard_unknown_columns"`

	ID   int    `pg:"id,pk"`
	Name string `pg:"name,use_zero"`
}

type AuthGroupPermission struct {
	tableName struct{} `pg:"auth_group_permissions,alias:t,,discard_unknown_columns"`

	ID           int `pg:"id,pk"`
	GroupID      int `pg:"group_id,use_zero"`
	PermissionID int `pg:"permission_id,use_zero"`

	Permission *AuthPermission `pg:"fk:permission_id"`
	Group      *AuthGroup      `pg:"fk:group_id"`
}

type AuthPermission struct {
	tableName struct{} `pg:"auth_permission,alias:t,,discard_unknown_columns"`

	ID            int    `pg:"id,pk"`
	Name          string `pg:"name,use_zero"`
	ContentTypeID int    `pg:"content_type_id,use_zero"`
	Codename      string `pg:"codename,use_zero"`

	ContentType *DjangoContentType `pg:"fk:content_type_id"`
}

type AuthUser struct {
	tableName struct{} `pg:"auth_user,alias:t,,discard_unknown_columns"`

	ID          int        `pg:"id,pk"`
	Password    string     `pg:"password,use_zero"`
	LastLogin   *time.Time `pg:"last_login"`
	IsSuperuser bool       `pg:"is_superuser,use_zero"`
	Username    string     `pg:"username,use_zero"`
	FirstName   string     `pg:"first_name,use_zero"`
	LastName    string     `pg:"last_name,use_zero"`
	Email       string     `pg:"email,use_zero"`
	IsStaff     bool       `pg:"is_staff,use_zero"`
	IsActive    bool       `pg:"is_active,use_zero"`
	DateJoined  time.Time  `pg:"date_joined,use_zero"`
}

type AuthUserGroup struct {
	tableName struct{} `pg:"auth_user_groups,alias:t,,discard_unknown_columns"`

	ID      int `pg:"id,pk"`
	UserID  int `pg:"user_id,use_zero"`
	GroupID int `pg:"group_id,use_zero"`

	Group *AuthGroup `pg:"fk:group_id"`
	User  *AuthUser  `pg:"fk:user_id"`
}

type AuthUserUserPermission struct {
	tableName struct{} `pg:"auth_user_user_permissions,alias:t,,discard_unknown_columns"`

	ID           int `pg:"id,pk"`
	UserID       int `pg:"user_id,use_zero"`
	PermissionID int `pg:"permission_id,use_zero"`

	Permission *AuthPermission `pg:"fk:permission_id"`
	User       *AuthUser       `pg:"fk:user_id"`
}

type AuthtokenToken struct {
	tableName struct{} `pg:"authtoken_token,alias:t,,discard_unknown_columns"`

	ID      string    `pg:"key,pk"`
	Created time.Time `pg:"created,use_zero"`
	UserID  int       `pg:"user_id,use_zero"`

	User *AuthUser `pg:"fk:user_id"`
}

type CrawlFifoentry struct {
	tableName struct{} `pg:"crawl_fifoentry,alias:t,,discard_unknown_columns"`

	ID     int    `pg:"id,pk"`
	Url    string `pg:"url,use_zero"`
	Depth  int    `pg:"depth,use_zero"`
	ScanID int    `pg:"scan_id,use_zero"`

	Scan *CrawlScan `pg:"fk:scan_id"`
}

type CrawlFiforelation struct {
	tableName struct{} `pg:"crawl_fiforelation,alias:t,,discard_unknown_columns"`

	ID        int64                  `pg:"id,pk"`
	ParentID  int                    `pg:"parent_id,use_zero"`
	ChildType int                    `pg:"child_type,use_zero"`
	EntryID   int                    `pg:"entry_id,use_zero"`
	Data      map[string]interface{} `pg:"data"`

	Entry *CrawlFifoentry `pg:"fk:entry_id"`
}

type CrawlGroupsetting struct {
	tableName struct{} `pg:"crawl_groupsettings,alias:t,,discard_unknown_columns"`

	ID               int    `pg:"id,pk"`
	MaxSites         int    `pg:"max_sites,use_zero"`
	GroupID          int    `pg:"group_id,use_zero"`
	RecrawlSchedule  string `pg:"recrawl_schedule,use_zero"`
	UptimeSchedule   string `pg:"uptime_schedule,use_zero"`
	RecrawlFrequency int    `pg:"recrawl_frequency,use_zero"`

	Group *AuthGroup `pg:"fk:group_id"`
}

type CrawlLink struct {
	tableName struct{} `pg:"crawl_link,alias:t,,discard_unknown_columns"`

	ID                         int       `pg:"id,pk"`
	CreatedAt                  time.Time `pg:"created_at,use_zero"`
	Type                       int       `pg:"type,use_zero"`
	Url                        string    `pg:"url,use_zero"`
	Status                     int       `pg:"status,use_zero"`
	HttpStatus                 *int      `pg:"http_status"`
	ResponseTime               int       `pg:"response_time,use_zero"`
	Error                      *string   `pg:"error"`
	ScanID                     int       `pg:"scan_id,use_zero"`
	Size                       int       `pg:"size,use_zero"`
	TlsStatus                  int       `pg:"tls_status,use_zero"`
	TlsID                      *int      `pg:"tls_id"`
	CachedNumNonTlsImages      *int      `pg:"cached_num_non_tls_images"`
	CachedNumNonTlsScripts     *int      `pg:"cached_num_non_tls_scripts"`
	CachedNumNonTlsStylesheets *int      `pg:"cached_num_non_tls_stylesheets"`
	CachedNumTlsImages         *int      `pg:"cached_num_tls_images"`
	CachedNumTlsScripts        *int      `pg:"cached_num_tls_scripts"`
	CachedNumTlsStylesheets    *int      `pg:"cached_num_tls_stylesheets"`
	CachedTlsImages            *bool     `pg:"cached_tls_images"`
	CachedTlsScripts           *bool     `pg:"cached_tls_scripts"`
	CachedTlsStylesheets       *bool     `pg:"cached_tls_stylesheets"`
	CachedTlsTotal             *bool     `pg:"cached_tls_total"`
	CachedSizeImages           *int      `pg:"cached_size_images"`
	CachedSizeScripts          *int      `pg:"cached_size_scripts"`
	CachedSizeStylesheets      *int      `pg:"cached_size_stylesheets"`
	CachedSizeTotal            *int      `pg:"cached_size_total"`
	CachedImageOccurences      *int      `pg:"cached_image_occurences"`
	CachedLinkOccurences       *int      `pg:"cached_link_occurences"`
	CachedScriptOccurences     *int      `pg:"cached_script_occurences"`
	CachedStylesheetOccurences *int      `pg:"cached_stylesheet_occurences"`
	CachedImageMissingAlts     *int      `pg:"cached_image_missing_alts"`
	CachedNumImages            *int      `pg:"cached_num_images"`
	CachedNumLinks             *int      `pg:"cached_num_links"`
	CachedNumNonOkImages       *int      `pg:"cached_num_non_ok_images"`
	CachedNumNonOkLinks        *int      `pg:"cached_num_non_ok_links"`
	CachedNumNonOkScripts      *int      `pg:"cached_num_non_ok_scripts"`
	CachedNumNonOkStylesheets  *int      `pg:"cached_num_non_ok_stylesheets"`
	CachedNumOkImages          *int      `pg:"cached_num_ok_images"`
	CachedNumOkLinks           *int      `pg:"cached_num_ok_links"`
	CachedNumOkScripts         *int      `pg:"cached_num_ok_scripts"`
	CachedNumOkStylesheets     *int      `pg:"cached_num_ok_stylesheets"`
	CachedNumScripts           *int      `pg:"cached_num_scripts"`
	CachedNumStylesheets       *int      `pg:"cached_num_stylesheets"`

	Scan *CrawlScan `pg:"fk:scan_id"`
	Tls  *CrawlTl   `pg:"fk:tls_id"`
}

type CrawlLinkImage struct {
	tableName struct{} `pg:"crawl_link_images,alias:t,,discard_unknown_columns"`

	FromLinkID int     `pg:"from_link_id,use_zero"`
	ToLinkID   int     `pg:"to_link_id,use_zero"`
	AltText    *string `pg:"alt_text"`

	FromLink *CrawlLink `pg:"fk:from_link_id"`
	ToLink   *CrawlLink `pg:"fk:to_link_id"`
}

type CrawlLinkLink struct {
	tableName struct{} `pg:"crawl_link_links,alias:t,,discard_unknown_columns"`

	FromLinkID int `pg:"from_link_id,use_zero"`
	ToLinkID   int `pg:"to_link_id,use_zero"`

	FromLink *CrawlLink `pg:"fk:from_link_id"`
	ToLink   *CrawlLink `pg:"fk:to_link_id"`
}

type CrawlLinkScript struct {
	tableName struct{} `pg:"crawl_link_scripts,alias:t,,discard_unknown_columns"`

	FromLinkID int `pg:"from_link_id,use_zero"`
	ToLinkID   int `pg:"to_link_id,use_zero"`

	FromLink *CrawlLink `pg:"fk:from_link_id"`
	ToLink   *CrawlLink `pg:"fk:to_link_id"`
}

type CrawlLinkStylesheet struct {
	tableName struct{} `pg:"crawl_link_stylesheets,alias:t,,discard_unknown_columns"`

	FromLinkID int `pg:"from_link_id,use_zero"`
	ToLinkID   int `pg:"to_link_id,use_zero"`

	FromLink *CrawlLink `pg:"fk:from_link_id"`
	ToLink   *CrawlLink `pg:"fk:to_link_id"`
}

type CrawlPagedatum struct {
	tableName struct{} `pg:"crawl_pagedata,alias:t,,discard_unknown_columns"`

	ID          int    `pg:"id,pk"`
	Title       string `pg:"title,use_zero"`
	Description string `pg:"description,use_zero"`
	H1First     string `pg:"h1_first,use_zero"`
	H1Second    string `pg:"h1_second,use_zero"`
	H2First     string `pg:"h2_first,use_zero"`
	H2Second    string `pg:"h2_second,use_zero"`
	LinkID      int    `pg:"link_id,use_zero"`

	Link *CrawlLink `pg:"fk:link_id"`
}

type CrawlScan struct {
	tableName struct{} `pg:"crawl_scan,alias:t,,discard_unknown_columns"`

	ID         int        `pg:"id,pk"`
	StartedAt  time.Time  `pg:"started_at,use_zero"`
	FinishedAt *time.Time `pg:"finished_at"`
	SiteID     int        `pg:"site_id,use_zero"`
	ForceHttps *bool      `pg:"force_https"`

	Site *CrawlSite `pg:"fk:site_id"`
}

type CrawlScanarchive struct {
	tableName struct{} `pg:"crawl_scanarchive,alias:t,,discard_unknown_columns"`

	ID         int                    `pg:"id,pk"`
	StartedAt  time.Time              `pg:"started_at,use_zero"`
	FinishedAt time.Time              `pg:"finished_at,use_zero"`
	ScanID     int                    `pg:"scan_id,use_zero"`
	Data       map[string]interface{} `pg:"data,use_zero"`
	SiteID     int                    `pg:"site_id,use_zero"`

	Site *CrawlSite `pg:"fk:site_id"`
}

type CrawlScancache struct {
	tableName struct{} `pg:"crawl_scancache,alias:t,,discard_unknown_columns"`

	ID        int                    `pg:"scan_id,pk"`
	CreatedAt time.Time              `pg:"created_at,use_zero"`
	Data      map[string]interface{} `pg:"data,use_zero"`

	Scan *CrawlScan `pg:"fk:scan_id"`
}

type CrawlSite struct {
	tableName struct{} `pg:"crawl_site,alias:t,,discard_unknown_columns"`

	ID                     int        `pg:"id,pk"`
	CreatedAt              time.Time  `pg:"created_at,use_zero"`
	UpdatedAt              time.Time  `pg:"updated_at,use_zero"`
	Url                    string     `pg:"url,use_zero"`
	VerificationID         string     `pg:"verification_id,use_zero"`
	Verified               bool       `pg:"verified,use_zero"`
	UserID                 int        `pg:"user_id,use_zero"`
	LastVerifyError        *string    `pg:"last_verify_error"`
	Name                   string     `pg:"name,use_zero"`
	LargePageSizeThreshold *int       `pg:"large_page_size_threshold"`
	DeletedAt              *time.Time `pg:"deleted_at"`

	User *AuthUser `pg:"fk:user_id"`
}

type CrawlTl struct {
	tableName struct{} `pg:"crawl_tls,alias:t,,discard_unknown_columns"`

	ID                 int                    `pg:"id,pk"`
	NotBefore          time.Time              `pg:"not_before,use_zero"`
	NotAfter           time.Time              `pg:"not_after,use_zero"`
	CommonName         string                 `pg:"common_name,use_zero"`
	Organization       string                 `pg:"organization,use_zero"`
	DnsNames           []string               `pg:"dns_names,array,use_zero"`
	IssuerOrganization string                 `pg:"issuer_organization,use_zero"`
	IssuerCn           string                 `pg:"issuer_cn,use_zero"`
	CipherSuite        string                 `pg:"cipher_suite,use_zero"`
	Version            string                 `pg:"version,use_zero"`
	Errors             map[string]interface{} `pg:"errors"`
}

type CrawlUserprofile struct {
	tableName struct{} `pg:"crawl_userprofile,alias:t,,discard_unknown_columns"`

	ID                     int                    `pg:"id,pk"`
	Settings               map[string]interface{} `pg:"settings,use_zero"`
	UserID                 int                    `pg:"user_id,use_zero"`
	LargePageSizeThreshold int                    `pg:"large_page_size_threshold,use_zero"`

	User *AuthUser `pg:"fk:user_id"`
}

type DjangoAdminLog struct {
	tableName struct{} `pg:"django_admin_log,alias:t,,discard_unknown_columns"`

	ID            int       `pg:"id,pk"`
	ActionTime    time.Time `pg:"action_time,use_zero"`
	ObjectID      *string   `pg:"object_id"`
	ObjectRepr    string    `pg:"object_repr,use_zero"`
	ActionFlag    int       `pg:"action_flag,use_zero"`
	ChangeMessage string    `pg:"change_message,use_zero"`
	ContentTypeID *int      `pg:"content_type_id"`
	UserID        int       `pg:"user_id,use_zero"`

	ContentType *DjangoContentType `pg:"fk:content_type_id"`
	User        *AuthUser          `pg:"fk:user_id"`
}

type DjangoContentType struct {
	tableName struct{} `pg:"django_content_type,alias:t,,discard_unknown_columns"`

	ID       int    `pg:"id,pk"`
	AppLabel string `pg:"app_label,use_zero"`
	Model    string `pg:"model,use_zero"`
}

type DjangoMigration struct {
	tableName struct{} `pg:"django_migrations,alias:t,,discard_unknown_columns"`

	ID      int       `pg:"id,pk"`
	App     string    `pg:"app,use_zero"`
	Name    string    `pg:"name,use_zero"`
	Applied time.Time `pg:"applied,use_zero"`
}

type DjangoSession struct {
	tableName struct{} `pg:"django_session,alias:t,,discard_unknown_columns"`

	ID          string    `pg:"session_key,pk"`
	SessionData string    `pg:"session_data,use_zero"`
	ExpireDate  time.Time `pg:"expire_date,use_zero"`
}

type DjangoSite struct {
	tableName struct{} `pg:"django_site,alias:t,,discard_unknown_columns"`

	ID     int    `pg:"id,pk"`
	Domain string `pg:"domain,use_zero"`
	Name   string `pg:"name,use_zero"`
}

type HealthCheckDbTestmodel struct {
	tableName struct{} `pg:"health_check_db_testmodel,alias:t,,discard_unknown_columns"`

	ID    int    `pg:"id,pk"`
	Title string `pg:"title,use_zero"`
}

type PaymentStripecustomer struct {
	tableName struct{} `pg:"payments_stripecustomer,alias:t,,discard_unknown_columns"`

	ID         int    `pg:"id,pk"`
	CustomerID string `pg:"customer_id,use_zero"`
	UserID     int    `pg:"user_id,use_zero"`

	User *AuthUser `pg:"fk:user_id"`
}

type PaymentSubscription struct {
	tableName struct{} `pg:"payments_subscription,alias:t,,discard_unknown_columns"`

	ID       int      `pg:"id,pk"`
	PriceID  string   `pg:"price_id,use_zero"`
	GroupID  int      `pg:"group_id,use_zero"`
	Features []string `pg:"features,array,use_zero"`
	Name     string   `pg:"name,use_zero"`

	Group *AuthGroup `pg:"fk:group_id"`
}

type PaymentUsersubscription struct {
	tableName struct{} `pg:"payments_usersubscription,alias:t,,discard_unknown_columns"`

	ID             int        `pg:"id,pk"`
	SubscriptionID int        `pg:"subscription_id,use_zero"`
	UserID         int        `pg:"user_id,use_zero"`
	StripeID       string     `pg:"stripe_id,use_zero"`
	Status         int        `pg:"status,use_zero"`
	CancelAt       *time.Time `pg:"cancel_at"`

	Subscription *PaymentSubscription `pg:"fk:subscription_id"`
	User         *AuthUser            `pg:"fk:user_id"`
}

type SignupSignup struct {
	tableName struct{} `pg:"signup_signup,alias:t,,discard_unknown_columns"`

	ID        int       `pg:"id,pk"`
	CreatedAt time.Time `pg:"created_at,use_zero"`
	FirstName string    `pg:"first_name,use_zero"`
	LastName  string    `pg:"last_name,use_zero"`
	Username  string    `pg:"username,use_zero"`
	Email     string    `pg:"email,use_zero"`
	Url       string    `pg:"url,use_zero"`
	Token     string    `pg:"token,use_zero"`
}

type SocialaccountSocialaccount struct {
	tableName struct{} `pg:"socialaccount_socialaccount,alias:t,,discard_unknown_columns"`

	ID         int       `pg:"id,pk"`
	Provider   string    `pg:"provider,use_zero"`
	Uid        string    `pg:"uid,use_zero"`
	LastLogin  time.Time `pg:"last_login,use_zero"`
	DateJoined time.Time `pg:"date_joined,use_zero"`
	ExtraData  string    `pg:"extra_data,use_zero"`
	UserID     int       `pg:"user_id,use_zero"`

	User *AuthUser `pg:"fk:user_id"`
}

type SocialaccountSocialapp struct {
	tableName struct{} `pg:"socialaccount_socialapp,alias:t,,discard_unknown_columns"`

	ID       int    `pg:"id,pk"`
	Provider string `pg:"provider,use_zero"`
	Name     string `pg:"name,use_zero"`
	ClientID string `pg:"client_id,use_zero"`
	Secret   string `pg:"secret,use_zero"`
	Key      string `pg:"key,use_zero"`
}

type SocialaccountSocialappSite struct {
	tableName struct{} `pg:"socialaccount_socialapp_sites,alias:t,,discard_unknown_columns"`

	ID          int `pg:"id,pk"`
	SocialappID int `pg:"socialapp_id,use_zero"`
	SiteID      int `pg:"site_id,use_zero"`

	Site      *DjangoSite             `pg:"fk:site_id"`
	Socialapp *SocialaccountSocialapp `pg:"fk:socialapp_id"`
}

type SocialaccountSocialtoken struct {
	tableName struct{} `pg:"socialaccount_socialtoken,alias:t,,discard_unknown_columns"`

	ID          int        `pg:"id,pk"`
	Token       string     `pg:"token,use_zero"`
	TokenSecret string     `pg:"token_secret,use_zero"`
	ExpiresAt   *time.Time `pg:"expires_at"`
	AccountID   int        `pg:"account_id,use_zero"`
	AppID       int        `pg:"app_id,use_zero"`

	Account *SocialaccountSocialaccount `pg:"fk:account_id"`
	App     *SocialaccountSocialapp     `pg:"fk:app_id"`
}

type UptimeUptimestat struct {
	tableName struct{} `pg:"uptime_uptimestat,alias:t,,discard_unknown_columns"`

	ID           int       `pg:"id,pk"`
	CreatedAt    time.Time `pg:"created_at,use_zero"`
	Status       int       `pg:"status,use_zero"`
	HttpStatus   *int      `pg:"http_status"`
	ResponseTime int       `pg:"response_time,use_zero"`
	Error        *string   `pg:"error"`
	SiteID       int       `pg:"site_id,use_zero"`

	Site *CrawlSite `pg:"fk:site_id"`
}
