import { Pressable, View } from 'react-native';

import { Text } from '@/shared/ui/text';

const side = 24;
const radius = 4;
const borderWidth = 1;
/** Lighter stop of colors.gradient. A real border is not painted behind the fill. */
const borderColor = '#3A3228';

type SignButtonProps = {
  sign: '+' | '-';
  onPress: () => void;
};

export function SignButton({ sign, onPress }: SignButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={sign}
      onPress={onPress}
      style={{
        width: side,
        height: side,
        borderRadius: radius,
        borderWidth,
        borderColor,
      }}
    >
      <View
        className="flex-1 items-center justify-center bg-black/60"
        style={{ borderRadius: radius - borderWidth }}
      >
        <Text
          className="text-center text-yellow mt-0.5"
          minimumFontScale={0.5}
          numberOfLines={1}
        >
          {sign}
        </Text>
      </View>
    </Pressable>
  );
}
