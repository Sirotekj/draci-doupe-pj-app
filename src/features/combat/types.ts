export type CombatSlot = {
  id: string;
  enemyId: string;
  health: number | null;
  initiative: number | null;
  rolledAttack: number | null;
  rolledDefense: number | null;
  rolledBaseDefense: number | null;
};
