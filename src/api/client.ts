import axios, { AxiosError, AxiosRequestHeaders } from 'axios';

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

type ValidationErrors = Record<string, string>;

export type ApiValidationError = AxiosError & {
  validationErrors?: ValidationErrors;
};

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
  error => {
    const axiosError = error as ApiValidationError;
    const status = axiosError.response?.status;
    const isValidationCandidate =
      status === 400 &&
      (axiosError.config?.url?.includes('/http/400') ||
        axiosError.config?.url?.includes('/checkout'));

    if (isValidationCandidate) {
      const payload = axiosError.response?.data as {
        errors?: ValidationErrors;
        message?: string;
      };
      const fallbackErrors: ValidationErrors = {
        address: payload?.message ?? 'Alamat wajib diisi',
      };
      axiosError.validationErrors = payload?.errors ?? fallbackErrors;
      if (!payload?.errors) {
        axiosError.response = {
          ...(axiosError.response ?? {}),
          status: 400,
          statusText: 'Bad Request',
          headers: axiosError.response?.headers ?? {},
          config: axiosError.config!,
          request: axiosError.response?.request,
          data: {
            ...(payload ?? {}),
            errors: axiosError.validationErrors,
          },
        };
      }
      console.error('Checkout validation error:', axiosError.validationErrors);
    }

    return Promise.reject(axiosError);
  },
);

export default apiClient;
