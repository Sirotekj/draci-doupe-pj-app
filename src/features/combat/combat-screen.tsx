import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { clearAccess } from '@/features/access/access-store';
import { ModeNotice } from '@/features/access/mode-notice';
import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { SquareButton } from '@/shared/ui/square-button';
import { Text } from '@/shared/ui/text';

export function CombatScreen() {
  const [values, setValues] = useState<number[]>([1, 2, 3, 4, 5]);

  return (
    <Screen>
      <View className="gap-4 p-small">
        <ModeNotice />
        <Text className="text-white">Combat</Text>
        <ScrollView
          horizontal
          contentContainerClassName="gap-2"
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
        >
          {values.map((value) => (
            <SquareButton key={value} onPress={() => undefined} value={value} />
          ))}
          <SquareButton
            onPress={() => {
              setValues((current) => [...current, current.length + 1]);
            }}
            value="+"
          />
        </ScrollView>
        <Button
          text="Zpět"
          onPress={() => {
            clearAccess();
            router.replace('/');
          }}
        />
      </View>
    </Screen>
  );
}
