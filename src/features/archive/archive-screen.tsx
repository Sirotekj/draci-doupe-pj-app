import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { clearAccess } from '@/features/access/access-store';
import { useBestiary } from '@/features/bestiary/bestiary-store';
import { addEnemyToCombat, useCombat } from '@/features/combat/combat-store';
import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

export function ArchiveScreen() {
  const bestiary = useBestiary();
  const combat = useCombat();
  const ready = bestiary.ready && combat.ready;

  return (
    <Screen>
      <ScrollView className="flex-1" contentContainerClassName="gap-4 p-small">
        {ready ? (
          <>
            <Button
              text="Nový nepřítel"
              onPress={() => {
                router.push('/enemy');
              }}
            />
            {bestiary.enemies.length === 0 ? (
              <Text className="text-white">Zatím tu žádný nepřítel není.</Text>
            ) : (
              bestiary.enemies.map((enemy) => (
                <View key={enemy.id} className="flex-row items-center gap-4">
                  <Text className="min-w-0 flex-1 text-white">{enemy.name}</Text>
                  <Button
                    text="Upravit"
                    onPress={() => {
                      router.push({ pathname: '/enemy', params: { id: enemy.id } });
                    }}
                  />
                  <Button
                    text="Přidat"
                    onPress={() => {
                      addEnemyToCombat(enemy.id);
                      router.navigate('/combat');
                    }}
                  />
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
    </Screen>
  );
}
