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
  const textStyle = 'font-cinzel text-white text-xl text-center';
  const attributeCellStyle = 'font-cinzel text-white text-xl flex-1';
  const labelCellStyle = `${attributeCellStyle} text-right`;
  const bonusCellStyle = `${attributeCellStyle} text-left`;
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
        {movement && (
          <Text className={textStyle}>{`Pohyblivost: ${movement}`}</Text>
        )}
        {size && <Text className={textStyle}>{`Velikost: ${size}`}</Text>}
      </View>
      <View className="flex-1 justify-center gap-2">
        {strength && (
          <View className="flex-row">
            <Text className={labelCellStyle}>{`Síla: ${strength} | `}</Text>
            <Text className={bonusCellStyle}>{getBonus(strength)}</Text>
          </View>
        )}
        {dexterity && (
          <View className="flex-row">
            <Text
              className={labelCellStyle}
            >{`Obratnost: ${dexterity} | `}</Text>
            <Text className={bonusCellStyle}>{getBonus(dexterity)}</Text>
          </View>
        )}
        {constitution && (
          <View className="flex-row">
            <Text
              className={labelCellStyle}
            >{`Odolnost: ${constitution} | `}</Text>
            <Text className={bonusCellStyle}>{getBonus(constitution)}</Text>
          </View>
        )}
        {intelligence && (
          <View className="flex-row">
            <Text
              className={labelCellStyle}
            >{`Inteligence: ${intelligence} | `}</Text>
            <Text className={bonusCellStyle}>{getBonus(intelligence)}</Text>
          </View>
        )}
        {charisma && (
          <View className="flex-row">
            <Text className={labelCellStyle}>{`Charisma: ${charisma} | `}</Text>
            <Text className={bonusCellStyle}>{getBonus(charisma)}</Text>
          </View>
        )}
      </View>
    </>
  );
}
