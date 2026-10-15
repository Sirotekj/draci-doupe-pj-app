import * as ImagePicker from 'expo-image-picker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';

import {
  createEnemy,
  deleteEnemy,
  updateEnemy,
  useBestiary,
} from '@/features/bestiary/bestiary-store';
import {
  deleteEnemyImage,
  storeEnemyImage,
} from '@/features/bestiary/enemy-image';
import {
  enemyToForm,
  formToDetails,
  isNumberDraft,
  type EnemyFormValues,
} from '@/features/bestiary/enemy-fields';
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

const sectionClassName = 'gap-4 border-b border-yellow/25 pb-medium';

type TextKey = Exclude<keyof EnemyFormValues, 'isPublic'>;
type FieldKind = 'text' | 'longText' | 'number';

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

function FormField({
  label,
  value,
  kind,
  autoFocus = false,
  onChangeText,
  vertical,
}: {
  label: string;
  value: string;
  kind: FieldKind;
  autoFocus?: boolean;
  onChangeText: (next: string) => void;
  vertical?: boolean;
}) {
  return (
    <View
      className={`w-full ${vertical ? '' : 'flex-1 flex-row items-center'} gap-2 `}
    >
      <Text className="text-yellow">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoFocus={autoFocus}
        className={`${!vertical && 'flex-1'} bg-black px-medium py-small text-white`}
        keyboardType={kind === 'number' ? numberKeyboard : 'default'}
        multiline={kind === 'longText'}
        onChangeText={onChangeText}
        placeholderTextColor={colors.white}
        style={
          kind === 'longText'
            ? { ...inputStyle, minHeight: 96, textAlignVertical: 'top' }
            : inputStyle
        }
        value={value}
      />
    </View>
  );
}

export function EnemyFormScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = firstParam(params.id);
  const editing = id.length > 0;
  const bestiary = useBestiary();
  const enemy = editing
    ? (bestiary.enemies.find((item) => item.id === id) ?? null)
    : null;
  const [draft, setDraft] = useState<EnemyFormValues | null>(null);
  const [imageDraft, setImageDraft] = useState<string | null | undefined>(
    undefined,
  );
  const saving = useRef(false);
  const values = draft ?? enemyToForm(enemy);
  const image = imageDraft === undefined ? (enemy?.image ?? null) : imageDraft;
  const missing = editing && bestiary.ready && enemy === null;
  const showForm = !missing && (!editing || enemy !== null);

  function changeText(key: TextKey, next: string, kind: FieldKind) {
    if (kind === 'number' && !isNumberDraft(next)) {
      return;
    }

    setDraft({ ...values, [key]: next });
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (result.canceled) {
      return;
    }

    setImageDraft(result.assets[0]?.uri ?? null);
  }

  async function save() {
    if (saving.current) {
      return;
    }

    const details = formToDetails(values, null);

    if (details === null) {
      return;
    }

    saving.current = true;
    let createdId: string | null = null;
    let stored = image;

    try {
      const savedId = editing ? id : createEnemy(details)?.id;

      if (!savedId) {
        return;
      }

      if (!editing) {
        createdId = savedId;
      }

      const previous = enemy?.image ?? null;

      if (image && image !== previous) {
        stored = await storeEnemyImage(savedId, image);
      }

      const saved = updateEnemy(savedId, { ...details, image: stored });

      if (!saved) {
        if (createdId) {
          deleteEnemy(createdId);
        }

        if (stored && stored !== previous) {
          deleteEnemyImage(stored);
        }

        return;
      }

      if (previous && previous !== stored) {
        deleteEnemyImage(previous);
      }

      Keyboard.dismiss();
      closeForm();
    } catch (error: unknown) {
      console.error(error);

      if (createdId) {
        deleteEnemy(createdId);
      }

      if (stored && stored !== image && stored !== (enemy?.image ?? null)) {
        deleteEnemyImage(stored);
      }
    } finally {
      saving.current = false;
    }
  }

  function remove() {
    if (!deleteEnemy(id)) {
      return;
    }

    deleteEnemyImage(enemy?.image ?? null);
    removeEnemyFromCombat(id);
    closeForm();
  }

  return (
    <Screen>
      <Stack.Screen
        options={{ title: editing ? 'Upravit nepřítele' : 'Nový nepřítel' }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 px-small pb-big"
          keyboardShouldPersistTaps="handled"
        >
          {missing ? (
            <Text className="text-white">
              Tenhle nepřítel už v archivu není.
            </Text>
          ) : null}
          {showForm ? (
            <>
              <View className={sectionClassName}>
                <FormField
                  autoFocus
                  kind="text"
                  label="Jméno"
                  onChangeText={(next) => {
                    changeText('name', next, 'text');
                  }}
                  value={values.name}
                />
                <View className="flex-row gap-2">
                  <Pressable
                    accessibilityLabel="Vybrat obrázek"
                    accessibilityRole="button"
                    className="aspect-[3/4] w-2/5 items-center justify-center overflow-hidden border border-yellow"
                    id="image"
                    onPress={() => {
                      void pickImage();
                    }}
                  >
                    {image ? (
                      <Image
                        accessibilityIgnoresInvertColors
                        resizeMode="cover"
                        source={{ uri: image }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0,
                        }}
                      />
                    ) : (
                      <Text className="px-small text-center text-yellow">
                        Obrázek
                      </Text>
                    )}
                  </Pressable>
                  <View className="flex-1 justify-between gap-2">
                    <FormField
                      kind="number"
                      label="Útok"
                      onChangeText={(next) => {
                        changeText('attackValue', next, 'number');
                      }}
                      value={values.attackValue}
                    />
                    <FormField
                      kind="number"
                      label="Zranění"
                      onChangeText={(next) => {
                        changeText('damageValue', next, 'number');
                      }}
                      value={values.damageValue}
                    />
                    <FormField
                      kind="number"
                      label="Obrana"
                      onChangeText={(next) => {
                        changeText('defenseValue', next, 'number');
                      }}
                      value={values.defenseValue}
                    />
                    <FormField
                      kind="number"
                      label="ZO"
                      onChangeText={(next) => {
                        changeText('baseDefense', next, 'number');
                      }}
                      value={values.baseDefense}
                    />
                  </View>
                </View>

                <FormField
                  kind="number"
                  label="Životy"
                  onChangeText={(next) => {
                    changeText('health', next, 'number');
                  }}
                  value={values.health}
                />
                <FormField
                  kind="number"
                  label="Mana/Přízeň"
                  onChangeText={(next) => {
                    changeText('mana', next, 'number');
                  }}
                  value={values.mana}
                />
              </View>
              <View className={sectionClassName}>
                <FormField
                  kind="number"
                  label="Pohyblivost"
                  onChangeText={(next) => {
                    changeText('movement', next, 'number');
                  }}
                  value={values.movement}
                />
                <FormField
                  kind="text"
                  label="Velikost"
                  onChangeText={(next) => {
                    changeText('size', next, 'text');
                  }}
                  value={values.size}
                />
                <FormField
                  kind="number"
                  label="Síla"
                  onChangeText={(next) => {
                    changeText('strength', next, 'number');
                  }}
                  value={values.strength}
                />
                <FormField
                  kind="number"
                  label="Obratnost"
                  onChangeText={(next) => {
                    changeText('dexterity', next, 'number');
                  }}
                  value={values.dexterity}
                />
                <FormField
                  kind="number"
                  label="Odolnost"
                  onChangeText={(next) => {
                    changeText('constitution', next, 'number');
                  }}
                  value={values.constitution}
                />
                <FormField
                  kind="number"
                  label="Inteligence"
                  onChangeText={(next) => {
                    changeText('intelligence', next, 'number');
                  }}
                  value={values.intelligence}
                />
                <FormField
                  kind="number"
                  label="Charisma"
                  onChangeText={(next) => {
                    changeText('charisma', next, 'number');
                  }}
                  value={values.charisma}
                />
              </View>
              <View className={sectionClassName}>
                <FormField
                  kind="number"
                  label="Úroveň"
                  onChangeText={(next) => {
                    changeText('level', next, 'number');
                  }}
                  value={values.level}
                />
                <FormField
                  kind="number"
                  label="Vyšší moc"
                  onChangeText={(next) => {
                    changeText('divinePower', next, 'number');
                  }}
                  value={values.divinePower}
                />
                <FormField
                  kind="text"
                  label="Výzva"
                  onChangeText={(next) => {
                    changeText('challengeRating', next, 'text');
                  }}
                  value={values.challengeRating}
                />
                <FormField
                  kind="text"
                  label="Typ"
                  onChangeText={(next) => {
                    changeText('type', next, 'text');
                  }}
                  value={values.type}
                />
                <FormField
                  kind="number"
                  label="Zkušenosti"
                  onChangeText={(next) => {
                    changeText('experiencePoints', next, 'number');
                  }}
                  value={values.experiencePoints}
                />
              </View>
              <View className={sectionClassName}>
                <FormField
                  vertical
                  kind="longText"
                  label="Zvl.schopnosti"
                  onChangeText={(next) => {
                    changeText('specialAbilities', next, 'longText');
                  }}
                  value={values.specialAbilities}
                />
                <FormField
                  vertical
                  kind="longText"
                  label="Rezistence"
                  onChangeText={(next) => {
                    changeText('resistances', next, 'longText');
                  }}
                  value={values.resistances}
                />
                <FormField
                  vertical
                  kind="longText"
                  label="Imunita"
                  onChangeText={(next) => {
                    changeText('immunities', next, 'longText');
                  }}
                  value={values.immunities}
                />
                <FormField
                  vertical
                  kind="longText"
                  label="Slabina"
                  onChangeText={(next) => {
                    changeText('weaknesses', next, 'longText');
                  }}
                  value={values.weaknesses}
                />
                <FormField
                  vertical
                  kind="longText"
                  label="Dovednosti"
                  onChangeText={(next) => {
                    changeText('skills', next, 'longText');
                  }}
                  value={values.skills}
                />
                <View className="flex-row items-center justify-between gap-4">
                  <Text className="text-yellow">Veřejné</Text>
                  <Switch
                    accessibilityLabel="Veřejné"
                    onValueChange={(isPublic) => {
                      setDraft({ ...values, isPublic });
                    }}
                    thumbColor={colors.white}
                    trackColor={{ false: colors.black, true: colors.yellow }}
                    value={values.isPublic}
                  />
                </View>
              </View>
              <View className={sectionClassName}>
                <FormField
                  vertical
                  kind="text"
                  label="Výskyt"
                  onChangeText={(next) => {
                    changeText('habitat', next, 'text');
                  }}
                  value={values.habitat}
                />
              </View>
              <View className={sectionClassName}>
                <FormField
                  vertical
                  kind="longText"
                  label="Poznámky"
                  onChangeText={(next) => {
                    changeText('notes', next, 'longText');
                  }}
                  value={values.notes}
                />
              </View>
              <View className={sectionClassName}>
                <FormField
                  vertical
                  kind="longText"
                  label="Popis"
                  onChangeText={(next) => {
                    changeText('description', next, 'longText');
                  }}
                  value={values.description}
                />
              </View>
              <Button text="Uložit" onPress={save} />
            </>
          ) : null}
          <Button text="Zrušit" onPress={closeForm} />
          {editing && enemy ? <Button text="Vymazat" onPress={remove} /> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
