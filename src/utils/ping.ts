import { XMLHttpRequest } from 'xmlhttprequest-ts';

export interface PingOptions {
  timeout?: number;
  method?: string;
  protocal?: 'http' | 'https' | string;
}

export default async function ping(host: string, port: number, callback?: (ping_ms: number) => void, options?: PingOptions): Promise<void | false> {
  const started = new Date().getTime();
  const http = new XMLHttpRequest();

  const timeout = options?.timeout || 30;
  const method = options?.method || 'GET';
  const protocal = options?.protocal || 'http';

  http.timeout = timeout * 1000;
  http.open(method, protocal + "://" + host + ":" + port, /*async*/true);
  http.onreadystatechange = function() {
    if (http.readyState == 4) {
      const ended = new Date().getTime();
      const milliseconds = ended - started;
      if ( callback ) callback(milliseconds);
    }
  }

  try {
    return http.send(null);
  } catch(exception) {
    return false;
  }

}