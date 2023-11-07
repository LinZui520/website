import request from '@/utils/request'

export const getAllArticle = () => request({
  url: 'article/list',
  method: 'get',
})

export const getOneArticle = (id: number) => request({
  url: 'article/get',
  method: 'get',
  params: {
    id
  }
})

export const addArticle = (title: string,image: File, content: string) => request({
  url: 'article/add',
  method: 'post',
  data: {
    title,
    image,
    content
  }
})

export const deleteArticle = (id: number) => request({
  url: 'article/delete',
  method: 'delete',
  params: {
    id
  }
})