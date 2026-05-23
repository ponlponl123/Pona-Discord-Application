import th_TH from '@/locates/th-TH.json';
import en_US from '@/locates/en-US.json';
import { container } from '@/core/container';

const defaultLangCode = process.env['LANG'] || 'en-US';

export type languageCode = 'th-TH' | 'en-US';

export default interface language {
  code: languageCode;
  label: string;
  data: typeof en_US;
}

export const langs: language[] = [
  { code: 'th-TH', label: 'ไทย', data: th_TH },
  { code: 'en-US', label: 'English', data: en_US },
];

export const lang = langs.find((l) => l.code === defaultLangCode) ?? langs[1];

export async function getGuildLanguage(guildId: string): Promise<language> {
  const { pona } = container;
  if (!pona) return lang;

  const guildSetting = await pona.loadGuildSettings(guildId);
  const code = guildSetting?.language ?? defaultLangCode;

  return (langs.find((l) => l.code === code) as language) ?? lang;
}
