import { Platform, Pressable, View, type ViewStyle } from 'react-native';

import { colors } from '@/shared/theme/colors';
import { Text } from '@/shared/ui/text';

const radius = 4;
const borderWidth = 1;

type ButtonProps = {
  text: string;
  onPress: () => void;
};

const borderBackground = (
  Platform.OS === 'web'
    ? { backgroundImage: colors.gradient }
    : { experimental_backgroundImage: colors.gradient }
) as ViewStyle;

export function Button({ text, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        ...borderBackground,
        borderRadius: radius,
        padding: borderWidth,
        overflow: 'hidden',
      }}
    >
      <View
        className="items-center bg-black px-medium py-small"
        style={{ borderRadius: radius - borderWidth }}
      >
        <Text className="text-center text-yellow">{text}</Text>
      </View>
    </Pressable>
  );
}
