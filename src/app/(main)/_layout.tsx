import { Drawer } from 'expo-router/drawer';

export default function MainLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="combat" options={{ title: 'Combat' }} />
      <Drawer.Screen name="archive" options={{ title: 'Archive' }} />
    </Drawer>
  );
}
