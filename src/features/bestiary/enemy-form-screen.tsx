import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';

import {
  createEnemy,
  deleteEnemy,
  updateEnemy,
  useBestiary,
} from '@/features/bestiary/bestiary-store';
import { removeEnemyFromCombat } from '@/features/combat/combat-store';
import { colors } from '@/shared/theme/colors';
import { defaultFont } from '@/shared/theme/typography';
import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

function closeForm() {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.navigate('/archive');
}

export function EnemyFormScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = firstParam(params.id);
  const editing = id.length > 0;
  const bestiary = useBestiary();
  const enemy = editing ? (bestiary.enemies.find((item) => item.id === id) ?? null) : null;
  const [draft, setDraft] = useState<string | null>(null);
  const name = draft ?? enemy?.name ?? '';

  function save() {
    const saved = editing ? updateEnemy(id, name) : createEnemy(name) !== null;

    if (!saved) {
      return;
    }

    Keyboard.dismiss();
    closeForm();
  }

  function remove() {
    if (!deleteEnemy(id)) {
      return;
    }

    removeEnemyFromCombat(id);
    closeForm();
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: editing ? 'Upravit nepřítele' : 'Nový nepřítel' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 p-small"
          keyboardShouldPersistTaps="handled"
        >
          {editing && bestiary.ready && !enemy ? (
            <Text className="text-white">Tenhle nepřítel už v archivu není.</Text>
          ) : (
            <TextInput
              accessibilityLabel="Jméno nepřítele"
              autoFocus
              className="bg-black px-medium py-small text-white"
              onChangeText={setDraft}
              onSubmitEditing={save}
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
          )}
          {editing && bestiary.ready && !enemy ? null : (
            <Button text="Uložit" onPress={save} />
          )}
          <Button text="Zrušit" onPress={closeForm} />
          {editing && enemy ? <Button text="Vymazat" onPress={remove} /> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
