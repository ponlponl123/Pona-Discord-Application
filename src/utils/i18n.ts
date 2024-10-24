import th_TH from '@/../locates/th-TH.json'
import en_US from '@/../locates/en-US.json'

import dotenv from 'dotenv'
dotenv.config();

var default_lang = process.env.LANG || 'en_US';

export default interface language {
    code: string;
    label: string;
    data: object;
}

export const langs = [
    { code: 'th-TH', label: 'ไทย', data: th_TH },
    { code: 'en-US', label: 'English', data: en_US },
]

export const lang = langs.filter(l => l.code === default_lang)[0];