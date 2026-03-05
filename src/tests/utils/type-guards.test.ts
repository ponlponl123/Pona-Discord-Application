import { describe, it, expect } from 'bun:test';
import { isUser, isNotNull, hasFetchResult } from '@/utils/type-guards';

describe('isUser', () => {
  it('returns true for an object with an id property', () => {
    expect(isUser({ id: '123', username: 'test' })).toBe(true);
  });

  it('returns false for `false`', () => {
    expect(isUser(false)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isUser(null)).toBe(false);
  });

  it('returns false for a plain string', () => {
    expect(isUser('some string' as any)).toBe(false);
  });

  it('returns false for an object without an id property', () => {
    expect(isUser({ name: 'no-id' } as any)).toBe(false);
  });
});

describe('isNotNull', () => {
  it('returns true for non-null values', () => {
    expect(isNotNull('hello')).toBe(true);
    expect(isNotNull(0)).toBe(true);
    expect(isNotNull(false)).toBe(true);
    expect(isNotNull({})).toBe(true);
  });

  it('returns false for null', () => {
    expect(isNotNull(null)).toBe(false);
  });
});

describe('hasFetchResult', () => {
  it('returns true for object with a result property', () => {
    expect(hasFetchResult({ result: [] })).toBe(true);
    expect(hasFetchResult({ result: null })).toBe(true);
  });

  it('returns false for `false`', () => {
    expect(hasFetchResult(false)).toBe(false);
  });

  it('returns false for object without result', () => {
    expect(hasFetchResult({ data: 1 } as any)).toBe(false);
  });
});
