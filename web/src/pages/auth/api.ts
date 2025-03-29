import request from '../../utils/axios.ts';

export const userVerifyCode = (email: string) => request({
  url: '/user/verification-code',
  method: 'POST',
  data: { email }
});

export const userRegister = (username: string, email: string, code: string, password: string) => request({
  url: '/user/register',
  method: 'POST',
  data: { username, email, code, password }
});

export const userLogin = <T> (email: string, password: string) => request<T>({
  url: '/user/login',
  method: 'POST',
  data: { email, password }
});

export const userJWTLogin = <T> () => request<T>({
  url: '/user/jwt-login',
  method: 'GET'
});

export const userResetPassword = (email: string, code: string, password: string) => request({
  url: '/user/reset-password',
  method: 'PUT',
  data: { email, code, password }
});
