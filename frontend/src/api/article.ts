import request from '@/utils/request'

export const getAllArticle = () => request({
  url: 'article/list',
  method: 'get',
})


//根据文章获取图片
export const getSpecifiedImage = (id: number) => request({
  url: 'image/get',
  method: 'get',
  params: {
    belong: id
  }
})