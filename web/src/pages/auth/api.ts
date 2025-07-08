import request from '../../utils/axios.ts';

export const userVerifyCode = (email: string) => request({
  url: '/auth/verification-code',
  method: 'POST',
  data: { email }
});

export const userRegister = (username: string, email: string, code: string, password: string) => request({
  url: '/auth/register',
  method: 'POST',
  data: { username, email, code, password }
});

export const userLogin = <T> (email: string, password: string) => request<T>({
  url: '/auth/login',
  method: 'POST',
  data: { email, password }
});

export const userJWTLogin = <T> () => request<T>({
  url: '/auth/jwt-login',
  method: 'GET'
});

export const userResetPassword = (email: string, code: string, password: string) => request({
  url: '/auth/reset-password',
  method: 'PUT',
  data: { email, code, password }
});
