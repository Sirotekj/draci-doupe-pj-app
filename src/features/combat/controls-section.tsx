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
  health: number | null;
  rolledAttack: number | null;
  rolledDefense: number | null;
  rolledBaseDefense: number | null;
  onRollAttack: (result: number) => void;
  onRollDefense: (result: number) => void;
  onRollBaseDefense: (result: number) => void;
  onChangeHealth: (health: number) => void;
};

export function ControlsSection({
  attackValue,
  damageValue,
  baseDefense,
  defenseValue,
  health,
  rolledAttack,
  rolledDefense,
  rolledBaseDefense,
  onRollAttack,
  onRollDefense,
  onRollBaseDefense,
  onChangeHealth,
}: Props) {
  function changeHealth(sign: '+' | '-') {
    if (health === null) {
      return;
    }

    const next = sign === '+' ? health + 1 : health - 1;

    if (next < 0) {
      return;
    }

    onChangeHealth(next);
  }

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
                  {rolledAttack !== null &&
                    `${+attackValue + rolledAttack}${damageValue && ` + ${damageValue}`}`}
                </Text>
              </View>
              <DiceButton sides={6} onRoll={onRollAttack} />
            </View>
            <View className="flex-1 flex-row justify-between items-center">
              <View>
                <Text className="mb-1 p-2 text-center  rounded border text-yellow border-yellow/50">
                  Obrana
                </Text>
                <Text className="font-cinzel text-white text-2xl">
                  {rolledDefense !== null && +defenseValue + rolledDefense}
                </Text>
              </View>
              <DiceButton sides={6} onRoll={onRollDefense} />
            </View>
            <View className="flex-1 flex-row justify-between items-center">
              <View>
                <Text className="mb-1 p-2 text-center rounded border text-yellow border-yellow/50">
                  ZO
                </Text>
                <Text className="font-cinzel text-white text-2xl">
                  {rolledBaseDefense !== null && +baseDefense + rolledBaseDefense}
                </Text>
              </View>
              <DiceButton sides={6} onRoll={onRollBaseDefense} />
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
      {health !== null && (
        <View className="flex-1 flex-row justify-center gap-2">
          <Text className="font-cinzel text-2xl text-white">
            {`Životy: ${health}`}
          </Text>
          <SignButton sign="+" onPress={() => changeHealth('+')}></SignButton>
          <SignButton sign="-" onPress={() => changeHealth('-')}></SignButton>
        </View>
      )}
    </>
  );
}
