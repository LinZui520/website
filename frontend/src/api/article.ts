import request from "../utils/request";

export const GetAllArticle = () => request({
  url: '/article/list',
  method: 'get',
})