import { useSyncExternalStore } from 'react';

import type { AppAccess } from '@/features/access/types';

let access: AppAccess | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function setAccess(next: AppAccess | null) {
  access = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getAccess() {
  return access;
}

export function continueOffline() {
  setAccess({ mode: 'offline' });
}

/** Enters online mode without a NextAuth session. Sign-in fills that in later. */
export function beginOnline() {
  setAccess({ mode: 'online', sessionToken: null, user: null });
}

export function clearAccess() {
  setAccess(null);
}

export function useAccess() {
  return useSyncExternalStore(subscribe, getAccess, getAccess);
}
