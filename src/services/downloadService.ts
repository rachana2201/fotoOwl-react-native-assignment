import { Directory, File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library/legacy';
import type { ImageItem } from '../types';
import { fullImageUrl } from './imageApi';

export class DownloadError extends Error {}

/**
 * Downloads the full-size image to a temp file, then saves it into the
 * device gallery (Pictures / Photos). The temp file is always cleaned up.
 */
export async function downloadImageToGallery(image: ImageItem): Promise<void> {
  const permission = await MediaLibrary.requestPermissionsAsync(true); // write-only
  if (!permission.granted) {
    throw new DownloadError('Permission to save photos was denied. Enable it in Settings to download images.');
  }

  const destination = new File(new Directory(Paths.cache), `picsum-${image.id}.jpg`);
  try {
    const downloaded = await File.downloadFileAsync(fullImageUrl(image), destination, {
      idempotent: true,
    });
    await MediaLibrary.saveToLibraryAsync(downloaded.uri);
  } catch (e) {
    if (e instanceof DownloadError) throw e;
    throw new DownloadError('Could not download the image. Please check your connection and try again.');
  } finally {
    try {
      if (destination.exists) destination.delete();
    } catch {
      /* ignore cleanup errors */
    }
  }
}
