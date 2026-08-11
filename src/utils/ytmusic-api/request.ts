import { config as apiConfig } from '@/config/ytmusic-api';
import { getUserSession, type UserSessionRecord } from '@/utils/userSession';
import { lang as defaultLang } from '@/utils/i18n';

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

export interface RequestMetadataConfig {
  headers?: Record<string, string>;
  userId?: string;
  userIp?: string;
  userCountry?: string;
  userTimezone?: string;
  userLang?: string;
  acceptLanguage?: string;
  userAgent?: string;
  secChUa?: string;
  secChUaMobile?: string;
  secChUaPlatform?: string;
  [key: string]: any;
}

export default async function request(
  method: RequestMethod,
  path: string,
  config?: RequestMetadataConfig,
  data?: unknown,
  userId?: string,
): Promise<CustomResponse | null> {
  if (method !== 'POST' && method !== 'PATCH' && data) {
    throw new Error('Data payload only supported for POST and PATCH methods');
  }

  const url = buildUrl(path);
  const headers: Record<string, string> = { ...config?.headers };

  // 1. Resolve stored User Session & Metadata from Database
  const targetUserId = userId || config?.userId;
  let storedSession: UserSessionRecord | null = null;

  if (targetUserId) {
    storedSession = await getUserSession(targetUserId);
  }

  // 2. Cookie / Visitor Identifier Injection
  if (!headers['x-ytmusic-cookie'] && storedSession) {
    headers['x-ytmusic-cookie'] = storedSession.ytmusic_cookie || storedSession.ytmusic_visitor_id;
  }

  // 3. User Agent & Client Hints Injection
  if (!headers['x-user-agent'] && !headers['user-agent']) {
    const candidateUA = config?.userAgent || storedSession?.user_agent || 'Pona-Discord-Bot/1.0 (DiscordJS)';
    headers['x-user-agent'] = candidateUA;
  }

  if (!headers['sec-ch-ua']) {
    const candidateSecUA = config?.secChUa || storedSession?.sec_ch_ua;
    if (candidateSecUA) headers['sec-ch-ua'] = candidateSecUA;
  }
  if (config?.secChUaMobile && !headers['sec-ch-ua-mobile']) {
    headers['sec-ch-ua-mobile'] = config.secChUaMobile;
  }
  if (config?.secChUaPlatform && !headers['sec-ch-ua-platform']) {
    headers['sec-ch-ua-platform'] = config.secChUaPlatform;
  }

  // 4. User Language & Locale Injection
  if (!headers['x-user-lang'] && !headers['accept-language']) {
    const candidateLang = config?.userLang || config?.acceptLanguage || storedSession?.language || defaultLang?.code || 'en-US';
    headers['x-user-lang'] = candidateLang;
  }

  // 5. Client Network IP Origin
  if (!headers['x-forwarded-for']) {
    const candidateIp = config?.userIp || storedSession?.ip_address;
    if (candidateIp) headers['x-forwarded-for'] = candidateIp;
  }

  // 6. User Country & Region
  if (!headers['x-user-country']) {
    const candidateCountry = config?.userCountry || storedSession?.country;
    if (candidateCountry) headers['x-user-country'] = candidateCountry;
  }

  // 7. User Timezone
  if (!headers['x-user-timezone']) {
    const candidateTimezone = config?.userTimezone || storedSession?.timezone;
    if (candidateTimezone) headers['x-user-timezone'] = candidateTimezone;
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
