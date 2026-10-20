/** Previous palette, kept for comparison.
const previousColors = {
  white: '#FFEDD5',
  black: '#242424',
  red: '#B51818',
  green: '#27CE2F',
  yellow: '#FFFB79',
  gradient: 'linear-gradient(to top left, #535227, #242424, #535227)',
} as const;
*/

/** Ink, parchment, and antique gold. */
export const colors = {
  /** Parchment text. Unchanged from the previous palette. */
  white: '#FFEDD5',
  /** Screen background. */
  black: '#161311',
  /** Harm, delete, errors. */
  red: '#A33B32',
  /** Quiet positive. */
  green: '#7D9A78',
  /** Antique gold for labels, borders, and the active state. */
  yellow: '#D4B483',
  /** Brighter gold for the number currently in focus. */
  goldBright: '#F0D9A0',
  /** Secondary labels. */
  muted: '#A89880',
  /** Dice. */
  ember: '#FFC270',
  /** Card surface, one step above the background. */
  card: '#221C18',
  gradient: 'linear-gradient(to top left, #3A3228, #161311, #3A3228)',
} as const;

export type ColorName = keyof typeof colors;
