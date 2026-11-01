import { usePathname } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

const mountains = require('@/assets/images/mountains.webp');

/** Introduction. colors.black at 60%, so more of the photo stays visible. */
const introductionOverlay = `${colors.black}DD`;

/** Everywhere past the introduction. colors.black at 80%. */
const appOverlay = `${colors.black}DD`;

export function AppBackground() {
  const pathname = usePathname();
  const overlay = pathname === '/' ? introductionOverlay : appOverlay;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image
        accessible={false}
        resizeMode="cover"
        source={mountains}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: overlay }]} />
    </View>
  );
}
