import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

import th_TH from '@/../locates/th-TH.json'
import en_US from '@/../locates/en-US.json'
import path from 'path';

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

export function getGuildLanguage(guildId: string): language {
    let code = default_lang;

    const rootPath = path.join(__dirname, '..', '..', 'ponaState');
    const guildSettingsPath = path.join(rootPath, 'guildSettings');
    const targetGuildSettingPath = path.join(guildSettingsPath, `${guildId}.json`);
    if ( !fs.existsSync(rootPath) )
        fs.mkdirSync(rootPath);
    if ( !fs.existsSync(guildSettingsPath) )
        fs.mkdirSync(guildSettingsPath);

    if ( fs.existsSync(targetGuildSettingPath) )
    {
        const guildSettings = JSON.parse(fs.readFileSync(targetGuildSettingPath, 'utf8'));
        code = guildSettings.language || default_lang;
    }

    const getLang = langs.filter(l => l.code === code);

    if ( getLang.length > 0 )
        return getLang[0] as language;

    return lang;
}