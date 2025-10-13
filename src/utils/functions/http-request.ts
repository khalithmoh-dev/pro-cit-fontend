import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
const activeRequests: { count: number } = { count: 0 }; // tracks concurrent requests

let setLoadingGlobal: ((val: boolean) => void) | null = null;

export const initGlobalLoader = (setLoadingFn: (val: boolean) => void) => {
  setLoadingGlobal = setLoadingFn;
}

interface HttpRequestOptions {
  skipLoader?: boolean;
  headers?: Record<string, string>;
  timeout?: number;
  baseURL?: string;
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer';
  withCredentials?: boolean;
}

// Create axios instance with default config
const axiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token safely
    let accessToken: string | null = null;
    try {
      accessToken = window?.sessionStorage?.getItem('accessToken');
    } catch (error) {
      console.warn('Unable to access sessionStorage:', error);
    }

    // Add authorization header if token exists
    if (accessToken) {
      try {
        const parsedToken = JSON.parse(accessToken);
        if (typeof parsedToken === 'string') {
          config.headers.Authorization = `Bearer ${parsedToken}`;
        }
      } catch (error) {
        console.warn('Invalid token format, proceeding without authorization header');
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      try {
        window.sessionStorage.clear();
        window.localStorage.clear();
        window.location.replace('/login');
      } catch {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

const httpRequest = async <T = any>(
  method: Method,
  url: string,
  data?: any,
  options: HttpRequestOptions = {},
): Promise<T> => {
  const {
    skipLoader = false,
    headers = {},
    timeout = 30000,
    baseURL,
    responseType = 'json',
    withCredentials = false,
  } = options;

  // Validate URL
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided');
  }

  const config: AxiosRequestConfig = {
    method,
    url,
    data: method !== 'GET' ? data : undefined,
    params: method === 'GET' ? data : undefined,
    headers,
    timeout,
    baseURL,
    responseType,
    withCredentials,
  };

  try {
    if (!skipLoader) {
    activeRequests.count++;
    setLoadingGlobal?.(true);
  }
    const response: AxiosResponse<T> = await axiosInstance(config);
    return response.data;
  } catch (error: any) {
    // Handle axios specific errors
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'Request failed';

      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }

      if (error.response?.status === 403) {
        throw new Error('Access forbidden');
      }

      if (error.response?.status >= 500) {
        throw new Error('Server error occurred');
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }

      throw new Error(message);
    }

    // Handle non-axios errors
    throw new Error(error.message || 'Network request failed');
  } finally {
    console.log('in to finally block')
    if (!skipLoader) {
      activeRequests.count--;
      if (activeRequests.count === 0) setLoadingGlobal?.(false);
    }
  }
};

// Convenience methods with better typing
export const http = {
  get: <T = any>(url: string, data?: any, options?: HttpRequestOptions) =>
    httpRequest<T>('GET', url, data, options),

  post: <T = any>(url: string, data?: any, options?: HttpRequestOptions) =>
    httpRequest<T>('POST', url, data, options),

  put: <T = any>(url: string, data?: any, options?: HttpRequestOptions) =>
    httpRequest<T>('PUT', url, data, options),

  patch: <T = any>(url: string, data?: any, options?: HttpRequestOptions) =>
    httpRequest<T>('PATCH', url, data, options),

  delete: <T = any>(url: string, data?: any, options?: HttpRequestOptions) =>
    httpRequest<T>('DELETE', url, data, options),
};

// Export axios instance for advanced usage
export { axiosInstance };

export default httpRequest;