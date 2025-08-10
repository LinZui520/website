import request from '../../utils/axios';

export const readBoard = <T> () => request<T>({
  url: '/board',
  method: 'get'
});
