package api

type Group struct {
	UserApi    UserApi
	ArticleApi ArticleApi
}

var Api = new(Group)
