import { lang } from './i18n'
import { prefix as consolePrefix } from '@/config/console';

export const getWelcomeMessage = (): string => {
    const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));;
    const hours = date.getHours();

    let message: string;

    if ( hours > 4 && hours < 12 )
        message = lang.data.welcomeMessage.morning;
    else if ( hours > 11 && hours < 18 )
        message = lang.data.welcomeMessage.afternoon;
    else if ( hours > 17 && hours < 21 )
        message = lang.data.welcomeMessage.evening;
    else
        message = lang.data.welcomeMessage.night;
    
    // console.log(consolePrefix.system + `[Welcome Message] Current Time: ${date.toLocaleString()} - Message: ${message}`);
    return message
};

export const welcomeMessage = getWelcomeMessage();