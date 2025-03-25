import request from '@/utils/axios';

export const getCategoryList = <T> () => request<T>({
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
