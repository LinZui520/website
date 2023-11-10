import request from '@/utils/request'

export const getImage = (id: number) => request({
  url: 'image/get',
  method: 'get',
  params: {
    id
  }
})