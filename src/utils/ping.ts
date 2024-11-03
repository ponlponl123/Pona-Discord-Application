import { XMLHttpRequest } from 'xmlhttprequest-ts';

export default async function ping(host: string, port: number, callback: (ping_ms: number) => void): Promise<void | false> {
  const started = new Date().getTime();
  const http = new XMLHttpRequest();

  http.open("GET", "http://" + host + ":" + port, /*async*/true);
  http.onreadystatechange = function() {
    if (http.readyState == 4) {
      const ended = new Date().getTime();
      const milliseconds = ended - started;
      callback(milliseconds)
    }
  }

  try {
    return http.send(null);
  } catch(exception) {
    return false;
  }

}