import request from "../utils/request";

export const UploadImage = (image: File) => request({
  url: '/image/upload',
  method: 'post',
  data: {
    image,
  }
})

export const GetAllImage = () => request({
  url: '/image/list',
  method: 'get',
})

export const GetImageByAuthor = () => request({
  url: '/image/get',
  method: 'get',
})

export const DeleteImage = (id: number) => request({
  url: '/image/delete',
  method: 'delete',
  params: {
    id
  }
})

export const ImageCount = () => request({
  url: '/image/count',
  method: 'get'
})