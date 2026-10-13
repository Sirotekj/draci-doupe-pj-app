import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { clearAccess } from '@/features/access/access-store';
import { useBestiary } from '@/features/bestiary/bestiary-store';
import { filledEnemyFields } from '@/features/bestiary/enemy-fields';
import {
  removeCombatSlot,
  selectCombatSlot,
  updateCombatSlot,
  useCombat,
} from '@/features/combat/combat-store';
import { colors } from '@/shared/theme/colors';
import { defaultFont } from '@/shared/theme/typography';
import { Button } from '@/shared/ui/button';
import { DiceButton } from '@/shared/ui/dice-button';
import { Screen } from '@/shared/ui/screen';
import { SquareButton } from '@/shared/ui/square-button';
import { Text } from '@/shared/ui/text';

import { CombatSection } from './combat-section';
import { ControlsSection } from './controls-section';
import { MainAttributesSection } from './main-attributes-section';

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

function FilledPlainTextField({ field }: { field: FilledField | undefined }) {
  if (!field) {
    return null;
  }
  return (
    <View className="flex-1 gap-2">
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

  const initiativeValue =
    selectedSlot?.initiative == null ? '' : String(selectedSlot.initiative);

  function onRollInitiative(result: number) {
    if (!selectedSlot) {
      return;
    }

    updateCombatSlot(selectedSlot.id, { initiative: result });
  }

  function onChangeInitiative(next: string) {
    if (!selectedSlot || (next !== '' && !/^\d+$/.test(next))) {
      return;
    }

    updateCombatSlot(selectedSlot.id, {
      initiative: next === '' ? null : Number(next),
    });
  }

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
            contentContainerClassName="gap-2 min-w-full p-small border-t border-b border-yellow/25"
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
          >
            {combat.slots.map((slot, index) => (
              <SquareButton
                key={slot.id}
                active={slot.id === combat.selectedSlotId}
                name={
                  bestiary.enemies.find((enemy) => enemy.id === slot.enemyId)
                    ?.name ?? ''
                }
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
                <Text className="font-cinzel text-2xl text-yellow">
                  {name?.value}
                </Text>

                <Text className="p-2 rounded border border-yellow/50 text-yellow">
                  Ještě nehrál
                </Text>
              </View>
              <View className="flex-row items-center justify-center gap-2">
                <Text className="rounded border border-yellow/50 p-2 text-yellow">
                  Iniciativa
                </Text>
                <TextInput
                  accessibilityLabel="Iniciativa"
                  className="w-12 rounded border border-yellow py-2 text-center text-yellow"
                  keyboardType="number-pad"
                  onChangeText={onChangeInitiative}
                  style={{ fontFamily: defaultFont, color: colors.yellow }}
                  value={initiativeValue}
                />
                <DiceButton sides={6} onRoll={onRollInitiative} />
              </View>
              <ControlsSection
                strength={strength?.value}
                dexterity={dexterity?.value}
                attackValue={attackValue?.value}
                damageValue={damageValue?.value}
                baseDefense={baseDefense?.value}
                defenseValue={defenseValue?.value}
                health={selectedSlot?.health ?? null}
                rolledAttack={selectedSlot?.rolledAttack ?? null}
                rolledDefense={selectedSlot?.rolledDefense ?? null}
                rolledBaseDefense={selectedSlot?.rolledBaseDefense ?? null}
                onRollAttack={(result) => {
                  if (!selectedSlot) {
                    return;
                  }
                  updateCombatSlot(selectedSlot.id, { rolledAttack: result });
                }}
                onRollDefense={(result) => {
                  if (!selectedSlot) {
                    return;
                  }
                  updateCombatSlot(selectedSlot.id, { rolledDefense: result });
                }}
                onRollBaseDefense={(result) => {
                  if (!selectedSlot) {
                    return;
                  }
                  updateCombatSlot(selectedSlot.id, {
                    rolledBaseDefense: result,
                  });
                }}
                onChangeHealth={(next) => {
                  if (!selectedSlot) {
                    return;
                  }
                  updateCombatSlot(selectedSlot.id, { health: next });
                }}
              />
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
              <MainAttributesSection
                movement={movement?.value}
                size={size?.value}
                strength={strength?.value}
                dexterity={dexterity?.value}
                constitution={constitution?.value}
                intelligence={intelligence?.value}
                charisma={charisma?.value}
              />
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
              <FilledPlainTextField field={habitat} />
            </CombatSection>
          ) : null}
          {notes ? (
            <CombatSection>
              <FilledPlainTextField field={notes} />
            </CombatSection>
          ) : null}
          {description ? (
            <CombatSection>
              <FilledPlainTextField field={description} />
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
