package common

import "os"

func Env(name, def string) string {
	if value, ok := os.LookupEnv(name); ok {
		return value
	}
	return def
}
