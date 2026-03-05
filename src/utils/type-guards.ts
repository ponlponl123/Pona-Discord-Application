export function isUser<T>(user: T | false): user is T {
  return (
    user !== false && typeof user === 'object' && user !== null && 'id' in user
  );
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function hasFetchResult<T extends { result: unknown }>(
  value: T | false,
): value is T {
  return value !== false && 'result' in value;
}
