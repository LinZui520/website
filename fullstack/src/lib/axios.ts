import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const request = (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return instance(config);
};

export default request;
