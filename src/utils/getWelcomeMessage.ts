const date = new Date();
const hours = date.getHours();

import { lang } from './i18n'

let message: string;

if ( hours > 6 && hours < 12 )
    message = lang.data.welcomeMessage.morning;
else if ( hours > 11 && hours < 18 )
    message = lang.data.welcomeMessage.afternoon;
else if ( hours > 17 && hours < 21 )
    message = lang.data.welcomeMessage.evening;
else
    message = lang.data.welcomeMessage.night;

export const welcomeMessage = message;