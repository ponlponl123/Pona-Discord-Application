export async function fetchJsonWithTimeout<T = any>(
  url: string,
  timeoutMs = 3500,
  customHeaders: Record<string, string> = {},
): Promise<{ status: number; data: T } | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json',
        ...customHeaders,
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = (await res.json().catch(() => null)) as T;
    if (!data) return null;
    return { status: res.status, data };
  } catch {
    return null;
  }
}
