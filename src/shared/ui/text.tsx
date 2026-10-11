import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { defaultFont } from '@/shared/theme/typography';

type TextProps = RNTextProps & {
  className?: string;
};

export function Text({ className, style, ...props }: TextProps) {
  return (
    <RNText
      {...props}
      className={className ? `${className} font-metamorphous` : 'font-metamorphous'}
      style={[{ fontFamily: defaultFont }, style]}
    />
  );
}
