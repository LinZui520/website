import request from '@/utils/axios';

export const listCategories = <T> () => request<T>({
  url: '/category/list',
  method: 'get'
});

export const deleteCategory = (id: number) => request({
  url: `/category/delete/${id}`,
  method: 'delete'
});

export const createCategory = (name: string, description: string) => request({
  url: '/category/create',
  method: 'post',
  data: { name, description }
});

export const getCategory = <T> (id: number) => request<T>({
  url: `/category/get/${id}`,
  method: 'get'
});

export const updateCategory = (id: number, name: string, description: string) => request({
  url: `/category/update`,
  method: 'put',
  data: { id, name, description }
});
