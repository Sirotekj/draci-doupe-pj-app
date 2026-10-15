import { Text, View } from 'react-native';

import { DiceButton } from '@/shared/ui/dice-button';
import { SignButton } from '@/shared/ui/sign-button';

const maxRolls = 3;

function rollTotal(rolls: number[]) {
  return rolls.reduce((sum, roll) => sum + roll, 0);
}

function canRollAgain(rolls: number[]) {
  return rolls.at(-1) === 6 && rolls.length < maxRolls;
}

function continueRoll(rolls: number[], face: number) {
  if (canRollAgain(rolls)) {
    return [...rolls, face];
  }

  return [face];
}

function rollText(rolls: number[], result: string) {
  if (rolls.length === 0) {
    return null;
  }

  return canRollAgain(rolls) ? (
    <>
      {result}
      <Text className="font-sans text-yellow text-sm">(házíš znovu!)</Text>
    </>
  ) : (
    result
  );
}

type Props = {
  strength: string | undefined;
  dexterity: string | undefined;
  attackValue: string | undefined;
  damageValue: string | undefined;
  baseDefense: string | undefined;
  defenseValue: string | undefined;
  health: number | null;
  mana: number | null;
  attackRolls: number[];
  defenseRolls: number[];
  baseDefenseRolls: number[];
  onRollAttack: (rolls: number[]) => void;
  onRollDefense: (rolls: number[]) => void;
  onRollBaseDefense: (rolls: number[]) => void;
  onChangeHealth: (health: number) => void;
  onChangeMana: (mana: number) => void;
};

export function ControlsSection({
  attackValue,
  damageValue,
  baseDefense,
  defenseValue,
  health,
  mana,
  attackRolls,
  defenseRolls,
  baseDefenseRolls,
  onRollAttack,
  onRollDefense,
  onRollBaseDefense,
  onChangeHealth,
  onChangeMana,
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
  function changeMana(sign: '+' | '-') {
    if (mana === null) {
      return;
    }
    const next = sign === '+' ? mana + 1 : mana - 1;
    if (next < 0) {
      return;
    }
    onChangeMana(next);
  }

  return (
    <>
      <View className="flex-1 flex-row justify-between gap-2">
        <View
          id="image"
          className="border border-yellow w-2/5  aspect-[3/4]"
        ></View>
        {attackValue && defenseValue && baseDefense && (
          <View className="flex-1">
            <View className="flex-1 flex-row justify-between items-center gap-2">
              <View className="min-w-0 flex-1">
                <Text className="mb-1 p-2 text-center rounded border text-yellow border-yellow/50">
                  Útok
                </Text>
                <Text className="font-cinzel text-white text-center text-2xl">
                  {rollText(
                    attackRolls,
                    `${+attackValue + rollTotal(attackRolls)}${damageValue ? ` + ${damageValue}` : ''}`,
                  )}
                </Text>
              </View>
              <DiceButton
                sides={6}
                onRoll={(face) => {
                  onRollAttack(continueRoll(attackRolls, face));
                }}
              />
            </View>
            <View className="flex-1 flex-row justify-between items-center gap-2">
              <View className="min-w-0 flex-1">
                <Text className="mb-1 p-2 text-center rounded border text-yellow border-yellow/50">
                  Obrana
                </Text>
                <Text className="font-cinzel text-white text-center text-2xl">
                  {rollText(
                    defenseRolls,
                    String(+defenseValue + rollTotal(defenseRolls)),
                  )}
                </Text>
              </View>
              <DiceButton
                sides={6}
                onRoll={(face) => {
                  onRollDefense(continueRoll(defenseRolls, face));
                }}
              />
            </View>
            <View className="flex-1 flex-row justify-between items-center gap-2">
              <View className="min-w-0 flex-1">
                <Text className="mb-1 p-2 text-center rounded border text-yellow border-yellow/50">
                  ZO
                </Text>
                <Text className="font-cinzel text-white text-center text-2xl">
                  {rollText(
                    baseDefenseRolls,
                    String(+baseDefense + rollTotal(baseDefenseRolls)),
                  )}
                </Text>
              </View>
              <DiceButton
                sides={6}
                onRoll={(face) => {
                  onRollBaseDefense(continueRoll(baseDefenseRolls, face));
                }}
              />
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
      {mana && (
        <View className="flex-1 flex-row justify-center gap-2">
          <Text className="font-cinzel text-2xl text-white">
            {`Mana/Přízeň: ${mana}`}
          </Text>
          <SignButton sign="+" onPress={() => changeMana('+')}></SignButton>
          <SignButton sign="-" onPress={() => changeMana('-')}></SignButton>
        </View>
      )}
    </>
  );
}
