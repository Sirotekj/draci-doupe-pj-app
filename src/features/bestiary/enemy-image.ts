import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

const folderName = 'enemy-images';

function imageDirectory() {
  return new Directory(Paths.document, folderName);
}

function isStoredImage(uri: string) {
  const directoryUri = imageDirectory().uri.replace(/\/$/, '');
  return uri.startsWith(`${directoryUri}/`);
}

export async function storeEnemyImage(enemyId: string, sourceUri: string) {
  if (Platform.OS === 'web') {
    if (sourceUri.startsWith('data:')) {
      return sourceUri;
    }

    return readAsDataUrl(sourceUri);
  }

  const directory = imageDirectory();
  directory.create({ idempotent: true, intermediates: true });
  const destination = new File(
    directory,
    `${enemyId}-${Date.now().toString(36)}.jpg`,
  );
  const source = new File(sourceUri);
  await source.copy(destination);
  return destination.uri;
}

export function deleteEnemyImage(uri: string | null) {
  if (uri === null || Platform.OS === 'web' || !isStoredImage(uri)) {
    return;
  }

  try {
    const file = new File(uri);

    if (file.exists) {
      file.delete();
    }
  } catch (error: unknown) {
    console.error(error);
  }
}

function readAsDataUrl(uri: string) {
  return fetch(uri)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
              return;
            }

            reject(new Error('The image could not be read.'));
          };
          reader.onerror = () => {
            reject(reader.error ?? new Error('The image could not be read.'));
          };
          reader.readAsDataURL(blob);
        }),
    );
}
