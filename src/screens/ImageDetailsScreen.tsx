import { useState } from 'react';
import { ScrollView, Share, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { FullScreenViewer } from '../components/FullScreenViewer';
import { useDownloadImage } from '../hooks/useDownloadImage';
import { useTheme, useThemedStyles } from '../hooks/useTheme';
import type { RootStackParamList } from '../navigation/types';
import { fullImageUrl } from '../services/imageApi';
import { useFavoritesStore } from '../store/favoritesStore';
import { radius, type Colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const factory = (c: Colors) => ({
  container: { flex: 1, backgroundColor: c.background },
  content: { padding: 16, gap: 16 },
  image: { width: '100%' as const, borderRadius: radius.lg, backgroundColor: c.border },
  hint: {
    position: 'absolute' as const,
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 8,
    borderRadius: 20,
  },
  card: { backgroundColor: c.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: c.border, padding: 16, gap: 12 },
  titleRow: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const },
  author: { color: c.text, fontSize: 20, fontWeight: '800' as const, flex: 1 },
  row: { flexDirection: 'row' as const, justifyContent: 'space-between' as const },
  label: { color: c.textMuted, fontSize: 14 },
  value: { color: c.text, fontSize: 14, fontWeight: '600' as const },
  actions: { flexDirection: 'row' as const, gap: 12 },
});

export default function ImageDetailsScreen({ route }: Props) {
  const { image } = route.params;
  const styles = useThemedStyles(factory);
  const { colors } = useTheme();
  const [fullScreen, setFullScreen] = useState(false);
  const { download, downloading } = useDownloadImage();

  const isFavorite = useFavoritesStore((s) => !!s.ids[image.id]);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const onShare = async () => {
    try {
      await Share.share({ message: `Photo by ${image.author} (ID ${image.id}): ${image.url}` });
    } catch {
      /* user cancelled or share unavailable */
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => setFullScreen(true)} accessibilityRole="imagebutton" accessibilityLabel="Open image full screen">
          <Image
            source={{ uri: fullImageUrl(image) }}
            style={[styles.image, { aspectRatio: image.width / image.height }]}
            contentFit="cover"
            transition={250}
            cachePolicy="memory-disk"
          />
          <View style={styles.hint}>
            <Ionicons name="expand-outline" size={20} color="#fff" />
          </View>
        </Pressable>

        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.author}>{image.author}</Text>
            <Pressable
              onPress={() => toggleFavorite(image)}
              hitSlop={12}
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorite ? colors.heart : colors.textMuted}
              />
            </Pressable>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Image ID</Text>
            <Text style={styles.value}>{image.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Original size</Text>
            <Text style={styles.value}>
              {image.width} × {image.height}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Download" onPress={() => download(image)} loading={downloading} style={{ flex: 1 }} />
          <Button title="Share" onPress={onShare} variant="outline" style={{ flex: 1 }} />
        </View>
      </ScrollView>

      <FullScreenViewer
        image={image}
        visible={fullScreen}
        downloading={downloading}
        onClose={() => setFullScreen(false)}
        onDownload={() => download(image)}
      />
    </View>
  );
}
