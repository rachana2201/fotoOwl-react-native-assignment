import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { useThemedStyles } from '../hooks/useTheme';
import { radius } from '../theme';
import type { Colors } from '../theme';

interface Props {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

const factory = (c: Colors) => ({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  chipActive: { backgroundColor: c.primary, borderColor: c.primary },
  text: { color: c.text, fontSize: 13, fontWeight: '600' as const },
  textActive: { color: c.primaryText },
});

function ChipComponent({ label, selected, onPress }: Props) {
  const styles = useThemedStyles(factory);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
    >
      <Text style={[styles.text, selected && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

export const Chip = memo(ChipComponent);
