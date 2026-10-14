import { useCallback, useEffect, useState } from 'react';
import { API } from '../constants';
import { useImageSearch } from './useImageSearch';
import { usePaginatedImages } from './usePaginatedImages';

/**
 * Home screen brain. Composes:
 *   API (usePaginatedImages) -> search/filter/sort (useImageSearch) -> infinite scroll window.
 *
 * Infinite scrolling works in two layers:
 *  1. Only `visibleCount` of the matching images are rendered (10 at a time).
 *  2. When everything loaded is already visible, the next page is fetched from the API.
 */
export function useGallery() {
  const api = usePaginatedImages();
  const query = useImageSearch(api.images);
  const [visibleCount, setVisibleCount] = useState(API.VISIBLE_STEP);

  // New query => start from the first window again.
  useEffect(() => {
    setVisibleCount(API.VISIBLE_STEP);
  }, [query.debouncedSearch, query.filter, query.sort]);

  const total = query.results.length;
  const visible = query.results.slice(0, visibleCount);

  const onEndReached = useCallback(() => {
    if (visibleCount < total) {
      setVisibleCount((c) => c + API.VISIBLE_STEP);
    } else if (api.hasMore && !api.loadingMore && !api.loading && !api.refreshing) {
      api.loadMore();
    }
  }, [visibleCount, total, api]);

  const refresh = useCallback(() => {
    setVisibleCount(API.VISIBLE_STEP);
    api.refresh();
  }, [api]);

  return { ...query, ...api, visible, total, onEndReached, refresh };
}
