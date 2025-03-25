import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

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
