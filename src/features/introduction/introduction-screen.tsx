import { router } from 'expo-router';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function IntroductionScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Introduction</Text>
      <Button title="Dál" onPress={() => router.replace('/combat')} />
    </SafeAreaView>
  );
}
