import { Drawer } from 'expo-router/drawer';

import { colors } from '@/shared/theme/colors';
import { defaultFont } from '@/shared/theme/typography';

export default function DrawerLayout() {
  return (
    <Drawer
      initialRouteName="combat"
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
      <Drawer.Screen name="combat" options={{ title: 'Boj' }} />
      <Drawer.Screen name="archive" options={{ title: 'Archiv' }} />
    </Drawer>
  );
}
