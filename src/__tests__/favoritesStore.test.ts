import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { useFavoritesStore } from '../store/favoritesStore';
import type { ImageItem } from '../types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const img = (id: string): ImageItem => ({ id, author: `Author ${id}`, width: 1, height: 1, url: '', download_url: '' });
const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(async () => {
  await AsyncStorage.clear();
  useFavoritesStore.getState().clear();
});

describe('favoritesStore', () => {
  it('ignores toggles until a user is loaded', () => {
    useFavoritesStore.getState().toggle(img('1'));
    expect(useFavoritesStore.getState().items).toHaveLength(0);
  });

  it('adds, removes and persists favorites', async () => {
    await useFavoritesStore.getState().load('a@b.com');
    useFavoritesStore.getState().toggle(img('1'));
    useFavoritesStore.getState().toggle(img('2'));
    expect(useFavoritesStore.getState().ids).toEqual({ 1: true, 2: true });

    useFavoritesStore.getState().toggle(img('1')); // un-favorite
    await flush();
    expect(useFavoritesStore.getState().items.map((i) => i.id)).toEqual(['2']);

    const saved = JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.favorites('a@b.com')))!);
    expect(saved.map((i: ImageItem) => i.id)).toEqual(['2']);
  });

  it('restores favorites after an app restart (re-load)', async () => {
    await useFavoritesStore.getState().load('a@b.com');
    useFavoritesStore.getState().toggle(img('7'));
    await flush();

    useFavoritesStore.getState().clear(); // simulate fresh launch
    await useFavoritesStore.getState().load('a@b.com');
    expect(useFavoritesStore.getState().ids['7']).toBe(true);
  });

  it('keeps favorites separate per user', async () => {
    await useFavoritesStore.getState().load('a@b.com');
    useFavoritesStore.getState().toggle(img('1'));
    await flush();

    await useFavoritesStore.getState().load('other@b.com');
    expect(useFavoritesStore.getState().items).toHaveLength(0);
  });
});
