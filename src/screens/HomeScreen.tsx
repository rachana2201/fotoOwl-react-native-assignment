import { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Chip } from '../components/Chip';
import { ImageCard } from '../components/ImageCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingView, MessageView } from '../components/StateView';
import { FILTER_OPTIONS, SORT_LABELS } from '../constants';
import { useGallery } from '../hooks/useGallery';
import { useTheme, useThemedStyles } from '../hooks/useTheme';
import type { RootStackParamList } from '../navigation/types';
import { useFavoritesStore } from '../store/favoritesStore';
import type { Colors } from '../theme';
import type { ImageItem } from '../types';

const factory = (c: Colors) => ({
  container: { flex: 1, backgroundColor: c.background },
  controls: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, gap: 10 },
  chips: { gap: 8, paddingRight: 8 },
  count: { color: c.textMuted, fontSize: 12, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, flexGrow: 1 },
  footer: { paddingVertical: 16 },
  banner: { backgroundColor: c.danger + '20', padding: 10, marginHorizontal: 16, borderRadius: 10, marginTop: 6 },
  bannerText: { color: c.danger, fontSize: 13 },
});

export default function HomeScreen() {
  const styles = useThemedStyles(factory);
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const g = useGallery();
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const openDetails = useCallback(
    (image: ImageItem) => navigation.navigate('Details', { image }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: ImageItem }) => (
      <ImageCard
        image={item}
        isFavorite={!!favoriteIds[item.id]}
        onPress={openDetails}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [favoriteIds, openDetails, toggleFavorite],
  );

  if (g.loading) return <LoadingView message="Loading images…" />;

  if (g.error && g.images.length === 0) {
    return (
      <MessageView
        icon="cloud-offline-outline"
        title="Couldn't load images"
        message={g.error}
        actionLabel="Try again"
        onAction={g.retry}
      />
    );
  }

  const isFiltering = g.debouncedSearch.trim() !== '' || g.filter !== 'all';

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <SearchBar value={g.search} onChangeText={g.setSearch} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} keyboardShouldPersistTaps="handled">
          {FILTER_OPTIONS.map((opt) => (
            <Chip key={opt.value} label={opt.label} selected={g.filter === opt.value} onPress={() => g.setFilter(opt.value)} />
          ))}
          <Chip label={SORT_LABELS[g.sort]} selected={g.sort !== 'default'} onPress={g.cycleSort} />
        </ScrollView>
        <Text style={styles.count}>
          Showing {g.visible.length} of {g.total}
          {g.hasMore ? '+' : ''} images
        </Text>
      </View>

      {!!g.error && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Refresh failed: {g.error}</Text>
        </View>
      )}

      <FlatList
        data={g.visible}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onEndReached={g.onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={g.refreshing} onRefresh={g.refresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
        ListFooterComponent={
          g.loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <MessageView
            icon="search-outline"
            title="No images found"
            message={isFiltering ? 'Try a different author name or filter.' : 'Pull down to refresh.'}
          />
        }
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
}
