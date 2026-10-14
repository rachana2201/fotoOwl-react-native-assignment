import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { darkColors, lightColors, type Colors } from '../theme';

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);
  const colors = mode === 'dark' ? darkColors : lightColors;
  return { colors, isDark: mode === 'dark', toggleTheme: toggle };
}

/**
 * Build a StyleSheet from the current palette. Pass a factory defined at
 * module level so styles are only recomputed when the theme changes.
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: Colors) => T,
): T {
  const { colors } = useTheme();
  return useMemo(() => StyleSheet.create(factory(colors)), [colors, factory]);
}
