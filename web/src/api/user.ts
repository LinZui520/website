import request from '../utils/axios.ts';
import { AxiosResponse } from 'axios';

export const userVerifyCode = (email: string) => request({
  url: '/user/code',
  method: 'POST',
  data: { email }
});

export const userRegister = (username: string, email: string, code: string, password: string) => request({
  url: '/user/register',
  method: 'POST',
  data: { username, email, code, password }
});

export const userLogin = (email: string, password: string): Promise<AxiosResponse> => request({
  url: '/user/login',
  method: 'POST',
  data: { email, password }
});
