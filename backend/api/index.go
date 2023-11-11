package api

type Group struct {
	UserApi    UserApi
	ArticleApi ArticleApi
	ImageApi   ImageApi
	CommentApi CommentApi
}

var Api = new(Group)
