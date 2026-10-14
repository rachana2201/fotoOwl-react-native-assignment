import { ActivityIndicator, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '../hooks/useTheme';
import type { Colors } from '../theme';
import { Button } from './Button';

const factory = (c: Colors) => ({
  center: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, padding: 32, gap: 10 },
  title: { color: c.text, fontSize: 17, fontWeight: '700' as const, textAlign: 'center' as const },
  message: { color: c.textMuted, fontSize: 14, textAlign: 'center' as const },
});

export function LoadingView({ message = 'Loading…' }: { message?: string }) {
  const styles = useThemedStyles(factory);
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

interface MessageProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function MessageView({ icon, title, message, actionLabel, onAction }: MessageProps) {
  const styles = useThemedStyles(factory);
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && <Button title={actionLabel} onPress={onAction} style={{ marginTop: 8, minWidth: 140 }} />}
    </View>
  );
}
