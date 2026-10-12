import { Platform, Pressable, View, type ViewStyle } from 'react-native';

import { colors } from '@/shared/theme/colors';
import { Text } from '@/shared/ui/text';

const side = 24;
const radius = 4;
const borderWidth = 1;

type SignButtonProps = {
  sign: '+' | '-';
  onPress: () => void;
};

const borderBackground = (
  Platform.OS === 'web'
    ? { backgroundImage: colors.gradient }
    : { experimental_backgroundImage: colors.gradient }
) as ViewStyle;

export function SignButton({ sign, onPress }: SignButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={sign}
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
        className="flex-1 items-center justify-center bg-black"
        style={{ borderRadius: radius - borderWidth }}
      >
        <Text
          adjustsFontSizeToFit
          className="text-center text-yellow"
          minimumFontScale={0.5}
          numberOfLines={1}
        >
          {sign}
        </Text>
      </View>
    </Pressable>
  );
}
