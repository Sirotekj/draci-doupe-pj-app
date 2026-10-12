import { useSyncExternalStore } from 'react';

import { enemyFromUnknown } from '@/features/bestiary/enemy-fields';
import type { Enemy, EnemyDetails } from '@/features/bestiary/types';
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

function parseEnemies(value: unknown): Enemy[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const enemy = enemyFromUnknown(item);
    return enemy === null ? [] : [enemy];
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

export function createEnemy(details: EnemyDetails) {
  const enemy = enemyFromUnknown({ id: createId(), ...details });

  if (!snapshot.ready || enemy === null) {
    return null;
  }

  const enemies = [...snapshot.enemies, enemy];
  snapshot = { ready: true, enemies };
  emit();
  persist(enemies);
  return enemy;
}

export function updateEnemy(id: string, details: EnemyDetails) {
  const enemy = enemyFromUnknown({ id, ...details });
  const exists = snapshot.enemies.some((item) => item.id === id);

  if (!snapshot.ready || enemy === null || !exists) {
    return false;
  }

  const enemies = snapshot.enemies.map((item) => (item.id === id ? enemy : item));
  snapshot = { ready: true, enemies };
  emit();
  persist(enemies);
  return true;
}

export function deleteEnemy(id: string) {
  if (!snapshot.ready) {
    return false;
  }

  const enemies = snapshot.enemies.filter((enemy) => enemy.id !== id);

  if (enemies.length === snapshot.enemies.length) {
    return false;
  }

  snapshot = { ready: true, enemies };
  emit();
  persist(enemies);
  return true;
}

export function useBestiary() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
