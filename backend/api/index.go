package api

type Group struct {
	UserApi    UserApi
	ArticleApi ArticleApi
	ImageApi   ImageApi
}

var Api = new(Group)
