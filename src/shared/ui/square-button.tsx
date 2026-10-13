import { Platform, Pressable, View, type ViewStyle } from 'react-native';

import { colors } from '@/shared/theme/colors';
import { Text } from '@/shared/ui/text';

const side = 48;
const radius = 4;
const borderWidth = 1;

type SquareButtonProps = {
  value: '+' | number;
  onPress: () => void;
  active?: boolean;
  done?: boolean;
};

const doneBackground = `${colors.yellow}40`;

const borderBackground = (
  Platform.OS === 'web'
    ? { backgroundImage: colors.gradient }
    : { experimental_backgroundImage: colors.gradient }
) as ViewStyle;

export function SquareButton({
  value,
  onPress,
  active = false,
  done = false,
}: SquareButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={String(value)}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        width: side,
        height: side,
        borderRadius: radius,
        padding: borderWidth,
        overflow: 'hidden',
        ...(active ? { backgroundColor: colors.yellow } : borderBackground),
      }}
    >
      <View
        className="flex-1 items-center justify-center px-small"
        style={{
          borderRadius: radius - borderWidth,
          backgroundColor: done ? doneBackground : colors.black,
        }}
      >
        <Text
          adjustsFontSizeToFit
          className="text-center text-yellow mt-1.5"
          minimumFontScale={0.5}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </Pressable>
  );
}
