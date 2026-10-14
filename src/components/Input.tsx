import { memo, useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '../hooks/useTheme';
import { radius } from '../theme';
import type { Colors } from '../theme';

interface Props extends Omit<TextInputProps, 'onChange'> {
  label: string;
  error?: string;
  secure?: boolean;
  editable?: boolean;
}

const factory = (c: Colors) => ({
  wrapper: { marginBottom: 14 },
  label: { color: c.text, fontSize: 14, fontWeight: '600' as const, marginBottom: 6 },
  field: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: c.inputBg,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
  },
  fieldError: { borderColor: c.danger },
  fieldDisabled: { opacity: 0.6 },
  input: { flex: 1, height: 48, color: c.text, fontSize: 16 },
  error: { color: c.danger, fontSize: 12, marginTop: 4 },
});

function InputComponent({ label, error, secure, editable = true, style, ...rest }: Props) {
  const styles = useThemedStyles(factory);
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, !!error && styles.fieldError, !editable && styles.fieldDisabled]}>
        <TextInput
          {...rest}
          editable={editable}
          secureTextEntry={hidden}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          accessibilityLabel={label}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} accessibilityLabel="Toggle password visibility">
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export const Input = memo(InputComponent);
