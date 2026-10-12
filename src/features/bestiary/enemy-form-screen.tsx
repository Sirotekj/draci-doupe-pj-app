import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';

import {
  enemyFields,
  enemyToForm,
  formToDetails,
  isNumberDraft,
  type EnemyFormValues,
} from '@/features/bestiary/enemy-fields';
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

const numberKeyboard: KeyboardTypeOptions =
  Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric';

const inputStyle = {
  fontFamily: defaultFont,
  borderColor: colors.yellow,
  borderWidth: 1,
  borderRadius: 4,
};

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
  const [draft, setDraft] = useState<EnemyFormValues | null>(null);
  const values = draft ?? enemyToForm(enemy);
  const missing = editing && bestiary.ready && enemy === null;
  const showForm = !missing && (!editing || enemy !== null);

  function save() {
    const details = formToDetails(values);

    if (details === null) {
      return;
    }

    const saved = editing ? updateEnemy(id, details) : createEnemy(details) !== null;

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
          contentContainerClassName="gap-4 p-small pb-big"
          keyboardShouldPersistTaps="handled"
        >
          {missing ? <Text className="text-white">Tenhle nepřítel už v archivu není.</Text> : null}
          {showForm
            ? enemyFields.map((field) => {
                if (field.kind === 'boolean') {
                  return (
                    <View key={field.key} className="flex-row items-center justify-between gap-4">
                      <Text className="text-yellow">{field.label}</Text>
                      <Switch
                        accessibilityLabel={field.label}
                        onValueChange={(isPublic) => {
                          setDraft({ ...values, isPublic });
                        }}
                        thumbColor={colors.white}
                        trackColor={{ false: colors.black, true: colors.yellow }}
                        value={values.isPublic}
                      />
                    </View>
                  );
                }

                return (
                  <View key={field.key} className="gap-1">
                    <Text className="text-yellow">{field.label}</Text>
                    <TextInput
                      accessibilityLabel={field.label}
                      autoFocus={field.key === 'name'}
                      className="bg-black px-medium py-small text-white"
                      keyboardType={field.kind === 'number' ? numberKeyboard : 'default'}
                      multiline={field.kind === 'longText'}
                      onChangeText={(next) => {
                        if (field.kind === 'number' && !isNumberDraft(next)) {
                          return;
                        }

                        setDraft({ ...values, [field.key]: next });
                      }}
                      placeholderTextColor={colors.white}
                      style={
                        field.kind === 'longText'
                          ? { ...inputStyle, minHeight: 96, textAlignVertical: 'top' }
                          : inputStyle
                      }
                      value={values[field.key]}
                    />
                  </View>
                );
              })
            : null}
          {showForm ? <Button text="Uložit" onPress={save} /> : null}
          <Button text="Zrušit" onPress={closeForm} />
          {editing && enemy ? <Button text="Vymazat" onPress={remove} /> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
