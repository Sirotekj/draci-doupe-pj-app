import { exchangeGoogleIdToken } from '@/features/access/mobile-auth-api';
import { requestGoogleIdToken } from '@/features/access/google-id-token';
import type { MobileSession } from '@/features/access/types';

export async function loginWithGoogle(): Promise<MobileSession | null> {
  const idToken = await requestGoogleIdToken();

  if (!idToken) {
    return null;
  }

  return exchangeGoogleIdToken(idToken);
}
