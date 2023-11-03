package api

type Group struct {
	SettingsApi SettingsApi
}

var Api = new(Group)
