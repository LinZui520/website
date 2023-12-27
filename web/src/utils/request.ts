import axios from "axios";

const request = (config: any) => {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
    }
  })

  return instance(config)
}

export default request