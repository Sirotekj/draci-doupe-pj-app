import { Pressable, View } from 'react-native';

import { Text } from '@/shared/ui/text';

const radius = 4;
const borderWidth = 1;
/** Lighter stop of colors.gradient. A real border is not painted behind the fill. */
const borderColor = '#3A3228';

type ButtonProps = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
};

export function Button({ text, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        borderRadius: radius,
        borderWidth,
        borderColor,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View
        className="items-center bg-black/70 px-medium py-small"
        style={{ borderRadius: radius - borderWidth }}
      >
        <Text className="text-center text-yellow">{text}</Text>
      </View>
    </Pressable>
  );
}
