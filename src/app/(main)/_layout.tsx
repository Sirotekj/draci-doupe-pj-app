import { Redirect, Stack } from 'expo-router';

import { useAccess } from '@/features/access/access-store';
import { colors } from '@/shared/theme/colors';
import { defaultFont } from '@/shared/theme/typography';

export const unstable_settings = {
  anchor: '(drawer)',
};

export default function MainLayout() {
  const access = useAccess();

  if (!access) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.black },
        headerTintColor: colors.white,
        headerTitleStyle: {
          color: colors.white,
          fontFamily: defaultFont,
          fontWeight: 'normal',
        },
        contentStyle: { backgroundColor: colors.black },
      }}
    >
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen
        name="enemy"
        options={{
          presentation: 'modal',
          title: 'Nepřítel',
        }}
      />
    </Stack>
  );
}
