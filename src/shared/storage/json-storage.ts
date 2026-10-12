import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readStoredJson(key: string): Promise<unknown> {
  const raw = await AsyncStorage.getItem(key);

  if (raw === null) {
    return null;
  }

  return JSON.parse(raw) as unknown;
}

export async function writeStoredJson(key: string, value: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/** Writes the latest value, in order, so a faster tap cannot overwrite a newer one. */
export function createJsonWriter(key: string) {
  let pending: unknown;
  let hasPending = false;
  let writing = false;

  async function flush() {
    while (hasPending) {
      const next = pending;
      hasPending = false;

      try {
        await writeStoredJson(key, next);
      } catch (error: unknown) {
        console.error(error);
      }
    }

    writing = false;

    if (hasPending) {
      writing = true;
      void flush();
    }
  }

  return function write(value: unknown) {
    pending = value;
    hasPending = true;

    if (writing) {
      return;
    }

    writing = true;
    void flush();
  };
}
