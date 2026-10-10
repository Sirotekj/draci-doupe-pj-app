/** Placeholder palette. Replace these values with the final colors. */
export const colors = {
  white: '#FFEDD5',
  black: '#242424',
  red: '#B51818',
  green: '#27CE2F',
  yellow: '#FFFB79',
  gradient: 'linear-gradient(to top left, #535227 ,#242424, #535227)',
} as const;

export type ColorName = keyof typeof colors;
