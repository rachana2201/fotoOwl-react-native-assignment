import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { downloadImageToGallery } from '../services/downloadService';
import type { ImageItem } from '../types';

export function useDownloadImage() {
  const [downloading, setDownloading] = useState(false);
  const busy = useRef(false);

  const download = useCallback(async (image: ImageItem) => {
    if (busy.current) return;
    busy.current = true;
    setDownloading(true);
    try {
      await downloadImageToGallery(image);
      Alert.alert('Saved', 'The image has been saved to your gallery.');
    } catch (e) {
      Alert.alert('Download failed', (e as Error).message);
    } finally {
      busy.current = false;
      setDownloading(false);
    }
  }, []);

  return { download, downloading };
}
