//nolint
//lint:file-ignore U1000 ignore unused code, it's generated
package model

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
	CrawlLink struct {
		ID, CreatedAt, Type, Url, Status, HttpStatus, ResponseTime, Error, ScanID string

		Scan string
	}
	CrawlLinkLink struct {
		ID, FromLinkID, ToLinkID string

		FromLink, ToLink string
	}
	CrawlScan struct {
		ID, StartedAt, FinishedAt, SiteID string

		Site string
	}
	CrawlSite struct {
		ID, CreatedAt, UpdatedAt, Url, VerificationID, Verified, UserID string

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
	CrawlLink: struct {
		ID, CreatedAt, Type, Url, Status, HttpStatus, ResponseTime, Error, ScanID string

		Scan string
	}{
		ID:           "id",
		CreatedAt:    "created_at",
		Type:         "type",
		Url:          "url",
		Status:       "status",
		HttpStatus:   "http_status",
		ResponseTime: "response_time",
		Error:        "error",
		ScanID:       "scan_id",

		Scan: "Scan",
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
	CrawlScan: struct {
		ID, StartedAt, FinishedAt, SiteID string

		Site string
	}{
		ID:         "id",
		StartedAt:  "started_at",
		FinishedAt: "finished_at",
		SiteID:     "site_id",

		Site: "Site",
	},
	CrawlSite: struct {
		ID, CreatedAt, UpdatedAt, Url, VerificationID, Verified, UserID string

		User string
	}{
		ID:             "id",
		CreatedAt:      "created_at",
		UpdatedAt:      "updated_at",
		Url:            "url",
		VerificationID: "verification_id",
		Verified:       "verified",
		UserID:         "user_id",

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
	CrawlLink struct {
		Name, Alias string
	}
	CrawlLinkLink struct {
		Name, Alias string
	}
	CrawlScan struct {
		Name, Alias string
	}
	CrawlSite struct {
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
	CrawlLink: struct {
		Name, Alias string
	}{
		Name:  "crawl_link",
		Alias: "t",
	},
	CrawlLinkLink: struct {
		Name, Alias string
	}{
		Name:  "crawl_link_links",
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

type CrawlLink struct {
	tableName struct{} `sql:"crawl_link,alias:t" pg:",discard_unknown_columns"`

	ID           int       `sql:"id,pk"`
	CreatedAt    time.Time `sql:"created_at,notnull"`
	Type         int       `sql:"type,notnull"`
	Url          string    `sql:"url,notnull"`
	Status       int       `sql:"status,notnull"`
	HttpStatus   *int      `sql:"http_status"`
	ResponseTime int       `sql:"response_time,notnull"`
	Error        *string   `sql:"error"`
	ScanID       int       `sql:"scan_id,notnull"`

	Scan *CrawlScan `pg:"fk:scan_id"`
}

type CrawlLinkLink struct {
	tableName struct{} `sql:"crawl_link_links,alias:t" pg:",discard_unknown_columns"`

	ID         int `sql:"id,pk"`
	FromLinkID int `sql:"from_link_id,notnull"`
	ToLinkID   int `sql:"to_link_id,notnull"`

	FromLink *CrawlLink `pg:"fk:from_link_id"`
	ToLink   *CrawlLink `pg:"fk:to_link_id"`
}

type CrawlScan struct {
	tableName struct{} `sql:"crawl_scan,alias:t" pg:",discard_unknown_columns"`

	ID         int        `sql:"id,pk"`
	StartedAt  time.Time  `sql:"started_at,notnull"`
	FinishedAt *time.Time `sql:"finished_at"`
	SiteID     int        `sql:"site_id,notnull"`

	Site *CrawlSite `pg:"fk:site_id"`
}

type CrawlSite struct {
	tableName struct{} `sql:"crawl_site,alias:t" pg:",discard_unknown_columns"`

	ID             int       `sql:"id,pk"`
	CreatedAt      time.Time `sql:"created_at,notnull"`
	UpdatedAt      time.Time `sql:"updated_at,notnull"`
	Url            string    `sql:"url,notnull"`
	VerificationID string    `sql:"verification_id,notnull"`
	Verified       bool      `sql:"verified,notnull"`
	UserID         int       `sql:"user_id,notnull"`

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
