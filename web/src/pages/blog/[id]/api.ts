import request from '../../../utils/axios';

export const getBlog = <T> (id: number) => request<T>({
  url: `/blog/get/${id}`,
  method: 'get'
});
