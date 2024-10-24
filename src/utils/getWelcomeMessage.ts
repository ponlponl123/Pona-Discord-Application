const date = new Date();
const hours = date.getHours();

let message: string;

if ( hours > 6 && hours < 12 )
    message = `☀️ อรุณสวัสดิ์!`;
else if ( hours > 11 && hours < 18 )
    message = `🌤️ สวัสดีวันนี้อากาศดีนะ!`;
else if ( hours > 17 && hours < 21 )
    message = `🌙 สวัสดีตอนเย็น!`;
else
    message = `🛏️ ราตรีสวัสดิ์!`;

export const welcomeMessage = message;