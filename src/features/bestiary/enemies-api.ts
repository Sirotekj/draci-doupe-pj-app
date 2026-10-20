import { apiBaseUrl, readErrorMessage } from '@/features/access/mobile-auth-api';
import { enemyFromUnknown } from '@/features/bestiary/enemy-fields';
import type { Enemy } from '@/features/bestiary/types';

export async function fetchRemoteEnemies(sessionToken: string): Promise<Enemy[]> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl()}/api/enemies`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
    });
  } catch {
    throw new Error(
      'Nepodařilo se spojit s API. Na telefonu použij IP počítače, v Android emulátoru http://10.0.2.2:3000.',
    );
  }

  const raw = await response.text();
  let body: unknown = null;

  if (raw) {
    try {
      body = JSON.parse(raw) as unknown;
    } catch {
      body = raw;
    }
  }

  if (!response.ok) {
    throw new Error(readErrorMessage(body, response.status));
  }

  if (!Array.isArray(body)) {
    throw new Error('API vrátilo neznámou odpověď.');
  }

  return body.flatMap((item) => {
    const enemy = enemyFromUnknown(item);
    return enemy === null ? [] : [enemy];
  });
}
