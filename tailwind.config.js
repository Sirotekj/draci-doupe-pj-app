const jiti = require('jiti')(__filename, { interopDefault: true });

const { colors } = jiti('./src/shared/theme/colors');
const { padding } = jiti('./src/shared/theme/padding');
const { fontFamily } = jiti('./src/shared/theme/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors: {
      ...colors,
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      padding,
      fontFamily,
    },
  },
  plugins: [],
};
