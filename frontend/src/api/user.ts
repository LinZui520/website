import request from '@/utils/request'

export const userLogin = (username: string, password: string) => request({
  url: 'user/login',
  method: 'post',
  data: {
    username,
    password,
  }
})


export const userRegister = (nickname: string,username: string, password: string) => request({
  url: 'user/register',
  method: 'post',
  data: {
    nickname,
    username,
    password,
  }
})

export const userInfo = (username: string) => request({
  url: 'user/info',
  method: 'get',
  params: {
    username
  }
})

export const userTokenLogin = () => request({
  url: 'user/token/login',
  method: 'get',
})

export const getUser = (id: number) => request({
  url: 'user/get',
  method: 'get',
  params: {
    id
  }
})