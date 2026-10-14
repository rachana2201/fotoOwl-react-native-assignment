import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, useThemedStyles } from '../hooks/useTheme';
import type { Colors } from '../theme';

interface Props<T extends string> {
  label: string;
  options: readonly T[];
  value: T | '';
  onChange: (value: T) => void;
  error?: string;
}

const factory = (c: Colors) => ({
  wrapper: { marginBottom: 14 },
  label: { color: c.text, fontSize: 14, fontWeight: '600' as const, marginBottom: 8 },
  row: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 18 },
  option: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: c.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  outerActive: { borderColor: c.primary },
  inner: { width: 11, height: 11, borderRadius: 6, backgroundColor: c.primary },
  optionText: { color: c.text, fontSize: 15 },
  error: { color: c.danger, fontSize: 12, marginTop: 4 },
});

function RadioGroupComponent<T extends string>({ label, options, value, onChange, error }: Props<T>) {
  const styles = useThemedStyles(factory);
  useTheme();
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row} accessibilityRole="radiogroup">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <Pressable
              key={opt}
              style={styles.option}
              onPress={() => onChange(opt)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              hitSlop={6}
            >
              <View style={[styles.outer, selected && styles.outerActive]}>
                {selected && <View style={styles.inner} />}
              </View>
              <Text style={styles.optionText}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export const RadioGroup = memo(RadioGroupComponent) as typeof RadioGroupComponent;
