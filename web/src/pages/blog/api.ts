import request from '../../utils/axios.ts';

export const listBlogs = <T> () => request<T>({
  url: '/blog/list-published',
  method: 'get'
});
