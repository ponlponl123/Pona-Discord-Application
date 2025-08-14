import dotenv from 'dotenv';
dotenv.config();

import th_TH from '@/locates/th-TH.json'
import en_US from '@/locates/en-US.json'
import { pona } from '@/index'

var default_lang = process.env["LANG"] || 'en_US';

export type languageCode = 'th-TH' | 'en-US';

export default interface language {
    code: languageCode;
    label: string;
    data: typeof en_US;
}

export const langs: language[] = [
    { code: 'th-TH', label: 'ไทย', data: th_TH },
    { code: 'en-US', label: 'English', data: en_US },
]

export const lang = langs.filter(l => l.code === default_lang)[0];

export async function getGuildLanguage(guildId: string): Promise<language> {
    let code = default_lang;

    const guildSetting = await pona.loadGuildSettings(guildId);

    if ( guildSetting )
        code = guildSetting.language || default_lang;

    const getLang = langs.filter(l => l.code === code);

    if ( getLang.length > 0 )
        return getLang[0] as language;

    return lang;
}