import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants';
import { getJSON, setJSON } from '../services/storage';
import type { ImageItem } from '../types';

interface FavoritesState {
  /** Email of the user these favorites belong to (favorites are per-user). */
  owner: string | null;
  items: ImageItem[];
  /** O(1) lookup used by every card to decide whether its heart is filled. */
  ids: Record<string, true>;
  load: (email: string) => Promise<void>;
  clear: () => void;
  toggle: (image: ImageItem) => void;
  remove: (id: string) => void;
}

const toIds = (items: ImageItem[]) =>
  items.reduce<Record<string, true>>((acc, i) => ((acc[i.id] = true), acc), {});

export const useFavoritesStore = create<FavoritesState>((set, get) => {
  /** Single place that updates state AND persists it. */
  const commit = (items: ImageItem[]) => {
    const { owner } = get();
    if (!owner) return;
    set({ items, ids: toIds(items) });
    setJSON(STORAGE_KEYS.favorites(owner), items).catch(() => {
      /* persistence failure should not break the UI */
    });
  };

  return {
    owner: null,
    items: [],
    ids: {},

    load: async (email) => {
      const items = await getJSON<ImageItem[]>(STORAGE_KEYS.favorites(email), []);
      set({ owner: email, items, ids: toIds(items) });
    },

    clear: () => set({ owner: null, items: [], ids: {} }),

    toggle: (image) => {
      const { items, ids } = get();
      commit(ids[image.id] ? items.filter((i) => i.id !== image.id) : [image, ...items]);
    },

    remove: (id) => commit(get().items.filter((i) => i.id !== id)),
  };
});
