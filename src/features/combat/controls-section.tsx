import { useState } from 'react';
import { Text, View } from 'react-native';

import { DiceButton } from '@/shared/ui/dice-button';
import { SignButton } from '@/shared/ui/sign-button';

type Props = {
  strength: string | undefined;
  dexterity: string | undefined;
  attackValue: string | undefined;
  damageValue: string | undefined;
  baseDefense: string | undefined;
  defenseValue: string | undefined;
  health: string | undefined;
};

export function ControlsSection({
  strength,
  dexterity,
  attackValue,
  damageValue,
  baseDefense,
  defenseValue,
  health,
}: Props) {
  const [rolledAttack, setRolledAttack] = useState<number | null>(null);
  const [rolledDefense, setRolledDefense] = useState<number | null>(null);
  const [rolledBaseDefense, setRolledBaseDefense] = useState<number | null>(
    null,
  );

  const [actualHealth, setActualHealth] = useState<number | undefined>(
    Number(health),
  );

  const changeHealth = (sign: string) => {
    setActualHealth(
      (previewHealth) =>
        previewHealth && (sign === '+' ? previewHealth + 1 : previewHealth - 1),
    );
  };

  return (
    <>
      <View className="flex-1 flex-row justify-between gap-2">
        <View className="border border-yellow w-2/5  aspect-[3/4]"></View>
        {attackValue && defenseValue && baseDefense && (
          <View className="flex-1">
            <View className="flex-1 flex-row justify-between items-center">
              <View>
                <Text className="mb-1 p-2 text-center rounded border text-yellow border-yellow/50">
                  Útok
                </Text>
                <Text className="font-cinzel text-white text-2xl">
                  {rolledAttack &&
                    `${+attackValue + rolledAttack}${damageValue && ` + ${damageValue}`}`}
                </Text>
              </View>
              <DiceButton sides={6} onRoll={setRolledAttack} />
            </View>
            <View className="flex-1 flex-row justify-between items-center">
              <View>
                <Text className="mb-1 p-2 text-center  rounded border text-yellow border-yellow/50">
                  Obrana
                </Text>
                <Text className="font-cinzel text-white text-2xl">
                  {rolledDefense && +defenseValue + rolledDefense}
                </Text>
              </View>
              <DiceButton sides={6} onRoll={setRolledDefense} />
            </View>
            <View className="flex-1 flex-row justify-between items-center">
              <View>
                <Text className="mb-1 p-2 text-center rounded border text-yellow border-yellow/50">
                  ZO
                </Text>
                <Text className="font-cinzel text-white text-2xl">
                  {rolledBaseDefense && +baseDefense + rolledBaseDefense}
                </Text>
              </View>
              <DiceButton sides={6} onRoll={setRolledBaseDefense} />
            </View>
          </View>
        )}
      </View>

      <View className="py-big flex-row gap-2">
        {attackValue && (
          <View className="flex-1 flex-row items-center gap-4">
            <View className="w-12 h-12 justify-center rounded border border-yellow/50">
              <Text className="text-center text-yellow">Ú.Č.</Text>
            </View>
            <Text className="font-cinzel text-2xl text-white">
              {damageValue ? attackValue + '+' + damageValue : attackValue}
            </Text>
          </View>
        )}
        {defenseValue && (
          <View className="flex-1 flex-row items-center gap-4">
            <View className="w-12 h-12 justify-center rounded border border-yellow/50">
              <Text className="text-center text-yellow">O.Č.</Text>
            </View>
            <Text className="font-cinzel text-2xl text-white">
              {defenseValue}
            </Text>
          </View>
        )}

        {baseDefense && (
          <View className="flex-1 flex-row items-center gap-4">
            <View className="w-12 h-12 justify-center rounded border border-yellow/50">
              <Text className="text-center text-yellow">ZO</Text>
            </View>
            <Text className="font-cinzel text-2xl text-white">
              {baseDefense}
            </Text>
          </View>
        )}
      </View>
      {health && (
        <View className="flex-1 flex-row justify-center gap-2">
          <Text className="font-cinzel text-2xl text-white">
            {`Životy: ${actualHealth}`}
          </Text>
          <SignButton sign="+" onPress={() => changeHealth('+')}></SignButton>
          <SignButton sign="-" onPress={() => changeHealth('-')}></SignButton>
        </View>
      )}
    </>
  );
}
