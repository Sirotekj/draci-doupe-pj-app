import { View } from 'react-native';

import { useAccess } from '@/features/access/access-store';
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
