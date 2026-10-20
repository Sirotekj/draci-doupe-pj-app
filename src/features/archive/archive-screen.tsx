import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { useAccess } from '@/features/access/access-store';
import { useBestiary } from '@/features/bestiary/bestiary-store';
import { useRemoteEnemies } from '@/features/bestiary/remote-bestiary-store';
import type { Enemy } from '@/features/bestiary/types';
import { addEnemyToCombat, useCombat } from '@/features/combat/combat-store';
import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

function addToCombat(enemy: Enemy) {
  addEnemyToCombat(
    enemy.id,
    enemy.health,
    enemy.mana,
    enemy.favor,
    enemy.adrenaline,
  );
  router.navigate('/combat');
}

export function ArchiveScreen() {
  const access = useAccess();
  const bestiary = useBestiary();
  const remote = useRemoteEnemies();
  const combat = useCombat();
  const ready = bestiary.ready && combat.ready;
  const online = access?.mode === 'online';

  return (
    <Screen>
      <ScrollView className="flex-1" contentContainerClassName="gap-4 p-small">
        {ready ? (
          <>
            <Button
              text="Nový nepřítel / postava"
              onPress={() => {
                router.push('/enemy');
              }}
            />
            {bestiary.enemies.length === 0 ? (
              <Text className="text-white">Zatím tu žádný nepřítel není.</Text>
            ) : (
              <>
                <Text className="font-cinzel text-yellow text-center">
                  Tvoji nepřátelé
                </Text>
                {bestiary.enemies.map((enemy) => (
                  <View key={enemy.id} className="flex-row items-center gap-4">
                    <Text className="min-w-0 flex-1 text-white">
                      {enemy.name}
                    </Text>
                    <Button
                      text="Upravit"
                      onPress={() => {
                        router.push({
                          pathname: '/enemy',
                          params: { id: enemy.id },
                        });
                      }}
                    />
                    <Button
                      text="Přidat"
                      onPress={() => {
                        addToCombat(enemy);
                      }}
                    />
                  </View>
                ))}
              </>
            )}
            {online ? (
              <>
                <Text className="font-cinzel text-yellow text-center">
                  Z databáze
                </Text>
                {remote.error ? (
                  <Text className="text-red">{remote.error}</Text>
                ) : null}
                {!remote.ready && remote.enemies.length === 0 ? (
                  <Text className="text-white">Načítám nepřátele z databáze.</Text>
                ) : remote.enemies.length === 0 && !remote.error ? (
                  <Text className="text-white">
                    V databázi zatím žádný nepřítel není.
                  </Text>
                ) : (
                  remote.enemies.map((enemy) => (
                    <View
                      key={enemy.id}
                      className="flex-row items-center gap-4"
                    >
                      <Text className="min-w-0 flex-1 text-white">
                        {enemy.name}
                      </Text>
                      <Button
                        text="Přidat"
                        onPress={() => {
                          addToCombat(enemy);
                        }}
                      />
                    </View>
                  ))
                )}
              </>
            ) : null}
          </>
        ) : null}
        {/*<Button
          text="Introduction"
          onPress={() => {
            clearAccess();
            router.replace('/');
          }}
        />*/}
      </ScrollView>
    </Screen>
  );
}
