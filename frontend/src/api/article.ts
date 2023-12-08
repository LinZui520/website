import request from "../utils/request";

export const GetAllArticle = () => request({
  url: '/article/list',
  method: 'get',
})

export const GetOneArticle = (id: number) => request({
  url: '/article/get',
  method: 'get',
  params: {
    id
  }
})