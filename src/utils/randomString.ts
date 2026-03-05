const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export default function randomString(length: number): string {
  return Array.from(
    { length },
    () => CHARS[Math.floor(Math.random() * CHARS.length)],
  ).join('');
}
