export const roles = ['READER', 'EDITOR', 'ADMIN'] as const;

export type Role = (typeof roles)[number];

/** Fields the app needs from the Prisma User model. */
export type SessionUser = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  role: Role;
};

export type OfflineAccess = {
  mode: 'offline';
};

/**
 * Online access uses the NextAuth models on the web app:
 * Session.sessionToken and User.
 * Google will be an Account with provider "google" and providerAccountId set to the Google sub.
 * sessionToken and user stay empty until that sign-in is connected.
 */
export type OnlineAccess = {
  mode: 'online';
  sessionToken: string | null;
  user: SessionUser | null;
};

export type AppAccess = OfflineAccess | OnlineAccess;

export function isSignedIn(
  access: AppAccess | null,
): access is OnlineAccess & { sessionToken: string; user: SessionUser } {
  return access?.mode === 'online' && access.sessionToken !== null && access.user !== null;
}
