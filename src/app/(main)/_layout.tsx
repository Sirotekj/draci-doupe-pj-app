import { Drawer } from 'expo-router/drawer';

import { colors } from '@/shared/theme/colors';

export default function MainLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: colors.black },
        headerTintColor: colors.white,
        headerTitleStyle: { color: colors.white },
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
