import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const request = (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  return instance(config);
};

export default request;
