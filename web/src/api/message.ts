import request from "../utils/request";

export const AddMessage = (content: string) => request({
  url: '/message/add',
  method: 'post',
  data: {
    content
  }
})

export const GetAllMessage = () => request({
  url: '/message/list',
  method: 'get',
})

export const DeleteMessage = (id: number) => request({
  url: '/message/delete',
  method: 'delete',
  params: {
    id
  }
})

export const GetMessageByAuthor = () => request({
  url: '/message/get',
  method: 'get',
})

export const MessageCount = () => request({
  url: '/message/count',
  method: 'get'
})