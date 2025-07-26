import request from '@/utils/axios';

export const listUsers = <T> () => request<T>({
  url: '/user',
  method: 'get'
});

export const increaseUserPermission = (id: number) => request({
  url: `/user/increase/${id}`,
  method: 'put'
});

export const decreaseUserPermission = (id: number) => request({
  url: `/user/decrease/${id}`,
  method: 'put'
});
