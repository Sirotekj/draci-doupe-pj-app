import { useSyncExternalStore } from 'react';

import type { Enemy } from '@/features/bestiary/types';
import { createId } from '@/shared/id';
import { createJsonWriter, readStoredJson } from '@/shared/storage/json-storage';

const storageKey = 'draci-doupe.bestiary';

type BestiarySnapshot = {
  ready: boolean;
  enemies: Enemy[];
};

let snapshot: BestiarySnapshot = { ready: false, enemies: [] };
let canPersist = false;
const listeners = new Set<() => void>();
const writeBestiary = createJsonWriter(storageKey);

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

function parseEnemies(value: unknown): Enemy[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.name !== 'string') {
      return [];
    }

    const name = item.name.trim();

    if (item.id.length === 0 || name.length === 0) {
      return [];
    }

    return [{ id: item.id, name }];
  });
}

function persist(enemies: Enemy[]) {
  if (!canPersist) {
    return;
  }

  writeBestiary(enemies);
}

async function hydrate() {
  try {
    const stored = await readStoredJson(storageKey);
    snapshot = {
      ready: true,
      enemies: stored === null ? [] : parseEnemies(stored),
    };
    canPersist = true;
  } catch (error: unknown) {
    console.error(error);
    snapshot = { ready: true, enemies: [] };
    canPersist = false;
  }

  emit();
}

void hydrate();

export function createEnemy(name: string) {
  const trimmed = name.trim();

  if (!snapshot.ready || trimmed.length === 0) {
    return null;
  }

  const enemy = { id: createId(), name: trimmed };
  const enemies = [...snapshot.enemies, enemy];
  snapshot = { ready: true, enemies };
  emit();
  persist(enemies);
  return enemy;
}

export function useBestiary() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
