import { Platform, Pressable, View, type ViewStyle } from 'react-native';

import { colors } from '@/shared/theme/colors';
import { Text } from '@/shared/ui/text';

const side = 48;
const radius = 4;
const borderWidth = 1;

type SquareButtonProps = {
  value: '+' | number;
  name?: string;
  onPress: () => void;
  active?: boolean;
  done?: boolean;
};

function nameMark(name: string) {
  return name.trim().slice(0, 2);
}

const doneBackground = `${colors.yellow}40`;

const borderBackground = (
  Platform.OS === 'web'
    ? { backgroundImage: colors.gradient }
    : { experimental_backgroundImage: colors.gradient }
) as ViewStyle;

export function SquareButton({
  value,
  name = '',
  onPress,
  active = false,
  done = false,
}: SquareButtonProps) {
  const mark = value === '+' ? '+' : nameMark(name);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name ? `${value} ${name}` : String(value)}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        width: side,
        height: side,
        borderRadius: radius,
        padding: borderWidth,
        overflow: 'hidden',
        ...(active
          ? { backgroundColor: `${colors.yellow}40` }
          : borderBackground),
      }}
    >
      <View
        className="relative flex-1"
        style={{
          borderRadius: radius - borderWidth,
          backgroundColor: done ? doneBackground : colors.black,
        }}
      >
        {typeof value === 'number' ? (
          <Text className="absolute left-1 top-0.5 text-xs text-yellow">
            {value}
          </Text>
        ) : null}
        <View className="flex-1 items-center justify-center px-small">
          <Text
            adjustsFontSizeToFit
            className="text-center text-yellow"
            minimumFontScale={0.5}
            numberOfLines={1}
          >
            {mark}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
