import request from "../utils/request";

export const userLogin = () => request({
  url: '/user/login',
  method: 'post',
  data: {
    username: 'linzui',
    password: '123456',
  }
})