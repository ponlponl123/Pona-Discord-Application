import { describe, it, expect } from 'bun:test';
import { getWelcomeMessage } from '@/utils/getWelcomeMessage';

describe('getWelcomeMessage', () => {
  it('returns a non-empty string', () => {
    const msg = getWelcomeMessage();
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('returns one of the four time-of-day messages', () => {
    const { lang } = require('@/utils/i18n');
    const validMessages = [
      lang.data.welcomeMessage.morning,
      lang.data.welcomeMessage.afternoon,
      lang.data.welcomeMessage.evening,
      lang.data.welcomeMessage.night,
    ];
    const msg = getWelcomeMessage();
    expect(validMessages).toContain(msg);
  });
});
