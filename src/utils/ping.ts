import { XMLHttpRequest } from 'xmlhttprequest-ts';

export interface PingOptions {
  timeout?: number;
  method?: string;
  protocol?: 'http' | 'https' | string;
}

export default async function ping(
  host: string,
  port: number,
  callback?: (pingMs: number) => void,
  options?: PingOptions,
): Promise<void | false> {
  const started = Date.now();
  const http = new XMLHttpRequest();
  const timeout = options?.timeout ?? 30;
  const method = options?.method ?? 'GET';
  const protocol = options?.protocol ?? 'http';

  http.timeout = timeout * 1000;
  http.open(method, `${protocol}://${host}:${port}`, true);
  http.onreadystatechange = function () {
    if (http.readyState === 4) {
      callback?.(Date.now() - started);
    }
  };

  try {
    return http.send(null);
  } catch {
    return false;
  }
}
