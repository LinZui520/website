import request from '@/utils/request'

export const addComment = (commenter: number, content: string) => request({
  url: 'comment/add',
  method: 'post',
  data: {
    commenter,
    content
  }
})

export const getAllComment = () => request({
  url: 'comment/list',
  method: 'get',
})