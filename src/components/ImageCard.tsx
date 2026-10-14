import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '../hooks/useTheme';
import { thumbnailUrl } from '../services/imageApi';
import { radius } from '../theme';
import type { Colors } from '../theme';
import type { ImageItem } from '../types';

interface Props {
  image: ImageItem;
  isFavorite: boolean;
  onPress: (image: ImageItem) => void;
  onToggleFavorite: (image: ImageItem) => void;
}

const factory = (c: Colors) => ({
  card: {
    backgroundColor: c.surface,
    borderRadius: radius.lg,
    overflow: 'hidden' as const,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  image: { width: '100%' as const, aspectRatio: 3 / 2, backgroundColor: c.border },
  footer: { flexDirection: 'row' as const, alignItems: 'center' as const, padding: 12 },
  meta: { flex: 1 },
  author: { color: c.text, fontSize: 16, fontWeight: '700' as const },
  id: { color: c.textMuted, fontSize: 13, marginTop: 2 },
});

function ImageCardComponent({ image, isFavorite, onPress, onToggleFavorite }: Props) {
  const styles = useThemedStyles(factory);
  const { colors } = useTheme();

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(image)}
      accessibilityRole="button"
      accessibilityLabel={`Photo by ${image.author}, ID ${image.id}`}
    >
      <Image
        source={{ uri: thumbnailUrl(image) }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        recyclingKey={image.id}
      />
      <View style={styles.footer}>
        <View style={styles.meta}>
          <Text style={styles.author} numberOfLines={1}>
            {image.author}
          </Text>
          <Text style={styles.id}>ID: {image.id}</Text>
        </View>
        <Pressable
          onPress={() => onToggleFavorite(image)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={26}
            color={isFavorite ? colors.heart : colors.textMuted}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

// memo => only the card whose `isFavorite` changed re-renders when toggling
export const ImageCard = memo(ImageCardComponent);
