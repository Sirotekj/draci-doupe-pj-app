import { roles, type MobileSession, type Role } from '@/features/access/types';

function apiBaseUrl() {
  const url = process.env.EXPO_PUBLIC_API_URL;

  if (!url) {
    throw new Error('Chybí EXPO_PUBLIC_API_URL.');
  }

  return url.replace(/\/$/, '');
}

function isRole(value: unknown): value is Role {
  return roles.some((role) => role === value);
}

function readErrorMessage(body: unknown, status: number) {
  if (typeof body === 'object' && body !== null) {
    const error = (body as { error?: unknown }).error;

    if (typeof error === 'string') {
      return error;
    }
  }

  const detail =
    typeof body === 'string' ? body.replace(/\s+/g, ' ').slice(0, 180) : '';

  return detail
    ? `API odpovědělo ${status}: ${detail}`
    : `API odpovědělo ${status} bez popisu chyby.`;
}

function parseSession(body: unknown): MobileSession {
  if (typeof body !== 'object' || body === null) {
    throw new Error('API vrátilo neznámou odpověď.');
  }

  const record = body as Record<string, unknown>;
  const user = record.user;

  if (typeof user !== 'object' || user === null) {
    throw new Error('API vrátilo neznámou odpověď.');
  }

  const account = user as Record<string, unknown>;

  if (
    typeof record.sessionToken !== 'string' ||
    typeof record.expires !== 'string' ||
    typeof account.id !== 'string' ||
    (account.email !== null && typeof account.email !== 'string') ||
    (account.name !== null && typeof account.name !== 'string') ||
    (account.image !== null && typeof account.image !== 'string') ||
    !isRole(account.role)
  ) {
    throw new Error('API vrátilo neznámou odpověď.');
  }

  return {
    sessionToken: record.sessionToken,
    expires: record.expires,
    user: {
      id: account.id,
      email: account.email,
      name: account.name,
      image: account.image,
      role: account.role,
    },
  };
}

export async function exchangeGoogleIdToken(idToken: string): Promise<MobileSession> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl()}/api/auth/mobile/google`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
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

  return parseSession(body);
}
