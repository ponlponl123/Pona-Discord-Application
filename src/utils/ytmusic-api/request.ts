import { config as apiConfig } from '@/config/ytmusic-api';
import { getOrCreateUserVisitorCookie } from '@/utils/userSession';

export type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface CustomResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

function buildUrl(path: string): string {
  const port = apiConfig.YTMUSIC_API_PORT
    ? `:${apiConfig.YTMUSIC_API_PORT}`
    : '';
  return `http://${apiConfig.YTMUSIC_API_HOST}${port}/${path}`;
}

export default async function request(
  method: RequestMethod,
  path: string,
  config?: { headers?: Record<string, string>; [key: string]: any },
  data?: unknown,
  userId?: string,
): Promise<CustomResponse | null> {
  if (method !== 'POST' && method !== 'PATCH' && data) {
    throw new Error('Data payload only supported for POST and PATCH methods');
  }

  const url = buildUrl(path);
  const headers: Record<string, string> = { ...config?.headers };

  if (userId && !headers['x-ytmusic-cookie']) {
    const userCookie = await getOrCreateUserVisitorCookie(userId);
    headers['x-ytmusic-cookie'] = userCookie;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(data ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const res = await fetch(url, fetchOptions);
    let body: any = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      body = await res.json();
    } else {
      body = await res.text();
    }

    if (!res.ok) {
      return null;
    }

    return {
      data: body,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    };
  } catch {
    return null;
  }
}
