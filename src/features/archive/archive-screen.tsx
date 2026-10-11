import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

export function ArchiveScreen() {
  return (
    <Screen>
      <View className="gap-4 p-small">
        <Text className="text-white">Archive</Text>
        <Button text="Zpět" onPress={() => router.replace('/')} />
      </View>
    </Screen>
  );
}
