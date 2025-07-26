import request from '@/utils/axios';

export const listPictures = <T> () => request<T>({
  url: '/picture',
  method: 'get'
});

export const deletePicture = (id: string) => request({
  url: `/picture/${id}`,
  method: 'delete'
});

export const uploadPicture = (formData: FormData) => request({
  url: '/picture',
  method: 'post',
  data: formData,
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  timeout: 60000
});
