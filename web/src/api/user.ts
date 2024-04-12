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


export const UserVerify = (email: string, x: number, y: number, duration: number, trail: number[][], length: number) => request({
  url: '/user/verify',
  method: 'post',
  data: {
    email,
    x,
    y,
    duration,
    trail,
    length,
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


export const GetAllUser = () => request({
  url: '/user/list',
  method: 'get',
})

export const BlockUser = (id: number) => request({
  url: '/user/block',
  method: 'get',
  params: {
    id
  }
})

export const BoostUser = (id: number) => request({
  url: '/user/boost',
  method: 'get',
  params: {
    id
  }
})

export const UserSecurity = (username: string, password: string, email: string, code: string) => request({
  url: '/user/security',
  method: 'post',
  data: {
    username,
    password,
    email,
    code,
  }
})

export const UploadAvatar = (avatar: File) => request({
  url: '/user/avatar',
  method: 'post',
  data: {
    avatar,
  }
})

export const UserCount = () => request({
  url: '/user/count',
  method: 'get',
})

export const GetUserInfo = (username: string) => request({
  url: '/user/info',
  method: 'get',
  params: {
    username
  }
})