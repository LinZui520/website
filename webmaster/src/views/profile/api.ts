import request from '@/utils/axios';

export const uploadAvatar = (formData: FormData) => request({
  url: '/auth/profile/avatar',
  method: 'put',
  data: formData,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const updateUsername = (username: string) => request({
  url: '/auth/profile/username',
  method: 'put',
  data: { username }
});
