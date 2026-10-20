type GoogleModule = typeof import('react-native-nitro-google-signin');

function googleMessage(google: GoogleModule, code: string) {
  if (code === google.statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'Google Play Services nejsou dostupné.';
  }

  if (code === google.statusCodes.DEVELOPER_ERROR) {
    return 'Google přihlášení není nakonfigurované. V Google Cloud chybí Android klient pro balíček com.jakub.dracidoupepjapp a SHA-1 development buildu.';
  }

  return 'Google přihlášení se nepovedlo.';
}

export async function requestGoogleIdToken(): Promise<string | null> {
  let google: GoogleModule;

  try {
    google = await import('react-native-nitro-google-signin');
  } catch {
    throw new Error('Google přihlášení potřebuje development build. V Expo Go nejde.');
  }

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  if (!webClientId) {
    throw new Error('Chybí EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.');
  }

  try {
    google.GoogleOneTapSignIn.configure({
      webClientId,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? null,
    });
    await google.GoogleOneTapSignIn.checkPlayServices();

    let response = await google.GoogleOneTapSignIn.presentExplicitSignIn();

    if (google.isNoSavedCredentialFoundResponse(response)) {
      response = await google.GoogleOneTapSignIn.createAccount();
    }

    if (google.isCancelledResponse(response)) {
      throw new Error(
        'Google vrátil stav cancelled a účet se do databáze neposlal. Když se to stane hned po výběru účtu, v Google Cloud chybí SHA-1 tohoto development buildu u balíčku com.jakub.dracidoupepjapp.',
      );
    }

    if (!google.isSuccessResponse(response)) {
      throw new Error(`Google účet se nepodařilo vybrat (${response.type}).`);
    }

    if (!response.data.idToken) {
      throw new Error('Google nevrátil idToken, účet se do databáze neposlal.');
    }

    return response.data.idToken;
  } catch (error: unknown) {
    if (google.isErrorWithCode(error)) {
      if (error.code === google.statusCodes.SIGN_IN_CANCELLED) {
        throw new Error(
          'Google vrátil stav cancelled a účet se do databáze neposlal. Když se to stane hned po výběru účtu, v Google Cloud chybí SHA-1 tohoto development buildu u balíčku com.jakub.dracidoupepjapp.',
        );
      }

      throw new Error(googleMessage(google, error.code));
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Google přihlášení se nepovedlo.');
  }
}
