import request from '../../../utils/axios';

export const getBlog = <T> (id: string) => request<T>({
  url: `/blog/${id}`,
  method: 'get'
});
