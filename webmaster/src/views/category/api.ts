import request from '@/utils/axios';

export const getCategoryList = () => request({
  url: '/category/list',
  method: 'get'
});

export const deleteCategory = (id: number) => request({
  url: `/category/delete/${id}`,
  method: 'delete'
});
