import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { roles, type MobileSession, type Role } from '@/features/access/types';

const storageKey = 'eriwen.session';

export function isSessionExpired(expires: string) {
  const time = Date.parse(expires);
  return Number.isNaN(time) || time <= Date.now();
}

function isRole(value: unknown): value is Role {
  return roles.some((role) => role === value);
}

function isMobileSession(value: unknown): value is MobileSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const session = value as Record<string, unknown>;
  const user = session.user;

  if (typeof user !== 'object' || user === null) {
    return false;
  }

  const account = user as Record<string, unknown>;

  return (
    typeof session.sessionToken === 'string' &&
    typeof session.expires === 'string' &&
    typeof account.id === 'string' &&
    (account.email === null || typeof account.email === 'string') &&
    (account.name === null || typeof account.name === 'string') &&
    (account.image === null || typeof account.image === 'string') &&
    isRole(account.role)
  );
}

async function readItem(key: string) {
  if (await SecureStore.isAvailableAsync()) {
    return SecureStore.getItemAsync(key);
  }

  return AsyncStorage.getItem(key);
}

async function writeItem(key: string, value: string) {
  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.setItemAsync(key, value);
    return;
  }

  await AsyncStorage.setItem(key, value);
}

async function deleteItem(key: string) {
  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  await AsyncStorage.removeItem(key);
}

export async function readStoredSession(): Promise<MobileSession | null> {
  const raw = await readItem(storageKey);

  if (raw === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isMobileSession(parsed) || isSessionExpired(parsed.expires)) {
      await deleteItem(storageKey);
      return null;
    }

    return parsed;
  } catch {
    await deleteItem(storageKey);
    return null;
  }
}

export async function writeStoredSession(session: MobileSession) {
  await writeItem(storageKey, JSON.stringify(session));
}
