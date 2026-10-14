import { memo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '../hooks/useTheme';
import { radius } from '../theme';
import type { Colors } from '../theme';

interface Props {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const factory = (c: Colors) => ({
  wrapper: { marginBottom: 14 },
  label: { color: c.text, fontSize: 14, fontWeight: '600' as const, marginBottom: 6 },
  field: {
    height: 48,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: c.inputBg,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
  },
  fieldError: { borderColor: c.danger },
  value: { color: c.text, fontSize: 16 },
  placeholder: { color: c.textMuted, fontSize: 16 },
  error: { color: c.danger, fontSize: 12, marginTop: 4 },
  backdrop: { flex: 1, backgroundColor: c.overlay, justifyContent: 'center' as const, padding: 24 },
  sheet: { backgroundColor: c.surface, borderRadius: radius.lg, maxHeight: '70%' as const, overflow: 'hidden' as const },
  sheetTitle: { color: c.text, fontSize: 17, fontWeight: '700' as const, padding: 16, paddingBottom: 8 },
  item: { paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row' as const, justifyContent: 'space-between' as const },
  itemText: { color: c.text, fontSize: 16 },
  itemActive: { color: c.primary, fontWeight: '700' as const },
});

function DropdownComponent({ label, options, value, onChange, placeholder = 'Select', error }: Props) {
  const styles = useThemedStyles(factory);
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const select = (item: string) => {
    onChange(item);
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[styles.field, !!error && styles.fieldError]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || placeholder}`}
      >
        <Text style={value ? styles.value : styles.placeholder}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable style={styles.item} onPress={() => select(item)}>
                  <Text style={[styles.itemText, item === value && styles.itemActive]}>{item}</Text>
                  {item === value && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export const Dropdown = memo(DropdownComponent);
