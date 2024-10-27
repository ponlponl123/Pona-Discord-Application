import { ColorResolvable } from "discord.js";

export const colorHEX = [
    '#FEE3EC',
    '#F9C5D5',
    '#F999B7',
    '#F2789F'
];

export type colorRGB =[
    'rgb(254, 227, 236)',
    'rgb(249, 197, 213)',
    'rgb(249, 153, 183)',
    'rgb(242, 120, 159)'
];

export type Color = 'light' | 'normal' | 'dark' | 'focus';

export default function color(type: Color): ColorResolvable {
    switch (type) {
        case 'light':
            return colorHEX[0] as ColorResolvable;
        case 'normal':
            return colorHEX[1] as ColorResolvable;
        case 'dark':
            return colorHEX[2] as ColorResolvable;
        case 'focus':
            return colorHEX[3] as ColorResolvable;
        default:
            return colorHEX[1] as ColorResolvable;
    }
}