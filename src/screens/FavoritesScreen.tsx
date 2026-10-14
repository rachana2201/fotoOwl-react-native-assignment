import { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ImageCard } from '../components/ImageCard';
import { SearchBar } from '../components/SearchBar';
import { MessageView } from '../components/StateView';
import { useDebounce } from '../hooks/useDebounce';
import { useThemedStyles } from '../hooks/useTheme';
import type { RootStackParamList } from '../navigation/types';
import { useFavoritesStore } from '../store/favoritesStore';
import type { Colors } from '../theme';
import type { ImageItem } from '../types';
import { applyImageQuery } from '../utils/imageQuery';

const factory = (c: Colors) => ({
  container: { flex: 1, backgroundColor: c.background },
  search: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, flexGrow: 1 },
});

export default function FavoritesScreen() {
  const styles = useThemedStyles(factory);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const favorites = useFavoritesStore((s) => s.items);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);

  const results = useMemo(
    () => applyImageQuery(favorites, { search: debounced, filter: 'all', sort: 'default' }),
    [favorites, debounced],
  );

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
        onToggleFavorite={toggleFavorite} // tapping the heart removes it from favorites
      />
    ),
    [favoriteIds, openDetails, toggleFavorite],
  );

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search favorites by author" />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          favorites.length === 0 ? (
            <MessageView icon="heart-outline" title="No favorites yet" message="Tap the heart on any image to save it here." />
          ) : (
            <MessageView icon="search-outline" title="No matches" message="No favorite matches that author name." />
          )
        }
      />
    </View>
  );
}
