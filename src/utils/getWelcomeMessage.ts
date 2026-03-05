import { lang } from './i18n';

export const getWelcomeMessage = (): string => {
  const hours = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }),
  ).getHours();

  if (hours > 4 && hours < 12) return lang.data.welcomeMessage.morning;
  if (hours < 18) return lang.data.welcomeMessage.afternoon;
  if (hours < 21) return lang.data.welcomeMessage.evening;
  return lang.data.welcomeMessage.night;
};

export const welcomeMessage = getWelcomeMessage();
