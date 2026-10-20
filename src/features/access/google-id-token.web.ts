export async function requestGoogleIdToken(): Promise<string | null> {
  throw new Error(
    'Přihlášení přes Google je dostupné v development buildu na Androidu nebo iOS.',
  );
}
