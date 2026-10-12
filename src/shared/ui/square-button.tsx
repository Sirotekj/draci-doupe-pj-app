import { Platform, Pressable, View, type ViewStyle } from 'react-native';

import { colors } from '@/shared/theme/colors';
import { Text } from '@/shared/ui/text';

const side = 48;
const radius = 4;
const borderWidth = 1;

type SquareButtonProps = {
  value: '+' | number;
  onPress: () => void;
};

const borderBackground = (
  Platform.OS === 'web'
    ? { backgroundImage: colors.gradient }
    : { experimental_backgroundImage: colors.gradient }
) as ViewStyle;

export function SquareButton({ value, onPress }: SquareButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={String(value)}
      onPress={onPress}
      style={{
        ...borderBackground,
        width: side,
        height: side,
        borderRadius: radius,
        padding: borderWidth,
        overflow: 'hidden',
      }}
    >
      <View
        className="flex-1 items-center justify-center bg-black px-small"
        style={{ borderRadius: radius - borderWidth }}
      >
        <Text
          adjustsFontSizeToFit
          className="text-center text-yellow"
          minimumFontScale={0.5}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </Pressable>
  );
}
