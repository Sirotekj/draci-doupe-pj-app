import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  clearAccess,
  continueOffline,
  establishSession,
} from '@/features/access/access-store';
import { loginWithGoogle } from '@/features/access/google-login';
import { ModeNotice } from '@/features/access/mode-notice';
import { readStoredSession, writeStoredSession } from '@/features/access/session-storage';
import type { MobileSession } from '@/features/access/types';
import { colors } from '@/shared/theme/colors';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

export function IntroductionScreen() {
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSession, setSavedSession] = useState<MobileSession | null>(null);

  useEffect(() => {
    let mounted = true;

    void readStoredSession()
      .then((session) => {
        if (mounted) {
          setSavedSession(session);
        }
      })
      .catch(() => {
        if (mounted) {
          setSavedSession(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  function confirmNotice() {
    setNoticeOpen(false);
    router.replace('/combat');
  }

  function dismissNotice() {
    setNoticeOpen(false);
    clearAccess();
  }

  async function signIn() {
    if (pending) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const session = savedSession ?? (await loginWithGoogle());

      if (!session) {
        return;
      }

      await writeStoredSession(session);
      setSavedSession(session);
      establishSession(session);
      setNoticeOpen(true);
    } catch (signInError: unknown) {
      setError(
        signInError instanceof Error ? signInError.message : 'Přihlášení se nepovedlo.',
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center gap-4 bg-black p-medium">
      <Text className="text-center text-yellow">Vítej vypravěči!</Text>
      <Text className="text-white">
        Hle, před tebou nástroj, jenž ku pomoci tvé stvořen jest, aby útrapy
        dlouhých bojů zmírnil a v řád uvedl zástupy nestvůr i nepřátel.
      </Text>
      <Text className="text-white">
        Nechť ti dobře slouží, budiž věrným pomocníkem na tvých cestách a
        přispěj k tomu, aby dobrodružství ve světě tvém plynula snáze a
        radostněji.
      </Text>
      <Button
        disabled={pending}
        text={
          pending ? 'Přihlašuji…' : savedSession ? 'Pokračovat online' : 'Přihlásit'
        }
        onPress={() => {
          void signIn();
        }}
      />
      {error ? <Text className="text-center text-red">{error}</Text> : null}
      <Text className="text-center text-yellow">Pokračovat offline!</Text>
      <Text className="text-white">
        Můžeš pokračovat i bez spojení se vzdálenými archivy, avšak některé
        možnosti ti zůstanou odepřeny a k online bestiáři ani dalším sdíleným
        záznamům nebudeš mít přístup.
      </Text>
      <Button
        disabled={pending}
        text="Offline"
        onPress={() => {
          continueOffline();
          setNoticeOpen(true);
        }}
      />
      <Modal animationType="fade" onRequestClose={dismissNotice} transparent visible={noticeOpen}>
        <View
          className="flex-1 items-center justify-center p-medium"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.72)' }}
        >
          <View
            className="w-full gap-4 bg-black p-medium"
            style={{ borderColor: colors.yellow, borderRadius: 4, borderWidth: 1 }}
          >
            <ModeNotice />
            <Button text="OK" onPress={confirmNotice} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
