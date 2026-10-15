export type CombatSlot = {
  id: string;
  enemyId: string;
  health: number | null;
  mana: number | null;
  favor: number | null;
  adrenaline: number | null;
  initiative: number | null;
  attackRolls: number[];
  defenseRolls: number[];
  baseDefenseRolls: number[];
  played: boolean;
};
