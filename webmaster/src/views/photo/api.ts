import request from '@/utils/axios';

export const listPhotos = <T> () => request<T>({
  url: '/photo',
  method: 'get'
});

export const deletePhoto = (id: string) => request({
  url: `/photo/${id}`,
  method: 'delete'
});
