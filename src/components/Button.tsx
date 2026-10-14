import { memo } from 'react';
import { ActivityIndicator, Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, useThemedStyles } from '../hooks/useTheme';
import { radius } from '../theme';
import type { Colors } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const factory = (c: Colors) => ({
  base: {
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
  },
  primary: { backgroundColor: c.primary },
  outline: { borderWidth: 1.5, borderColor: c.primary },
  danger: { borderWidth: 1.5, borderColor: c.danger },
  disabled: { opacity: 0.55 },
  text: { fontSize: 16, fontWeight: '600' as const },
});

function ButtonComponent({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const styles = useThemedStyles(factory);
  const { colors } = useTheme();
  const textColor =
    variant === 'primary' ? colors.primaryText : variant === 'danger' ? colors.danger : colors.primary;
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        inactive && styles.disabled,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export const Button = memo(ButtonComponent);
