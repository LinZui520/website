import request from '../../utils/axios';

export const listPhotos = <T> () => request<T>({
  url: '/photo/list',
  method: 'get'
});

export const uploadPhoto = (formData: FormData) => request({
  url: '/photo/upload',
  method: 'post',
  data: formData,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
