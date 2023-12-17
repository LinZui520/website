import request from "../utils/request";

export const GetCount = () => request({
  url: '/admin/count',
  method: 'get',
})