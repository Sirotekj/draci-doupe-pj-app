import { Text, View } from 'react-native';

type Props = {
  movement: string | undefined;
  size: string | undefined;
  strength: string | undefined;
  dexterity: string | undefined;
  constitution: string | undefined;
  intelligence: string | undefined;
  charisma: string | undefined;
};
export function MainAttributesSection({
  movement,
  size,
  strength,
  dexterity,
  constitution,
  intelligence,
  charisma,
}: Props) {
  const bonusTable: Record<string, string> = {
    '1': '-5',
    '2': '-4',
    '3': '-4',
    '4': '-3',
    '5': '-3',
    '6': '-2',
    '7': '-2',
    '8': '-1',
    '9': '-1',
    '10': '0',
    '11': '0',
    '12': '+1',
    '13': '+1',
    '14': '+2',
    '15': '+2',
    '16': '+3',
    '17': '+3',
    '18': '+4',
    '19': '+4',
    '20': '+5',
    '21': '+5',
    '22': '+6',
    '23': '+6',
  };
  const getBonus = (attribute: string | undefined): string | null => {
    if (!attribute) return null;
    return bonusTable[attribute] ?? 0;
  };
  return (
    <>
      <View className="flex-1 justify-center gap-2">
        <Text className="font-cinzel text-white text-xl text-center">{`Pohyblivost: ${movement}`}</Text>
        <Text className="font-cinzel text-white text-xl text-center">{`Velikost: ${size}`}</Text>
      </View>
      <View className="flex-1 justify-center gap-2">
        <Text className="font-cinzel text-white text-xl text-center">{`Síla: ${strength} | ${getBonus(strength)}`}</Text>
        <Text className="font-cinzel text-white text-xl text-center">{`Obratnost: ${strength} | ${getBonus(dexterity)}`}</Text>
        <Text className="font-cinzel text-white text-xl text-center">{`odolnost: ${strength} | ${getBonus(constitution)}`}</Text>
        <Text className="font-cinzel text-white text-xl text-center">{`Inteligence: ${strength} | ${getBonus(intelligence)}`}</Text>
      </View>
    </>
  );
}
