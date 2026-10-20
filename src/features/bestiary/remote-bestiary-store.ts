import { useFocusEffect } from 'expo-router';
import { useCallback, useSyncExternalStore } from 'react';

import { useAccess } from '@/features/access/access-store';
import { fetchRemoteEnemies } from '@/features/bestiary/enemies-api';
import type { Enemy } from '@/features/bestiary/types';

type RemoteBestiarySnapshot = {
  ready: boolean;
  enemies: Enemy[];
  error: string | null;
};

let generation = 0;
let snapshot: RemoteBestiarySnapshot = {
  ready: false,
  enemies: [],
  error: null,
};
const listeners = new Set<() => void>();

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

export function clearRemoteEnemies() {
  generation += 1;
  snapshot = { ready: true, enemies: [], error: null };
  emit();
}

export async function loadRemoteEnemies(sessionToken: string) {
  const request = ++generation;
  snapshot = { ready: false, enemies: snapshot.enemies, error: null };
  emit();

  try {
    const enemies = await fetchRemoteEnemies(sessionToken);

    if (request !== generation) {
      return;
    }

    snapshot = { ready: true, enemies, error: null };
  } catch (error: unknown) {
    if (request !== generation) {
      return;
    }

    snapshot = {
      ready: true,
      enemies: snapshot.enemies,
      error:
        error instanceof Error
          ? error.message
          : 'Nepřátele z databáze se nepodařilo načíst.',
    };
  }

  emit();
}

export function useRemoteEnemies() {
  const access = useAccess();
  const remote = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const sessionToken = access?.mode === 'online' ? access.sessionToken : null;

  useFocusEffect(
    useCallback(() => {
      if (sessionToken === null) {
        clearRemoteEnemies();
        return;
      }

      void loadRemoteEnemies(sessionToken);
    }, [sessionToken]),
  );

  return remote;
}
