import { useSyncExternalStore } from 'react';

import type { CombatSlot } from '@/features/combat/types';
import { createId } from '@/shared/id';
import { createJsonWriter, readStoredJson } from '@/shared/storage/json-storage';

const storageKey = 'draci-doupe.combat';

type CombatSnapshot = {
  ready: boolean;
  slots: CombatSlot[];
  selectedSlotId: string | null;
};

let snapshot: CombatSnapshot = { ready: false, slots: [], selectedSlotId: null };
let canPersist = false;
const listeners = new Set<() => void>();
const writeCombat = createJsonWriter(storageKey);

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseOptionalNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return null;
}

function parseCombat(value: unknown): Pick<CombatSnapshot, 'slots' | 'selectedSlotId'> {
  if (!isRecord(value) || !Array.isArray(value.slots)) {
    return { slots: [], selectedSlotId: null };
  }

  const slots = value.slots.flatMap((item) => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.enemyId !== 'string') {
      return [];
    }

    if (item.id.length === 0 || item.enemyId.length === 0) {
      return [];
    }

    return [
      {
        id: item.id,
        enemyId: item.enemyId,
        health: parseOptionalNumber(item.health),
        rolledAttack: parseOptionalNumber(item.rolledAttack),
        rolledDefense: parseOptionalNumber(item.rolledDefense),
        rolledBaseDefense: parseOptionalNumber(item.rolledBaseDefense),
      },
    ];
  });

  const selectedSlotId =
    typeof value.selectedSlotId === 'string' &&
    slots.some((slot) => slot.id === value.selectedSlotId)
      ? value.selectedSlotId
      : null;

  return { slots, selectedSlotId };
}

function commit(next: Pick<CombatSnapshot, 'slots' | 'selectedSlotId'>) {
  snapshot = { ready: true, ...next };
  emit();

  if (!canPersist) {
    return;
  }

  writeCombat(next);
}

async function hydrate() {
  try {
    const stored = await readStoredJson(storageKey);
    snapshot = {
      ready: true,
      ...(stored === null
        ? { slots: [], selectedSlotId: null }
        : parseCombat(stored)),
    };
    canPersist = true;
  } catch (error: unknown) {
    console.error(error);
    snapshot = { ready: true, slots: [], selectedSlotId: null };
    canPersist = false;
  }

  emit();
}

void hydrate();

export function addEnemyToCombat(enemyId: string, health: number | null) {
  if (!snapshot.ready || enemyId.length === 0) {
    return;
  }

  const slot = {
    id: createId(),
    enemyId,
    health: parseOptionalNumber(health),
    rolledAttack: null,
    rolledDefense: null,
    rolledBaseDefense: null,
  };
  commit({
    slots: [...snapshot.slots, slot],
    selectedSlotId: slot.id,
  });
}

export function updateCombatSlot(
  slotId: string,
  patch: Partial<Omit<CombatSlot, 'id' | 'enemyId'>>,
) {
  if (!snapshot.ready || !snapshot.slots.some((slot) => slot.id === slotId)) {
    return;
  }

  commit({
    slots: snapshot.slots.map((slot) => (slot.id === slotId ? { ...slot, ...patch } : slot)),
    selectedSlotId: snapshot.selectedSlotId,
  });
}

export function removeCombatSlot(slotId: string) {
  if (!snapshot.ready) {
    return;
  }

  const slots = snapshot.slots.filter((slot) => slot.id !== slotId);

  if (slots.length === snapshot.slots.length) {
    return;
  }

  commit({
    slots,
    selectedSlotId: snapshot.selectedSlotId === slotId ? null : snapshot.selectedSlotId,
  });
}

export function removeEnemyFromCombat(enemyId: string) {
  if (!snapshot.ready || enemyId.length === 0) {
    return;
  }

  const slots = snapshot.slots.filter((slot) => slot.enemyId !== enemyId);

  if (slots.length === snapshot.slots.length) {
    return;
  }

  const selectedSlotId = slots.some((slot) => slot.id === snapshot.selectedSlotId)
    ? snapshot.selectedSlotId
    : null;

  commit({ slots, selectedSlotId });
}

export function selectCombatSlot(slotId: string) {
  if (!snapshot.ready || !snapshot.slots.some((slot) => slot.id === slotId)) {
    return;
  }

  commit({
    slots: snapshot.slots,
    selectedSlotId: slotId,
  });
}

export function useCombat() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
