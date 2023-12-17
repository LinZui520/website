import request from "../utils/request";


export const UserRegister = (username: string, email: string, password: string) => request({
  url: '/user/register',
  method: 'post',
  data: {
    username,
    email,
    password,
  }
})