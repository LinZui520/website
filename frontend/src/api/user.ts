import request from "../utils/request";

export const UserLogin = (username: string, password: string) => request({
  url: '/user/login',
  method: 'post',
  data: {
    username,
    password,
  }
})

export const UserRegister = (nickname: string, username: string, password: string) => request({
  url: '/user/register',
  method: 'post',
  data: {
    nickname,
    username,
    password,
  }
})