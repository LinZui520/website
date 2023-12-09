import request from "../utils/request";

export const GetAllMessage = () => request({
  url: '/message/list',
  method: 'get',
})