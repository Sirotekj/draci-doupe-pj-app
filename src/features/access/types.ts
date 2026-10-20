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

/** Session returned by POST /api/auth/mobile/google. */
export type MobileSession = {
  sessionToken: string;
  expires: string;
  user: SessionUser;
};

/** Online access is a NextAuth Session plus the User from the web app. */
export type OnlineAccess = {
  mode: 'online';
} & MobileSession;

export type AppAccess = OfflineAccess | OnlineAccess;
