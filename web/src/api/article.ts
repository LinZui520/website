import request from "../utils/request";

export const GetAllArticle = () => request({
  url: '/article/list',
  method: 'get',
})

export const GetArticlesById = (id: number) => request({
  url: '/article/list/id',
  method: 'get',
  params: {
    id
  }
})

export const GetArticleByAuthor = () => request({
  url: '/article/author',
  method: 'get',
})

export const GetOneArticle = (id: number) => request({
  url: '/article/get',
  method: 'get',
  params: {
    id
  }
})

export const AddArticle = (title: string, content: string) => request({
  url: '/article/add',
  method: 'post',
  data: {
    title,
    content,
  }
})

export const DeleteArticle = (id: number) => request({
  url: '/article/delete',
  method: 'delete',
  params: {
    id
  }
})

export const UpdateArticle = (id: number, title: string, content: string) => request({
  url: '/article/update',
  method: 'post',
  data: {
    id,
    title,
    content,
  }
})

export const ArticleCount = () => request({
  url: '/article/count',
  method: 'get'
})