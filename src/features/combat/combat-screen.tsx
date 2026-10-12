import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';

import { clearAccess } from '@/features/access/access-store';
import { useBestiary } from '@/features/bestiary/bestiary-store';
import { filledEnemyFields } from '@/features/bestiary/enemy-fields';
import {
  removeCombatSlot,
  selectCombatSlot,
  useCombat,
} from '@/features/combat/combat-store';

import { CombatSection } from './combat-section';

import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { SquareButton } from '@/shared/ui/square-button';
import { Text } from '@/shared/ui/text';

type FilledField = ReturnType<typeof filledEnemyFields>[number];

function findFilledField(fields: FilledField[], key: FilledField['key']) {
  return fields.find((field) => field.key === key);
}

function FilledEnemyField({ field }: { field: FilledField | undefined }) {
  if (!field) {
    return null;
  }

  return (
    <View className="flex-1 flex-row gap-1">
      <Text className="text-yellow">{field.label}:</Text>
      <Text className="text-white">{field.value}</Text>
    </View>
  );
}

export function CombatScreen() {
  const combat = useCombat();
  const bestiary = useBestiary();
  const scroller = useRef<ScrollView>(null);
  const ready = combat.ready && bestiary.ready;
  const selectedSlot =
    combat.slots.find((slot) => slot.id === combat.selectedSlotId) ?? null;
  const selectedEnemy = selectedSlot
    ? (bestiary.enemies.find((enemy) => enemy.id === selectedSlot.enemyId) ??
      null)
    : null;

  useEffect(() => {
    if (!ready) {
      return;
    }

    scroller.current?.scrollToEnd({ animated: false });
  }, [ready, combat.slots.length]);

  const filledFields =
    ready && selectedEnemy ? filledEnemyFields(selectedEnemy) : [];
  const name = findFilledField(filledFields, 'name');
  const health = findFilledField(filledFields, 'health');
  const attackValue = findFilledField(filledFields, 'attackValue');
  const damageValue = findFilledField(filledFields, 'damageValue');
  const baseDefense = findFilledField(filledFields, 'baseDefense');
  const defenseValue = findFilledField(filledFields, 'defenseValue');
  const movement = findFilledField(filledFields, 'movement');
  const size = findFilledField(filledFields, 'size');
  const strength = findFilledField(filledFields, 'strength');
  const dexterity = findFilledField(filledFields, 'dexterity');
  const constitution = findFilledField(filledFields, 'constitution');
  const intelligence = findFilledField(filledFields, 'intelligence');
  const charisma = findFilledField(filledFields, 'charisma');
  const level = findFilledField(filledFields, 'level');
  const divinePower = findFilledField(filledFields, 'divinePower');
  const challengeRating = findFilledField(filledFields, 'challengeRating');
  const type = findFilledField(filledFields, 'type');
  const experiencePoints = findFilledField(filledFields, 'experiencePoints');
  const specialAbilities = findFilledField(filledFields, 'specialAbilities');
  const resistances = findFilledField(filledFields, 'resistances');
  const immunities = findFilledField(filledFields, 'immunities');
  const weaknesses = findFilledField(filledFields, 'weaknesses');
  const skills = findFilledField(filledFields, 'skills');
  const isPublic = findFilledField(filledFields, 'isPublic');
  const habitat = findFilledField(filledFields, 'habitat');
  const notes = findFilledField(filledFields, 'notes');
  const description = findFilledField(filledFields, 'description');

  return (
    <Screen>
      <View className="flex-1 gap-4 pt-small">
        {ready ? (
          <ScrollView
            ref={scroller}
            horizontal
            contentContainerClassName="gap-2 min-w-full p-small border-t border-b border-yellow"
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
          >
            {combat.slots.map((slot, index) => (
              <SquareButton
                key={slot.id}
                active={slot.id === combat.selectedSlotId}
                onPress={() => {
                  selectCombatSlot(slot.id);
                }}
                value={index + 1}
              />
            ))}
            <SquareButton
              onPress={() => {
                router.navigate('/archive');
              }}
              value="+"
            />
          </ScrollView>
        ) : null}
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 px-small pb-small"
        >
          {name ||
          health ||
          attackValue ||
          damageValue ||
          baseDefense ||
          defenseValue ? (
            <CombatSection>
              <View className="flex-1 flex-row justify-between">
                <Text className="font-cinzel text-xl text-yellow">
                  {name?.value}
                </Text>
                <Text className="p-2 rounded border border-yellow text-yellow">
                  Ještě nehrál
                </Text>
              </View>
              <View className="flex-1 flex-row justify-between gap-2">
                <View className="border border-yellow w-2/5  aspect-[3/4]"></View>
                <View className="flex-1 justify-between items-center">
                  <Text className="w-1/2 p-2 text-center rounded border text-yellow border-yellow">
                    Útok
                  </Text>
                  <Text className="w-1/2 p-2 text-center  rounded border text-yellow border-yellow">
                    Obrana
                  </Text>
                  <Text className="w-1/2 p-2 text-center rounded border text-yellow border-yellow">
                    ZO
                  </Text>
                </View>
              </View>

              <View className="py-big flex flex-row justify-between gap-2">
                <View>
                  <View className="flex-1 flex-row items-center gap-2">
                    <View className="w-12 h-12 justify-center rounded border border-yellow">
                      <Text className="text-center text-yellow">Ú.Č.</Text>
                    </View>
                    <Text className="font-cinzel text-2xl text-white">
                      {attackValue?.value + '+' + damageValue?.value}
                    </Text>
                  </View>
                </View>

                <View>
                  <View className="flex-1 flex-row items-center gap-2">
                    <View className="w-12 h-12 justify-center rounded border border-yellow">
                      <Text className="text-center text-yellow">O.Č.</Text>
                    </View>
                    <Text className="font-cinzel text-2xl text-white">
                      {defenseValue?.value}
                    </Text>
                  </View>
                </View>
                <View>
                  <View className="flex-1 flex-row items-center gap-2">
                    <View className="w-12 h-12 justify-center rounded border border-yellow">
                      <Text className="text-center text-yellow">ZO</Text>
                    </View>
                    <Text className="font-cinzel text-2xl text-white">
                      {baseDefense?.value}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-1 justify-center">
                <Text className="font-cinzel text-2xl text-white">
                  {health?.label}:{health?.value}
                </Text>
              </View>
            </CombatSection>
          ) : null}
          {movement ||
          size ||
          strength ||
          dexterity ||
          constitution ||
          intelligence ||
          charisma ? (
            <CombatSection>
              <FilledEnemyField field={movement} />
              <FilledEnemyField field={size} />
              <FilledEnemyField field={strength} />
              <FilledEnemyField field={dexterity} />
              <FilledEnemyField field={constitution} />
              <FilledEnemyField field={intelligence} />
              <FilledEnemyField field={charisma} />
            </CombatSection>
          ) : null}
          {level ||
          divinePower ||
          challengeRating ||
          type ||
          experiencePoints ? (
            <CombatSection>
              <FilledEnemyField field={level} />
              <FilledEnemyField field={divinePower} />
              <FilledEnemyField field={challengeRating} />
              <FilledEnemyField field={type} />
              <FilledEnemyField field={experiencePoints} />
            </CombatSection>
          ) : null}
          {specialAbilities ||
          resistances ||
          immunities ||
          weaknesses ||
          skills ||
          isPublic ? (
            <CombatSection>
              <FilledEnemyField field={specialAbilities} />
              <FilledEnemyField field={resistances} />
              <FilledEnemyField field={immunities} />
              <FilledEnemyField field={weaknesses} />
              <FilledEnemyField field={skills} />
              <FilledEnemyField field={isPublic} />
            </CombatSection>
          ) : null}
          {habitat ? (
            <CombatSection>
              <FilledEnemyField field={habitat} />
            </CombatSection>
          ) : null}
          {notes ? (
            <CombatSection>
              <FilledEnemyField field={notes} />
            </CombatSection>
          ) : null}
          {description ? (
            <CombatSection>
              <FilledEnemyField field={description} />
            </CombatSection>
          ) : null}
          {ready && selectedSlot ? (
            <Button
              text="Odebrat"
              onPress={() => {
                removeCombatSlot(selectedSlot.id);
              }}
            />
          ) : null}
          <Button
            text="Introduction"
            onPress={() => {
              clearAccess();
              router.replace('/');
            }}
          />
        </ScrollView>
      </View>
    </Screen>
  );
}
