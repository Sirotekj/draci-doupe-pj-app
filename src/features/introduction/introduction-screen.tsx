import { router } from 'expo-router';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function IntroductionScreen() {
  return (
    <SafeAreaView className="flex-1 p-medium justify-center gap-4 bg-black">
      <Text className="text-yellow text-center">Vítej vypravěči!</Text>
      <Text className="text-white">
        Hle, před tebou nástroj, jenž ku pomoci tvé stvořen jest, aby útrapy
        dlouhých bojů zmírnil a v řád uvedl zástupy nestvůr i nepřátel.
      </Text>
      <Text className="text-white">
        Nechť ti dobře slouží, budiž věrným pomocníkem na tvých cestách a
        přispěj k tomu, aby dobrodružství ve světě tvém plynula snáze a
        radostněji.
      </Text>
      <Button title="Přihlásit" onPress={() => router.replace('/combat')} />
      <Text className="text-yellow text-center">Pokračovat offline!</Text>
      <Text className="text-white">
        Můžeš pokračovat i bez spojení se vzdálenými archivy, avšak některé
        možnosti ti zůstanou odepřeny a k online bestiáři ani dalším sdíleným
        záznamům nebudeš mít přístup.
      </Text>
      <Button title="Offline" onPress={() => router.replace('/combat')} />
    </SafeAreaView>
  );
}
