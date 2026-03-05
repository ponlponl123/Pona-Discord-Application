import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { config as apiConfig } from '@/config/ytmusic-api';

export type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function buildUrl(path: string): string {
  const port = apiConfig.YTMUSIC_API_PORT
    ? `:${apiConfig.YTMUSIC_API_PORT}`
    : '';
  return `http://${apiConfig.YTMUSIC_API_HOST}${port}/${path}`;
}

export default async function request(
  method: RequestMethod,
  path: string,
  config?: AxiosRequestConfig,
  data?: unknown,
): Promise<AxiosResponse | null | false> {
  if (method !== 'POST' && method !== 'PATCH' && data) {
    throw new Error('Data payload only supported for POST and PATCH methods');
  }

  const url = buildUrl(path);

  switch (method) {
    case 'GET':
      return axios.get(url, config);
    case 'POST':
      return axios.post(url, data, config);
    case 'PATCH':
      return axios.patch(url, data, config);
    case 'DELETE':
      return axios.delete(url, config);
  }
}
