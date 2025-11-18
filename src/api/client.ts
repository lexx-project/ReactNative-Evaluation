import axios, { AxiosError, AxiosRequestHeaders } from 'axios';
import * as Keychain from 'react-native-keychain';

const API_KEY_USERNAME = 'api_client';
const API_KEY_SECRET = 'API_KEY_SECRET_XYZ';
const API_KEY_SERVICE = 'com.ecom:apiKey';

const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

export async function storeApiKeySecret() {
  try {
    await Keychain.setGenericPassword(API_KEY_USERNAME, API_KEY_SECRET, {
      service: API_KEY_SERVICE,
    });
  } catch (err) {
    console.error('Gagal menyimpan API Key secure:', err);
  }
}

const ensureApiKeySeeded = storeApiKeySecret();

const getApiKeyFromSecureStore = async () => {
  const credentials = await Keychain.getGenericPassword({
    service: API_KEY_SERVICE,
  });
  return credentials?.password ?? null;
};

apiClient.interceptors.request.use(async config => {
  await ensureApiKeySeeded.catch(() => null);

  if (!config.headers) {
    config.headers = {} as AxiosRequestHeaders;
  }
  config.headers['X-Client-Platform'] = 'React-Native';

  try {
    const apiKey = await getApiKeyFromSecureStore();
    if (!apiKey) {
      const unauthorizedError = new AxiosError(
        'API Key tidak ditemukan di Keychain',
        '401',
        config,
        null,
        {
          status: 401,
          statusText: 'Unauthorized',
          headers: config.headers,
          config,
          data: {
            message: 'API Key hilang, mohon periksa konfigurasi keamanan.',
          },
        },
      );
      return Promise.reject(unauthorizedError);
    }

    config.headers['X-API-Key'] = apiKey;
    return config;
  } catch (err) {
    const message = (err as Error)?.message ?? 'Gagal mengambil API Key';
    const unauthorizedError = new AxiosError(
      message,
      '401',
      config,
      null,
      {
        status: 401,
        statusText: 'Unauthorized',
        headers: config.headers,
        config,
        data: { message },
      },
    );
    return Promise.reject(unauthorizedError);
  }
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
