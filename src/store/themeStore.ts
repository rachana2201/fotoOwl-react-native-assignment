import { Appearance } from 'react-native';
import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants';
import { getString, setString } from '../services/storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  hydrate: () => Promise<void>;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',

  hydrate: async () => {
    const saved = await getString(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') set({ mode: saved });
  },

  toggle: () => {
    const next: ThemeMode = get().mode === 'dark' ? 'light' : 'dark';
    set({ mode: next });
    setString(STORAGE_KEYS.THEME, next).catch(() => {});
  },
}));
