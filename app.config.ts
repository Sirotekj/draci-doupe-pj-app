import type { ConfigContext } from 'expo/config';

const clientSuffix = '.apps.googleusercontent.com';

function reversedIosScheme(clientId: string | undefined) {
  if (!clientId?.endsWith(clientSuffix)) {
    return null;
  }

  return `com.googleusercontent.apps.${clientId.slice(0, -clientSuffix.length)}`;
}

export default ({ config }: ConfigContext) => {
  const plugins = (config.plugins ?? []).filter((plugin) => {
    return (
      plugin !== 'react-native-nitro-google-signin' && plugin !== 'expo-build-properties'
    );
  });
  const iosUrlScheme = reversedIosScheme(process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID);

  if (iosUrlScheme) {
    plugins.push(['react-native-nitro-google-signin', { iosUrlScheme }]);
  }

  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';

  if (apiUrl.startsWith('http://')) {
    plugins.push([
      'expo-build-properties',
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ]);
  }

  return {
    ...config,
    plugins,
  };
};
