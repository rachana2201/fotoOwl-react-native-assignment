import { Modal, Pressable, StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fullImageUrl } from '../services/imageApi';
import type { ImageItem } from '../types';

interface Props {
  image: ImageItem;
  visible: boolean;
  downloading: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function FullScreenViewer({ image, visible, downloading, onClose, onDownload }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <StatusBar hidden={visible} />
      <View style={styles.container}>
        <Image
          source={{ uri: fullImageUrl(image) }}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
        <Pressable
          style={[styles.btn, { top: insets.top + 12, right: 16 }]}
          onPress={onClose}
          accessibilityLabel="Close full screen"
        >
          <Ionicons name="close" size={26} color="#fff" />
        </Pressable>
        <Pressable
          style={[styles.btn, { bottom: insets.bottom + 24, alignSelf: 'center', width: 64, height: 64, borderRadius: 32 }]}
          onPress={onDownload}
          disabled={downloading}
          accessibilityLabel="Download image"
        >
          {downloading ? <ActivityIndicator color="#fff" /> : <Ionicons name="download-outline" size={30} color="#fff" />}
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  btn: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
