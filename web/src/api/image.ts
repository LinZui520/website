import request from "../utils/request";

export const UploadImage = (image: any) => request({
  url: '/image/upload',
  method: 'post',
  data: {
    image,
  }
})

export const GetImagesByAuthor = () => request({
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