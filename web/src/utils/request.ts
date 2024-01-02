import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface RequestConfig extends AxiosRequestConfig {}

const request = (config: RequestConfig): Promise<AxiosResponse> => {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
    }
  });

  return instance(config);
};

export default request;