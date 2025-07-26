import request from '../../utils/axios';

export const listPhotos = <T> () => request<T>({
  url: '/photo',
  method: 'get'
});

export const uploadPhoto = (formData: FormData) => request({
  url: '/photo',
  method: 'post',
  data: formData,
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  timeout: 60000
});
