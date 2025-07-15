import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export type ApiResponse<T> = {
  code: number,
  data: T,
  message: string
};

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const request = async<T> (config: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
  return instance(config);
};

export default request;
