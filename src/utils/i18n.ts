import th_TH from '@/../locates/th_TH.json'
import en_US from '@/../locates/en_US.json'

import dotenv from 'dotenv'
dotenv.config();

var local_lang = process.env.LANG || 'en_US';

export const lang = th_TH;