import { router } from 'expo-router';
import { View } from 'react-native';

import { clearAccess, useAccess } from '@/features/access/access-store';
import { ModeNotice } from '@/features/access/mode-notice';
import { isSignedIn } from '@/features/access/types';
import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { Text } from '@/shared/ui/text';

export function ArchiveScreen() {
  const access = useAccess();
  const archiveOpen = isSignedIn(access);

  return (
    <Screen>
      <View className="gap-4 p-small">
        <ModeNotice />
        {archiveOpen ? (
          <Text className="text-white">Archive</Text>
        ) : (
          <Text className="text-white">
            Sdílený archiv se otevře jen v online režimu s přihlášeným účtem.
          </Text>
        )}
        <Button
          text="Zpět"
          onPress={() => {
            clearAccess();
            router.replace('/');
          }}
        />
      </View>
    </Screen>
  );
}
