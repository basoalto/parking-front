import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';

const BASE_URL = 'http://localhost:3000';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function request<T = any>(
  url: string,
  method: Method,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.request<T>({
    url,
    method,
    data,
    ...config,
  });
  return response.data;
}
