package api

type Group struct {
	UserApi UserApi
}

var Api = new(Group)
