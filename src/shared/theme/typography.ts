/** Custom font families from assets/fonts. Utilities: font-cinzel, font-metamorphous. */
export const fonts = {
  cinzel: 'Cinzel',
  metamorphous: 'Metamorphous',
} as const;

export type FontName = keyof typeof fonts;

export const fontFamily = {
  cinzel: [fonts.cinzel],
  metamorphous: [fonts.metamorphous],
} as const;

let fontSources: Record<(typeof fonts)[FontName], number> | undefined;

export function getFontSources() {
  fontSources ??= {
    [fonts.cinzel]: require('@/assets/fonts/Cinzel-Regular.ttf'),
    [fonts.metamorphous]: require('@/assets/fonts/Metamorphous-Regular.ttf'),
  };

  return fontSources;
}
