import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';

import { clearAccess } from '@/features/access/access-store';
import { useBestiary } from '@/features/bestiary/bestiary-store';
import { removeCombatSlot, selectCombatSlot, useCombat } from '@/features/combat/combat-store';
import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { SquareButton } from '@/shared/ui/square-button';
import { Text } from '@/shared/ui/text';

export function CombatScreen() {
  const combat = useCombat();
  const bestiary = useBestiary();
  const scroller = useRef<ScrollView>(null);
  const ready = combat.ready && bestiary.ready;
  const selectedSlot = combat.slots.find((slot) => slot.id === combat.selectedSlotId) ?? null;
  const selectedEnemy = selectedSlot
    ? (bestiary.enemies.find((enemy) => enemy.id === selectedSlot.enemyId) ?? null)
    : null;

  useEffect(() => {
    if (!ready) {
      return;
    }

    scroller.current?.scrollToEnd({ animated: false });
  }, [ready, combat.slots.length]);

  return (
    <Screen>
      <View className="gap-4 p-small">
        {ready ? (
          <ScrollView
            ref={scroller}
            horizontal
            contentContainerClassName="gap-2"
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
          >
            {combat.slots.map((slot, index) => (
              <SquareButton
                key={slot.id}
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
        {ready && selectedEnemy && selectedSlot ? (
          <>
            <Text className="text-white">{selectedEnemy.name}</Text>
            <Button
              text="Odebrat"
              onPress={() => {
                removeCombatSlot(selectedSlot.id);
              }}
            />
          </>
        ) : null}
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
