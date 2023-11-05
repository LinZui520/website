import request from '@/utils/request'

export const userLogin = (username: string, password: string) => request({
  url: 'user/login',
  method: 'post',
  data: {
    username,
    password,
  }
})

