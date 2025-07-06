import request from '@/utils/axios';

export const listImages = <T> () => request<T>({
  url: '/image/list',
  method: 'get'
});

export const deleteImage = (id: number) => request({
  url: `/image/delete/${id}`,
  method: 'delete'
});

export const uploadImage = (formData: FormData) => request({
  url: '/image/upload',
  method: 'post',
  data: formData,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
