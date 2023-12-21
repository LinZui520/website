import request from "../utils/request";

export const UserLogin = (username: string, password: string) => request({
  url: '/user/login',
  method: 'post',
  data: {
    username,
    password,
  }
})

export const UserTokenLogin = () => request({
  url: '/user/token',
  method: 'get',
})


export const UserVerify = (email: string) => request({
  url: '/user/verify',
  method: 'get',
  params: {
    email
  }
})

export const UserRegister = (username: string, password: string, email: string, code: string) => request({
  url: '/user/register',
  method: 'post',
  data: {
    username,
    password,
    email,
    code,
  }
})
