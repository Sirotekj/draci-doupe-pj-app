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
import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { SquareButton } from '@/shared/ui/square-button';
import { Text } from '@/shared/ui/text';

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

  return (
    <Screen>
      <View className="flex-1 gap-4 pt-small">
        {ready ? (
          <ScrollView
            ref={scroller}
            horizontal
            contentContainerClassName="gap-2 px-small"
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
        <ScrollView className="flex-1" contentContainerClassName="gap-4 px-small pb-small">
          {filledFields.map((field) => (
            <View key={field.key} className="gap-1">
              <Text className="text-yellow">{field.label}</Text>
              <Text className="text-white">{field.value}</Text>
            </View>
          ))}
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
