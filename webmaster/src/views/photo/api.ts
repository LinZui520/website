import request from '@/utils/axios';

export const listPhotos = <T> () => request<T>({
  url: '/photo',
  method: 'get'
});

export const deletePhoto = (id: string) => request({
  url: `/photo/${id}`,
  method: 'delete'
});

export const updatePhoto = (id: string, description: string) => request({
  url: `/photo/${id}`,
  method: 'put',
  data: { description }
});
