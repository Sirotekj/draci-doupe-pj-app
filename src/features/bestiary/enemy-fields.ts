import type { Enemy, EnemyDetails } from '@/features/bestiary/types';

export type EnemyFormValues = {
  [Key in keyof EnemyDetails]: Key extends 'isPublic' ? boolean : string;
};

type TextKind = 'text' | 'longText' | 'number';

type EnemyField =
  | {
      key: Exclude<keyof EnemyFormValues, 'isPublic'>;
      label: string;
      kind: TextKind;
    }
  | { key: 'isPublic'; label: string; kind: 'boolean' };

export const enemyFields = [
  { key: 'name', label: 'Jméno', kind: 'text' },
  { key: 'health', label: 'Životy', kind: 'number' },
  { key: 'mana', label: 'Mana/Přízeň', kind: 'number' },
  { key: 'level', label: 'Úroveň', kind: 'number' },
  { key: 'divinePower', label: 'Vyšší moc', kind: 'number' },
  { key: 'challengeRating', label: 'Výzva', kind: 'text' },
  { key: 'strength', label: 'Síla', kind: 'number' },
  { key: 'dexterity', label: 'Obratnost', kind: 'number' },
  { key: 'constitution', label: 'Odolnost', kind: 'number' },
  { key: 'intelligence', label: 'Inteligence', kind: 'number' },
  { key: 'charisma', label: 'Charisma', kind: 'number' },
  { key: 'movement', label: 'Pohyblivost', kind: 'number' },
  { key: 'size', label: 'Velikost', kind: 'text' },
  { key: 'attackValue', label: 'Útok', kind: 'number' },
  { key: 'damageValue', label: 'Zranění', kind: 'number' },
  { key: 'baseDefense', label: 'Základní obrana', kind: 'number' },
  { key: 'defenseValue', label: 'Obranné číslo', kind: 'number' },
  { key: 'specialAbilities', label: 'Zvl.schopnosti', kind: 'longText' },
  { key: 'resistances', label: 'Rezistence', kind: 'longText' },
  { key: 'immunities', label: 'Imunita', kind: 'longText' },
  { key: 'weaknesses', label: 'Slabina', kind: 'longText' },
  { key: 'skills', label: 'Dovednosti', kind: 'longText' },
  { key: 'habitat', label: 'Výskyt', kind: 'text' },
  { key: 'type', label: 'Typ', kind: 'text' },
  { key: 'experiencePoints', label: 'Zkušenosti', kind: 'number' },
  { key: 'notes', label: 'Poznámky', kind: 'longText' },
  { key: 'description', label: 'Popis', kind: 'longText' },
  { key: 'isPublic', label: 'Veřejné', kind: 'boolean' },
] as const satisfies readonly EnemyField[];

type ShownKey = (typeof enemyFields)[number]['key'];
type MissingField = Exclude<keyof EnemyFormValues, ShownKey>;

const allFieldsShown: MissingField extends never ? true : never = true;
void allFieldsShown;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function optionalString(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function optionalNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function enemyFromUnknown(value: unknown): Enemy | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    value.id.length === 0
  ) {
    return null;
  }

  const details = detailsFromUnknown(value);

  if (details === null) {
    return null;
  }

  return { id: value.id, ...details };
}

export function detailsFromUnknown(value: unknown): EnemyDetails | null {
  if (!isRecord(value)) {
    return null;
  }

  const name = optionalString(value.name);

  if (name === null) {
    return null;
  }

  return {
    name,
    health: optionalNumber(value.health),
    mana: optionalNumber(value.mana),
    level: optionalNumber(value.level),
    divinePower: optionalNumber(value.divinePower),
    challengeRating: optionalString(value.challengeRating),
    strength: optionalNumber(value.strength),
    dexterity: optionalNumber(value.dexterity),
    constitution: optionalNumber(value.constitution),
    intelligence: optionalNumber(value.intelligence),
    charisma: optionalNumber(value.charisma),
    movement: optionalNumber(value.movement),
    size: optionalString(value.size),
    attackValue: optionalNumber(value.attackValue),
    damageValue: optionalNumber(value.damageValue),
    baseDefense: optionalNumber(value.baseDefense),
    defenseValue: optionalNumber(value.defenseValue),
    specialAbilities: optionalString(value.specialAbilities),
    resistances: optionalString(value.resistances),
    immunities: optionalString(value.immunities),
    weaknesses: optionalString(value.weaknesses),
    skills: optionalString(value.skills),
    habitat: optionalString(value.habitat),
    type: optionalString(value.type),
    experiencePoints: optionalNumber(value.experiencePoints),
    notes: optionalString(value.notes),
    description: optionalString(value.description),
    isPublic: value.isPublic === true,
  };
}

function textValue(value: string | number | null) {
  return value === null ? '' : String(value);
}

export function enemyToForm(enemy: Enemy | null): EnemyFormValues {
  return {
    name: enemy?.name ?? '',
    health: textValue(enemy?.health ?? null),
    mana: textValue(enemy?.mana ?? null),
    level: textValue(enemy?.level ?? null),
    divinePower: textValue(enemy?.divinePower ?? null),
    challengeRating: enemy?.challengeRating ?? '',
    strength: textValue(enemy?.strength ?? null),
    dexterity: textValue(enemy?.dexterity ?? null),
    constitution: textValue(enemy?.constitution ?? null),
    intelligence: textValue(enemy?.intelligence ?? null),
    charisma: textValue(enemy?.charisma ?? null),
    movement: textValue(enemy?.movement ?? null),
    size: enemy?.size ?? '',
    attackValue: textValue(enemy?.attackValue ?? null),
    damageValue: textValue(enemy?.damageValue ?? null),
    baseDefense: textValue(enemy?.baseDefense ?? null),
    defenseValue: textValue(enemy?.defenseValue ?? null),
    specialAbilities: enemy?.specialAbilities ?? '',
    resistances: enemy?.resistances ?? '',
    immunities: enemy?.immunities ?? '',
    weaknesses: enemy?.weaknesses ?? '',
    skills: enemy?.skills ?? '',
    habitat: enemy?.habitat ?? '',
    type: enemy?.type ?? '',
    experiencePoints: textValue(enemy?.experiencePoints ?? null),
    notes: enemy?.notes ?? '',
    description: enemy?.description ?? '',
    isPublic: enemy?.isPublic ?? false,
  };
}

export function filledEnemyFields(enemy: Enemy) {
  const filled: { key: keyof Enemy; label: string; value: string }[] = [];

  for (const field of enemyFields) {
    if (field.kind === 'boolean') {
      filled.push({
        key: field.key,
        label: field.label,
        value: enemy.isPublic ? 'ano' : 'ne',
      });
      continue;
    }

    const value = enemy[field.key];

    if (value === null) {
      continue;
    }

    filled.push({ key: field.key, label: field.label, value: String(value) });
  }

  return filled;
}

export function isNumberDraft(value: string) {
  return /^-?\d*\.?\d*$/.test(value);
}

function formNumber(value: string) {
  const trimmed = value.trim();

  if (
    trimmed === '' ||
    trimmed === '-' ||
    trimmed === '.' ||
    trimmed === '-.'
  ) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formToDetails(values: EnemyFormValues): EnemyDetails | null {
  return detailsFromUnknown({
    ...values,
    health: formNumber(values.health),
    level: formNumber(values.level),
    divinePower: formNumber(values.divinePower),
    strength: formNumber(values.strength),
    dexterity: formNumber(values.dexterity),
    constitution: formNumber(values.constitution),
    intelligence: formNumber(values.intelligence),
    charisma: formNumber(values.charisma),
    movement: formNumber(values.movement),
    attackValue: formNumber(values.attackValue),
    damageValue: formNumber(values.damageValue),
    baseDefense: formNumber(values.baseDefense),
    defenseValue: formNumber(values.defenseValue),
    experiencePoints: formNumber(values.experiencePoints),
  });
}
