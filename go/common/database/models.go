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
	CrawlGroupsetting struct {
		ID, MaxSites, GroupID, RecrawlSchedule string

		Group string
	}
	CrawlLink struct {
		ID, CreatedAt, Type, Url, Status, HttpStatus, ResponseTime, Error, ScanID, Size, TlsStatus, TlsID, CachedNumNonTlsImages, CachedNumNonTlsScripts, CachedNumNonTlsStylesheets, CachedNumTlsImages, CachedNumTlsScripts, CachedNumTlsStylesheets, CachedTlsImages, CachedTlsScripts, CachedTlsStylesheets, CachedTlsTotal string

		Scan, Tls string
	}
	CrawlLinkImage struct {
		ID, FromLinkID, ToLinkID string

		FromLink, ToLink string
	}
	CrawlLinkLink struct {
		ID, FromLinkID, ToLinkID string

		FromLink, ToLink string
	}
	CrawlLinkScript struct {
		ID, FromLinkID, ToLinkID string

		FromLink, ToLink string
	}
	CrawlLinkStylesheet struct {
		ID, FromLinkID, ToLinkID string

		FromLink, ToLink string
	}
	CrawlPagedatum struct {
		ID, Title, Description, H1First, H1Second, H2First, H2Second, LinkID string

		Link string
	}
	CrawlScan struct {
		ID, StartedAt, FinishedAt, SiteID, EmailSent string

		Site string
	}
	CrawlSite struct {
		ID, CreatedAt, UpdatedAt, Url, VerificationID, Verified, UserID, LastVerifyError, Name string

		User string
	}
	CrawlTl struct {
		ID, NotBefore, NotAfter, CommonName, Organization, DnsNames, IssuerOrganization, IssuerCn, CipherSuite, Version, Errors string
	}
	CrawlUserprofile struct {
		ID, Settings, UserID string

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
		ID, SubscriptionID, UserID, StripeID, Status string

		Subscription, User string
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
	CrawlGroupsetting: struct {
		ID, MaxSites, GroupID, RecrawlSchedule string

		Group string
	}{
		ID:              "id",
		MaxSites:        "max_sites",
		GroupID:         "group_id",
		RecrawlSchedule: "recrawl_schedule",

		Group: "Group",
	},
	CrawlLink: struct {
		ID, CreatedAt, Type, Url, Status, HttpStatus, ResponseTime, Error, ScanID, Size, TlsStatus, TlsID, CachedNumNonTlsImages, CachedNumNonTlsScripts, CachedNumNonTlsStylesheets, CachedNumTlsImages, CachedNumTlsScripts, CachedNumTlsStylesheets, CachedTlsImages, CachedTlsScripts, CachedTlsStylesheets, CachedTlsTotal string

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

		Scan: "Scan",
		Tls:  "Tls",
	},
	CrawlLinkImage: struct {
		ID, FromLinkID, ToLinkID string

		FromLink, ToLink string
	}{
		ID:         "id",
		FromLinkID: "from_link_id",
		ToLinkID:   "to_link_id",

		FromLink: "FromLink",
		ToLink:   "ToLink",
	},
	CrawlLinkLink: struct {
		ID, FromLinkID, ToLinkID string

		FromLink, ToLink string
	}{
		ID:         "id",
		FromLinkID: "from_link_id",
		ToLinkID:   "to_link_id",

		FromLink: "FromLink",
		ToLink:   "ToLink",
	},
	CrawlLinkScript: struct {
		ID, FromLinkID, ToLinkID string

		FromLink, ToLink string
	}{
		ID:         "id",
		FromLinkID: "from_link_id",
		ToLinkID:   "to_link_id",

		FromLink: "FromLink",
		ToLink:   "ToLink",
	},
	CrawlLinkStylesheet: struct {
		ID, FromLinkID, ToLinkID string

		FromLink, ToLink string
	}{
		ID:         "id",
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
		ID, StartedAt, FinishedAt, SiteID, EmailSent string

		Site string
	}{
		ID:         "id",
		StartedAt:  "started_at",
		FinishedAt: "finished_at",
		SiteID:     "site_id",
		EmailSent:  "email_sent",

		Site: "Site",
	},
	CrawlSite: struct {
		ID, CreatedAt, UpdatedAt, Url, VerificationID, Verified, UserID, LastVerifyError, Name string

		User string
	}{
		ID:              "id",
		CreatedAt:       "created_at",
		UpdatedAt:       "updated_at",
		Url:             "url",
		VerificationID:  "verification_id",
		Verified:        "verified",
		UserID:          "user_id",
		LastVerifyError: "last_verify_error",
		Name:            "name",

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
		ID, Settings, UserID string

		User string
	}{
		ID:       "id",
		Settings: "settings",
		UserID:   "user_id",

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
		ID, SubscriptionID, UserID, StripeID, Status string

		Subscription, User string
	}{
		ID:             "id",
		SubscriptionID: "subscription_id",
		UserID:         "user_id",
		StripeID:       "stripe_id",
		Status:         "status",

		Subscription: "Subscription",
		User:         "User",
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
}

type AccountEmailaddress struct {
	tableName struct{} `sql:"account_emailaddress,alias:t" pg:",discard_unknown_columns"`

	ID       int    `sql:"id,pk"`
	Email    string `sql:"email,notnull"`
	Verified bool   `sql:"verified,notnull"`
	Primary  bool   `sql:"primary,notnull"`
	UserID   int    `sql:"user_id,notnull"`

	User *AuthUser `pg:"fk:user_id"`
}

type AccountEmailconfirmation struct {
	tableName struct{} `sql:"account_emailconfirmation,alias:t" pg:",discard_unknown_columns"`

	ID             int        `sql:"id,pk"`
	Created        time.Time  `sql:"created,notnull"`
	Sent           *time.Time `sql:"sent"`
	Key            string     `sql:"key,notnull"`
	EmailAddressID int        `sql:"email_address_id,notnull"`

	EmailAddress *AccountEmailaddress `pg:"fk:email_address_id"`
}

type AuthGroup struct {
	tableName struct{} `sql:"auth_group,alias:t" pg:",discard_unknown_columns"`

	ID   int    `sql:"id,pk"`
	Name string `sql:"name,notnull"`
}

type AuthGroupPermission struct {
	tableName struct{} `sql:"auth_group_permissions,alias:t" pg:",discard_unknown_columns"`

	ID           int `sql:"id,pk"`
	GroupID      int `sql:"group_id,notnull"`
	PermissionID int `sql:"permission_id,notnull"`

	Permission *AuthPermission `pg:"fk:permission_id"`
	Group      *AuthGroup      `pg:"fk:group_id"`
}

type AuthPermission struct {
	tableName struct{} `sql:"auth_permission,alias:t" pg:",discard_unknown_columns"`

	ID            int    `sql:"id,pk"`
	Name          string `sql:"name,notnull"`
	ContentTypeID int    `sql:"content_type_id,notnull"`
	Codename      string `sql:"codename,notnull"`

	ContentType *DjangoContentType `pg:"fk:content_type_id"`
}

type AuthUser struct {
	tableName struct{} `sql:"auth_user,alias:t" pg:",discard_unknown_columns"`

	ID          int        `sql:"id,pk"`
	Password    string     `sql:"password,notnull"`
	LastLogin   *time.Time `sql:"last_login"`
	IsSuperuser bool       `sql:"is_superuser,notnull"`
	Username    string     `sql:"username,notnull"`
	FirstName   string     `sql:"first_name,notnull"`
	LastName    string     `sql:"last_name,notnull"`
	Email       string     `sql:"email,notnull"`
	IsStaff     bool       `sql:"is_staff,notnull"`
	IsActive    bool       `sql:"is_active,notnull"`
	DateJoined  time.Time  `sql:"date_joined,notnull"`
}

type AuthUserGroup struct {
	tableName struct{} `sql:"auth_user_groups,alias:t" pg:",discard_unknown_columns"`

	ID      int `sql:"id,pk"`
	UserID  int `sql:"user_id,notnull"`
	GroupID int `sql:"group_id,notnull"`

	Group *AuthGroup `pg:"fk:group_id"`
	User  *AuthUser  `pg:"fk:user_id"`
}

type AuthUserUserPermission struct {
	tableName struct{} `sql:"auth_user_user_permissions,alias:t" pg:",discard_unknown_columns"`

	ID           int `sql:"id,pk"`
	UserID       int `sql:"user_id,notnull"`
	PermissionID int `sql:"permission_id,notnull"`

	Permission *AuthPermission `pg:"fk:permission_id"`
	User       *AuthUser       `pg:"fk:user_id"`
}

type AuthtokenToken struct {
	tableName struct{} `sql:"authtoken_token,alias:t" pg:",discard_unknown_columns"`

	ID      string    `sql:"key,pk"`
	Created time.Time `sql:"created,notnull"`
	UserID  int       `sql:"user_id,notnull"`

	User *AuthUser `pg:"fk:user_id"`
}

type CrawlGroupsetting struct {
	tableName struct{} `sql:"crawl_groupsettings,alias:t" pg:",discard_unknown_columns"`

	ID              int    `sql:"id,pk"`
	MaxSites        int    `sql:"max_sites,notnull"`
	GroupID         int    `sql:"group_id,notnull"`
	RecrawlSchedule string `sql:"recrawl_schedule,notnull"`

	Group *AuthGroup `pg:"fk:group_id"`
}

type CrawlLink struct {
	tableName struct{} `sql:"crawl_link,alias:t" pg:",discard_unknown_columns"`

	ID                         int       `sql:"id,pk"`
	CreatedAt                  time.Time `sql:"created_at,notnull"`
	Type                       int       `sql:"type,notnull"`
	Url                        string    `sql:"url,notnull"`
	Status                     int       `sql:"status,notnull"`
	HttpStatus                 *int      `sql:"http_status"`
	ResponseTime               int       `sql:"response_time,notnull"`
	Error                      *string   `sql:"error"`
	ScanID                     int       `sql:"scan_id,notnull"`
	Size                       int       `sql:"size,notnull"`
	TlsStatus                  int       `sql:"tls_status,notnull"`
	TlsID                      *int      `sql:"tls_id"`
	CachedNumNonTlsImages      *int      `sql:"cached_num_non_tls_images"`
	CachedNumNonTlsScripts     *int      `sql:"cached_num_non_tls_scripts"`
	CachedNumNonTlsStylesheets *int      `sql:"cached_num_non_tls_stylesheets"`
	CachedNumTlsImages         *int      `sql:"cached_num_tls_images"`
	CachedNumTlsScripts        *int      `sql:"cached_num_tls_scripts"`
	CachedNumTlsStylesheets    *int      `sql:"cached_num_tls_stylesheets"`
	CachedTlsImages            *bool     `sql:"cached_tls_images"`
	CachedTlsScripts           *bool     `sql:"cached_tls_scripts"`
	CachedTlsStylesheets       *bool     `sql:"cached_tls_stylesheets"`
	CachedTlsTotal             *bool     `sql:"cached_tls_total"`

	Scan *CrawlScan `pg:"fk:scan_id"`
	Tls  *CrawlTl   `pg:"fk:tls_id"`
}

type CrawlLinkImage struct {
	tableName struct{} `sql:"crawl_link_images,alias:t" pg:",discard_unknown_columns"`

	ID         int `sql:"id,pk"`
	FromLinkID int `sql:"from_link_id,notnull"`
	ToLinkID   int `sql:"to_link_id,notnull"`

	FromLink *CrawlLink `pg:"fk:from_link_id"`
	ToLink   *CrawlLink `pg:"fk:to_link_id"`
}

type CrawlLinkLink struct {
	tableName struct{} `sql:"crawl_link_links,alias:t" pg:",discard_unknown_columns"`

	ID         int `sql:"id,pk"`
	FromLinkID int `sql:"from_link_id,notnull"`
	ToLinkID   int `sql:"to_link_id,notnull"`

	FromLink *CrawlLink `pg:"fk:from_link_id"`
	ToLink   *CrawlLink `pg:"fk:to_link_id"`
}

type CrawlLinkScript struct {
	tableName struct{} `sql:"crawl_link_scripts,alias:t" pg:",discard_unknown_columns"`

	ID         int `sql:"id,pk"`
	FromLinkID int `sql:"from_link_id,notnull"`
	ToLinkID   int `sql:"to_link_id,notnull"`

	FromLink *CrawlLink `pg:"fk:from_link_id"`
	ToLink   *CrawlLink `pg:"fk:to_link_id"`
}

type CrawlLinkStylesheet struct {
	tableName struct{} `sql:"crawl_link_stylesheets,alias:t" pg:",discard_unknown_columns"`

	ID         int `sql:"id,pk"`
	FromLinkID int `sql:"from_link_id,notnull"`
	ToLinkID   int `sql:"to_link_id,notnull"`

	FromLink *CrawlLink `pg:"fk:from_link_id"`
	ToLink   *CrawlLink `pg:"fk:to_link_id"`
}

type CrawlPagedatum struct {
	tableName struct{} `sql:"crawl_pagedata,alias:t" pg:",discard_unknown_columns"`

	ID          int    `sql:"id,pk"`
	Title       string `sql:"title,notnull"`
	Description string `sql:"description,notnull"`
	H1First     string `sql:"h1_first,notnull"`
	H1Second    string `sql:"h1_second,notnull"`
	H2First     string `sql:"h2_first,notnull"`
	H2Second    string `sql:"h2_second,notnull"`
	LinkID      int    `sql:"link_id,notnull"`

	Link *CrawlLink `pg:"fk:link_id"`
}

type CrawlScan struct {
	tableName struct{} `sql:"crawl_scan,alias:t" pg:",discard_unknown_columns"`

	ID         int        `sql:"id,pk"`
	StartedAt  time.Time  `sql:"started_at,notnull"`
	FinishedAt *time.Time `sql:"finished_at"`
	SiteID     int        `sql:"site_id,notnull"`
	EmailSent  bool       `sql:"email_sent,notnull"`

	Site *CrawlSite `pg:"fk:site_id"`
}

type CrawlSite struct {
	tableName struct{} `sql:"crawl_site,alias:t" pg:",discard_unknown_columns"`

	ID              int       `sql:"id,pk"`
	CreatedAt       time.Time `sql:"created_at,notnull"`
	UpdatedAt       time.Time `sql:"updated_at,notnull"`
	Url             string    `sql:"url,notnull"`
	VerificationID  string    `sql:"verification_id,notnull"`
	Verified        bool      `sql:"verified,notnull"`
	UserID          int       `sql:"user_id,notnull"`
	LastVerifyError *string   `sql:"last_verify_error"`
	Name            string    `sql:"name,notnull"`

	User *AuthUser `pg:"fk:user_id"`
}

type CrawlTl struct {
	tableName struct{} `sql:"crawl_tls,alias:t" pg:",discard_unknown_columns"`

	ID                 int                    `sql:"id,pk"`
	NotBefore          time.Time              `sql:"not_before,notnull"`
	NotAfter           time.Time              `sql:"not_after,notnull"`
	CommonName         string                 `sql:"common_name,notnull"`
	Organization       string                 `sql:"organization,notnull"`
	DnsNames           []string               `sql:"dns_names,array,notnull"`
	IssuerOrganization string                 `sql:"issuer_organization,notnull"`
	IssuerCn           string                 `sql:"issuer_cn,notnull"`
	CipherSuite        string                 `sql:"cipher_suite,notnull"`
	Version            string                 `sql:"version,notnull"`
	Errors             map[string]interface{} `sql:"errors"`
}

type CrawlUserprofile struct {
	tableName struct{} `sql:"crawl_userprofile,alias:t" pg:",discard_unknown_columns"`

	ID       int                    `sql:"id,pk"`
	Settings map[string]interface{} `sql:"settings,notnull"`
	UserID   int                    `sql:"user_id,notnull"`

	User *AuthUser `pg:"fk:user_id"`
}

type DjangoAdminLog struct {
	tableName struct{} `sql:"django_admin_log,alias:t" pg:",discard_unknown_columns"`

	ID            int       `sql:"id,pk"`
	ActionTime    time.Time `sql:"action_time,notnull"`
	ObjectID      *string   `sql:"object_id"`
	ObjectRepr    string    `sql:"object_repr,notnull"`
	ActionFlag    int       `sql:"action_flag,notnull"`
	ChangeMessage string    `sql:"change_message,notnull"`
	ContentTypeID *int      `sql:"content_type_id"`
	UserID        int       `sql:"user_id,notnull"`

	ContentType *DjangoContentType `pg:"fk:content_type_id"`
	User        *AuthUser          `pg:"fk:user_id"`
}

type DjangoContentType struct {
	tableName struct{} `sql:"django_content_type,alias:t" pg:",discard_unknown_columns"`

	ID       int    `sql:"id,pk"`
	AppLabel string `sql:"app_label,notnull"`
	Model    string `sql:"model,notnull"`
}

type DjangoMigration struct {
	tableName struct{} `sql:"django_migrations,alias:t" pg:",discard_unknown_columns"`

	ID      int       `sql:"id,pk"`
	App     string    `sql:"app,notnull"`
	Name    string    `sql:"name,notnull"`
	Applied time.Time `sql:"applied,notnull"`
}

type DjangoSession struct {
	tableName struct{} `sql:"django_session,alias:t" pg:",discard_unknown_columns"`

	ID          string    `sql:"session_key,pk"`
	SessionData string    `sql:"session_data,notnull"`
	ExpireDate  time.Time `sql:"expire_date,notnull"`
}

type DjangoSite struct {
	tableName struct{} `sql:"django_site,alias:t" pg:",discard_unknown_columns"`

	ID     int    `sql:"id,pk"`
	Domain string `sql:"domain,notnull"`
	Name   string `sql:"name,notnull"`
}

type HealthCheckDbTestmodel struct {
	tableName struct{} `sql:"health_check_db_testmodel,alias:t" pg:",discard_unknown_columns"`

	ID    int    `sql:"id,pk"`
	Title string `sql:"title,notnull"`
}

type PaymentStripecustomer struct {
	tableName struct{} `sql:"payments_stripecustomer,alias:t" pg:",discard_unknown_columns"`

	ID         int    `sql:"id,pk"`
	CustomerID string `sql:"customer_id,notnull"`
	UserID     int    `sql:"user_id,notnull"`

	User *AuthUser `pg:"fk:user_id"`
}

type PaymentSubscription struct {
	tableName struct{} `sql:"payments_subscription,alias:t" pg:",discard_unknown_columns"`

	ID       int      `sql:"id,pk"`
	PriceID  string   `sql:"price_id,notnull"`
	GroupID  int      `sql:"group_id,notnull"`
	Features []string `sql:"features,array,notnull"`
	Name     string   `sql:"name,notnull"`

	Group *AuthGroup `pg:"fk:group_id"`
}

type PaymentUsersubscription struct {
	tableName struct{} `sql:"payments_usersubscription,alias:t" pg:",discard_unknown_columns"`

	ID             int    `sql:"id,pk"`
	SubscriptionID int    `sql:"subscription_id,notnull"`
	UserID         int    `sql:"user_id,notnull"`
	StripeID       string `sql:"stripe_id,notnull"`
	Status         int    `sql:"status,notnull"`

	Subscription *PaymentSubscription `pg:"fk:subscription_id"`
	User         *AuthUser            `pg:"fk:user_id"`
}

type SocialaccountSocialaccount struct {
	tableName struct{} `sql:"socialaccount_socialaccount,alias:t" pg:",discard_unknown_columns"`

	ID         int       `sql:"id,pk"`
	Provider   string    `sql:"provider,notnull"`
	Uid        string    `sql:"uid,notnull"`
	LastLogin  time.Time `sql:"last_login,notnull"`
	DateJoined time.Time `sql:"date_joined,notnull"`
	ExtraData  string    `sql:"extra_data,notnull"`
	UserID     int       `sql:"user_id,notnull"`

	User *AuthUser `pg:"fk:user_id"`
}

type SocialaccountSocialapp struct {
	tableName struct{} `sql:"socialaccount_socialapp,alias:t" pg:",discard_unknown_columns"`

	ID       int    `sql:"id,pk"`
	Provider string `sql:"provider,notnull"`
	Name     string `sql:"name,notnull"`
	ClientID string `sql:"client_id,notnull"`
	Secret   string `sql:"secret,notnull"`
	Key      string `sql:"key,notnull"`
}

type SocialaccountSocialappSite struct {
	tableName struct{} `sql:"socialaccount_socialapp_sites,alias:t" pg:",discard_unknown_columns"`

	ID          int `sql:"id,pk"`
	SocialappID int `sql:"socialapp_id,notnull"`
	SiteID      int `sql:"site_id,notnull"`

	Site      *DjangoSite             `pg:"fk:site_id"`
	Socialapp *SocialaccountSocialapp `pg:"fk:socialapp_id"`
}

type SocialaccountSocialtoken struct {
	tableName struct{} `sql:"socialaccount_socialtoken,alias:t" pg:",discard_unknown_columns"`

	ID          int        `sql:"id,pk"`
	Token       string     `sql:"token,notnull"`
	TokenSecret string     `sql:"token_secret,notnull"`
	ExpiresAt   *time.Time `sql:"expires_at"`
	AccountID   int        `sql:"account_id,notnull"`
	AppID       int        `sql:"app_id,notnull"`

	Account *SocialaccountSocialaccount `pg:"fk:account_id"`
	App     *SocialaccountSocialapp     `pg:"fk:app_id"`
}
