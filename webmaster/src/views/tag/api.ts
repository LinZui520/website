import request from '@/utils/axios';

export const listTags = <T> () => request<T>({
  url: '/tag',
  method: 'get'
});

export const deleteTag = (id: number) => request({
  url: `/tag/${id}`,
  method: 'delete'
});

export const createTag = (name: string) => request({
  url: '/tag',
  method: 'post',
  data: { name }
});

export const getTag = <T> (id: number) => request<T>({
  url: `/tag/${id}`,
  method: 'get'
});

export const updateTag = (id: number, name: string) => request({
  url: `/tag/${id}`,
  method: 'put',
  data: { name }
});
