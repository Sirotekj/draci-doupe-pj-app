import '../../global.css';

import { Asset } from 'expo-asset';
import { isLoaded, useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { requireNativeModule } from 'expo-modules-core';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { colors } from '@/shared/theme/colors';
import { fonts, getFontSources } from '@/shared/theme/typography';

const fontSources = getFontSources();

SplashScreen.preventAutoHideAsync();

async function loadFontsNatively() {
  const loader = requireNativeModule('ExpoFontLoader');

  await Promise.all(
    Object.entries(fontSources).map(async ([name, moduleId]) => {
      if (isLoaded(name)) {
        return;
      }

      const asset = Asset.fromModule(moduleId);
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error(`Font file for ${name} did not download.`);
      }

      await loader.loadAsync(name, asset.localUri);
    }),
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontSources);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    if (fontError) {
      console.error(fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (!fontsLoaded && !fontError) {
      return;
    }

    if (Platform.OS === 'web' || isLoaded(fonts.metamorphous)) {
      setFontsReady(true);
      return;
    }

    let mounted = true;

    loadFontsNatively()
      .catch((error: unknown) => {
        console.error(error);
      })
      .finally(() => {
        if (mounted) {
          setFontsReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontsReady || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady, fontError]);

  if (!fontsReady && !fontError) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.black },
        statusBarStyle: 'light',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}
