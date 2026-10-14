import { useMemo, useState } from 'react';
import { SORT_CYCLE } from '../constants';
import type { FilterOption, ImageItem, SortOption } from '../types';
import { applyImageQuery } from '../utils/imageQuery';
import { useDebounce } from './useDebounce';

/** Search (debounced) + filter + sort over a list of images. */
export function useImageSearch(images: ImageItem[], debounceMs = 300) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sort, setSort] = useState<SortOption>('default');

  const debouncedSearch = useDebounce(search, debounceMs);

  const results = useMemo(
    () => applyImageQuery(images, { search: debouncedSearch, filter, sort }),
    [images, debouncedSearch, filter, sort],
  );

  const cycleSort = () =>
    setSort((prev) => SORT_CYCLE[(SORT_CYCLE.indexOf(prev) + 1) % SORT_CYCLE.length]);

  return { search, setSearch, filter, setFilter, sort, cycleSort, debouncedSearch, results };
}
