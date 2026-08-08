import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { config as apiConfig } from '@/config/ytmusic-api';
import { getOrCreateUserVisitorCookie } from '@/utils/userSession';

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
  userId?: string,
): Promise<AxiosResponse | null | false> {
  if (method !== 'POST' && method !== 'PATCH' && data) {
    throw new Error('Data payload only supported for POST and PATCH methods');
  }

  const url = buildUrl(path);
  const headers: Record<string, any> = { ...config?.headers };

  // If userId is provided and no custom cookie header is explicitly set, attach unique user session cookie
  if (userId && !headers['x-ytmusic-cookie']) {
    const userCookie = await getOrCreateUserVisitorCookie(userId);
    headers['x-ytmusic-cookie'] = userCookie;
  }

  const requestConfig: AxiosRequestConfig = { ...config, headers };

  switch (method) {
    case 'GET':
      return axios.get(url, requestConfig);
    case 'POST':
      return axios.post(url, data, requestConfig);
    case 'PATCH':
      return axios.patch(url, data, requestConfig);
    case 'DELETE':
      return axios.delete(url, requestConfig);
  }
}
