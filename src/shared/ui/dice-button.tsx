import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/shared/theme/colors';
import { Text } from '@/shared/ui/text';

const side = 48;
const radius = 4;
const borderWidth = 1;
const rollDuration = 700;
const faceTicks = 8;

type DiceSides = 6 | 10;

type DiceButtonProps = {
  sides: DiceSides;
  onRoll: (result: number) => void;
};

const borderBackground = (
  Platform.OS === 'web'
    ? { backgroundImage: colors.gradient }
    : { experimental_backgroundImage: colors.gradient }
) as ViewStyle;

function randomFace(sides: DiceSides) {
  return Math.floor(Math.random() * sides) + 1;
}

export function DiceButton({ sides, onRoll }: DiceButtonProps) {
  const [face, setFace] = useState<number | null>(null);
  const ticks = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mounted = useRef(true);
  const rolling = useSharedValue(false);
  const turn = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const angle = turn.value * 360;
    const scale = interpolate(turn.value % 1, [0, 0.5, 1], [1, 0.82, 1]);

    return {
      transform: [
        { perspective: 600 },
        { rotateX: `${angle}deg` },
        { rotateY: `${angle / 2}deg` },
        { scale },
      ],
    };
  });

  useEffect(() => {
    return () => {
      mounted.current = false;

      for (const tick of ticks.current) {
        clearTimeout(tick);
      }
    };
  }, []);

  function clearTicks() {
    for (const tick of ticks.current) {
      clearTimeout(tick);
    }

    ticks.current = [];
  }

  function finish(result: number) {
    clearTicks();
    rolling.value = false;

    if (!mounted.current) {
      return;
    }

    setFace(result);
    onRoll(result);
  }

  function roll() {
    if (rolling.value) {
      return;
    }

    const result = randomFace(sides);
    rolling.value = true;
    clearTicks();

    for (let step = 0; step < faceTicks; step += 1) {
      ticks.current.push(
        setTimeout(
          () => {
            setFace(randomFace(sides));
          },
          (rollDuration / faceTicks) * step,
        ),
      );
    }

    turn.value = withTiming(
      turn.value + 2,
      { duration: rollDuration, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) {
          runOnJS(finish)(result);
        }
      },
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={sides === 6 ? 'Kostka k6' : 'Kostka k10'}
      onPress={roll}
    >
      <Animated.View
        style={[
          {
            width: side,
            height: side,
            borderRadius: radius,
            padding: borderWidth,
            overflow: 'hidden',
          },
          animatedStyle,
        ]}
      >
        <View
          className="flex-1 items-center justify-center px-small bg-[#FFC270]/50 border-[#000000]"
          style={{ borderRadius: radius - borderWidth }}
        >
          <Text
            adjustsFontSizeToFit
            className="text-center text-3xl text-black"
            minimumFontScale={0.5}
            numberOfLines={1}
          >
            {face ?? sides}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
