import request from '@/utils/axios';

export const listPictures = <T> () => request<T>({
  url: '/picture/list',
  method: 'get'
});

export const deletePicture = (id: number) => request({
  url: `/picture/delete/${id}`,
  method: 'delete'
});

export const uploadPicture = (formData: FormData) => request({
  url: '/picture/upload',
  method: 'post',
  data: formData,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
