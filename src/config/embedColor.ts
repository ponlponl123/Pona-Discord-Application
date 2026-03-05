import type { ColorResolvable } from 'discord.js';

export type Color = 'light' | 'normal' | 'dark' | 'focus';

const COLOR_MAP: Record<Color, string> = {
  light: '#FEE3EC',
  normal: '#F9C5D5',
  dark: '#F999B7',
  focus: '#F2789F',
};

export const colorHEX = Object.values(COLOR_MAP);

export type colorRGB = [
  'rgb(254, 227, 236)',
  'rgb(249, 197, 213)',
  'rgb(249, 153, 183)',
  'rgb(242, 120, 159)',
];

export default function color(type: Color): ColorResolvable {
  return (COLOR_MAP[type] ?? COLOR_MAP.normal) as ColorResolvable;
}
