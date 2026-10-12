import { View } from 'react-native';

import { useAccess } from '@/features/access/access-store';
import { isSignedIn } from '@/features/access/types';
import { Text } from '@/shared/ui/text';

export function ModeNotice() {
  const access = useAccess();

  if (!access) {
    return null;
  }

  if (access.mode === 'offline') {
    return (
      <View className="gap-1">
        <Text className="text-yellow">Offline</Text>
        <Text className="text-white">
          Pracuješ s místními záznamy. Vzdálený archiv je vypnutý.
        </Text>
      </View>
    );
  }

  if (isSignedIn(access)) {
    const label = access.user.name ?? access.user.email ?? 'Účet';

    return (
      <View className="gap-1">
        <Text className="text-yellow">Online</Text>
        <Text className="text-white">
          {label} · {access.user.role}
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-1">
      <Text className="text-yellow">Online</Text>
      <Text className="text-white">
        Přihlášení k účtu z webové aplikace ještě není připojené. Vzdálený archiv
        zůstává zavřený.
      </Text>
    </View>
  );
}
