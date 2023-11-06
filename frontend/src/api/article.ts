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

//根据文章获取图片
export const getSpecifiedImage = (id: number) => request({
  url: 'image/get',
  method: 'get',
  params: {
    belong: id
  }
})