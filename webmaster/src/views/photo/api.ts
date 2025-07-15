import request from '@/utils/axios';

export const listPhotos = <T> () => request<T>({
  url: '/photo/list',
  method: 'get'
});

export const deletePhoto = (id: number) => request({
  url: `/photo/delete/${id}`,
  method: 'delete'
});
