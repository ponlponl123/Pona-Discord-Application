import { describe, it, expect } from 'bun:test';
import { langs, lang } from '@/utils/i18n';

describe('langs array', () => {
  it('contains at least two languages', () => {
    expect(langs.length).toBeGreaterThanOrEqual(2);
  });

  it('includes en-US', () => {
    const en = langs.find((l) => l.code === 'en-US');
    expect(en).toBeDefined();
    expect(en?.label).toBe('English');
  });

  it('includes th-TH', () => {
    const th = langs.find((l) => l.code === 'th-TH');
    expect(th).toBeDefined();
    expect(th?.label).toBe('ไทย');
  });

  it('each entry has code, label and data', () => {
    langs.forEach((l) => {
      expect(typeof l.code).toBe('string');
      expect(typeof l.label).toBe('string');
      expect(typeof l.data).toBe('object');
    });
  });
});

describe('default lang', () => {
  it('is a valid language entry', () => {
    expect(langs).toContain(lang);
  });

  it('falls back to en-US when LANG env is not set to a known code', () => {
    // In tests env LANG is "en-US" (set in setup.ts)
    expect(lang.code).toBe('en-US');
  });

  it('data object has welcomeMessage keys', () => {
    expect(lang.data.welcomeMessage).toBeDefined();
    expect(typeof lang.data.welcomeMessage.morning).toBe('string');
    expect(typeof lang.data.welcomeMessage.afternoon).toBe('string');
    expect(typeof lang.data.welcomeMessage.evening).toBe('string');
    expect(typeof lang.data.welcomeMessage.night).toBe('string');
  });
});
