import th_TH from '@/locates/th-TH.json';
import en_US from '@/locates/en-US.json';

var default_lang = process.env['LANG'] || 'en-US';

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

export const lang = langs.find((l) => l.code === default_lang) || langs[1]; // Fallback to English

export async function getGuildLanguage(guildId: string): Promise<language> {
  // Import pona here to avoid circular dependency
  const { pona } = await import('../index.js');

  let code = default_lang;
  const guildSetting = await pona.loadGuildSettings(guildId);

  if (guildSetting) code = guildSetting.language || default_lang;

  const getLang = langs.filter((l) => l.code === code);

  if (getLang.length > 0) return getLang[0] as language;

  return lang;
}
