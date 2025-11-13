import axios, { AxiosRequestHeaders } from 'axios';

const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

apiClient.interceptors.request.use(config => {
  if (!config.headers) {
    config.headers = {} as AxiosRequestHeaders;
  }
  config.headers['X-Client-Platform'] = 'React-Native';
  return config;
});

apiClient.interceptors.response.use(
  response => {
    if (
      response.status === 200 &&
      response.config.url?.includes('/auth/login')
    ) {
      return {
        ...response,
        data: {
          success: true,
          token: 'Saya_Pun_Tak_Tahu',
        },
      };
    }
    return response;
  },
  error => Promise.reject(error),
);

export default apiClient;
