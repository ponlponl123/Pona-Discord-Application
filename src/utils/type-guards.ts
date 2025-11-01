/**
 * Type guard to check if a value is a User object (not false)
 */
export function isUser<T>(user: T | false): user is T {
  return (
    user !== false && typeof user === 'object' && user !== null && 'id' in user
  );
}

/**
 * Type guard to check if a value is not null
 */
export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

/**
 * Type guard to check if a fetch result has result property (not false)
 */
export function hasFetchResult<T extends { result: any }>(
  value: T | false,
): value is T {
  return value !== false && 'result' in value;
}
