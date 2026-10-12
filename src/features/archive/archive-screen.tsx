import { router } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { clearAccess } from '@/features/access/access-store';
import { ModeNotice } from '@/features/access/mode-notice';
import { createEnemy, useBestiary } from '@/features/bestiary/bestiary-store';
import { addEnemyToCombat, useCombat } from '@/features/combat/combat-store';
import { colors } from '@/shared/theme/colors';
import { defaultFont } from '@/shared/theme/typography';
import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

export function ArchiveScreen() {
  const bestiary = useBestiary();
  const combat = useCombat();
  const ready = bestiary.ready && combat.ready;
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  function saveEnemy() {
    const enemy = createEnemy(name);

    if (!enemy) {
      return;
    }

    setName('');
    Keyboard.dismiss();
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 p-small"
          keyboardShouldPersistTaps="handled"
        >
          <ModeNotice />
          {ready ? (
            <>
              <Button
                text="Nový nepřítel"
                onPress={() => {
                  setCreating(true);
                }}
              />
              {creating ? (
                <View className="gap-4">
                  <TextInput
                    accessibilityLabel="Jméno nepřítele"
                    autoFocus
                    className="bg-black px-medium py-small text-white"
                    onChangeText={setName}
                    onSubmitEditing={saveEnemy}
                    placeholder="Jméno"
                    placeholderTextColor={colors.white}
                    returnKeyType="done"
                    style={{
                      fontFamily: defaultFont,
                      borderColor: colors.yellow,
                      borderWidth: 1,
                      borderRadius: 4,
                    }}
                    value={name}
                  />
                  <Button text="Uložit" onPress={saveEnemy} />
                </View>
              ) : null}
              {bestiary.enemies.length === 0 ? (
                <Text className="text-white">Zatím tu žádný nepřítel není.</Text>
              ) : (
                bestiary.enemies.map((enemy) => (
                  <View key={enemy.id} className="flex-row items-center gap-4">
                    <Text className="min-w-0 flex-1 text-white">{enemy.name}</Text>
                    <View>
                      <Button
                        text="Přidat"
                        onPress={() => {
                          addEnemyToCombat(enemy.id);
                          router.navigate('/combat');
                        }}
                      />
                    </View>
                  </View>
                ))
              )}
            </>
          ) : null}
          <Button
            text="Zpět"
            onPress={() => {
              clearAccess();
              router.replace('/');
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
