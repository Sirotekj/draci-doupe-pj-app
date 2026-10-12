import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { useAccess } from '@/features/access/access-store';
import { colors } from '@/shared/theme/colors';
import { defaultFont } from '@/shared/theme/typography';

export default function MainLayout() {
  const access = useAccess();

  if (!access) {
    return <Redirect href="/" />;
  }

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: colors.black },
        headerTintColor: colors.white,
        headerTitleStyle: {
          color: colors.white,
          fontFamily: defaultFont,
          fontWeight: 'normal',
        },
        drawerLabelStyle: { fontFamily: defaultFont, fontWeight: 'normal' },
        sceneStyle: { backgroundColor: colors.black },
        drawerStyle: { backgroundColor: colors.black },
        drawerActiveTintColor: colors.white,
        drawerInactiveTintColor: colors.white,
      }}
    >
      <Drawer.Screen name="combat" options={{ title: 'Combat' }} />
      <Drawer.Screen name="archive" options={{ title: 'Archive' }} />
    </Drawer>
  );
}
