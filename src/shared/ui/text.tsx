import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { defaultFont } from '@/shared/theme/typography';

type TextProps = RNTextProps & {
  className?: string;
};

const fontUtilities = new Set(['font-cinzel', 'font-metamorphous', 'font-sans']);

function hasFontUtility(className: string | undefined) {
  return className?.split(/\s+/).some((name) => fontUtilities.has(name)) ?? false;
}

export function Text({ className, style, ...props }: TextProps) {
  const explicitFont = hasFontUtility(className);

  return (
    <RNText
      {...props}
      className={
        explicitFont
          ? className
          : className
            ? `${className} font-metamorphous`
            : 'font-metamorphous'
      }
      style={explicitFont ? style : [{ fontFamily: defaultFont }, style]}
    />
  );
}
