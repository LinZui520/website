import request from '@/utils/axios';

export const listTags = <T> () => request<T>({
  url: '/tag',
  method: 'get'
});

export const deleteTag = (id: string) => request({
  url: `/tag/${id}`,
  method: 'delete'
});

export const createTag = (tag_name: string) => request({
  url: '/tag',
  method: 'post',
  data: { tag_name }
});

export const getTag = <T> (id: string) => request<T>({
  url: `/tag/${id}`,
  method: 'get'
});

export const updateTag = (id: string, tag_name: string) => request({
  url: `/tag/${id}`,
  method: 'put',
  data: { tag_name }
});
