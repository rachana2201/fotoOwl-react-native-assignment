import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "./src/hooks/useTheme";
import RootNavigator from "./src/navigation/RootNavigator";
import { useAuthStore } from "./src/store/authStore";
import { useThemeStore } from "./src/store/themeStore";
export default function App() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const { isDark } = useTheme();

  // Restore persisted session + theme once on app start.
  useEffect(() => {
    hydrateTheme();
    hydrateAuth();
  }, [hydrateAuth, hydrateTheme]);

  return (
  <SafeAreaProvider>
    <StatusBar style={isDark ? 'light' : 'dark'} />
    <RootNavigator />
  </SafeAreaProvider>
);
}
