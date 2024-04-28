import request from "../utils/request";

export const AddComment = (article: number, content: string) => request({
  url: '/comment/add',
  method: 'post',
  data: {
    article,
    content,
  }
})

export const DeleteComment = (id: number) => request({
  url: '/comment/delete',
  method: 'delete',
  params: {
    id
  }
})

export const GetCommentByArticle = (id: number) => request({
  url: '/comment/get',
  method: 'get',
  params: {
    id
  }
})

export const GetCommentByAuthor = () => request({
  url: '/comment/author',
  method: 'get',
})

export const GetComments = () => request({
  url: '/comment/list',
  method: 'get',
})
