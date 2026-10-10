/** Named padding scale. Utilities: p-small, px-medium, py-big. */
export const padding = {
  small: '8px',
  medium: '16px',
  big: '24px',
} as const;

export type PaddingName = keyof typeof padding;
