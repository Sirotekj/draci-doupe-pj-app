import { Pressable, View } from 'react-native';

import { colors } from '@/shared/theme/colors';
import { Text } from '@/shared/ui/text';

const side = 48;
const radius = 4;
const borderWidth = 1;
/** Lighter stop of colors.gradient. A real border is not painted behind the fill. */
const borderColor = '#3A3228';

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

/** Idle fill. colors.black at 80%. */
const idleBackground = `${colors.black}AA`;
/** Played slot. colors.yellow at 25%, so the photo stays visible. */
const doneBackground = `${colors.yellow}30`;
/** Selected slot. colors.yellow at 45%. */
const activeBackground = `${colors.yellow}40`;
/** Selected and played. colors.yellow at 60%. */
const activeDoneBackground = `${colors.yellow}60`;

function fillColor(active: boolean, done: boolean) {
  if (active && done) {
    return activeDoneBackground;
  }

  if (active) {
    return activeBackground;
  }

  if (done) {
    return doneBackground;
  }

  return idleBackground;
}

export function SquareButton({
  value,
  name = '',
  onPress,
  active = false,
  done = false,
}: SquareButtonProps) {
  const mark = value === '+' ? '+' : nameMark(name);
  const backgroundColor = fillColor(active, done);

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
        borderWidth,
        borderColor: active ? colors.yellow : borderColor,
      }}
    >
      <View
        className="relative flex-1"
        style={{
          borderRadius: radius - borderWidth,
          backgroundColor,
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
