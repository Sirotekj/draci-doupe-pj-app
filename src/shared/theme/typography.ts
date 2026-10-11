/** Custom font families from assets/fonts. Default utility: font-sans. */
export const fonts = {
  cinzel: 'Cinzel',
  metamorphous: 'Metamorphous',
} as const;

export type FontName = keyof typeof fonts;

export const defaultFont = fonts.metamorphous;

export const fontFamily = {
  sans: [defaultFont],
  cinzel: [fonts.cinzel],
  metamorphous: [defaultFont],
} as const;

let fontSources: Record<(typeof fonts)[FontName], number> | undefined;

export function getFontSources() {
  fontSources ??= {
    [fonts.cinzel]: require('../../../assets/fonts/Cinzel-Regular.ttf'),
    [fonts.metamorphous]: require('../../../assets/fonts/Metamorphous-Regular.ttf'),
  };

  return fontSources;
}
