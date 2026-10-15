
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

type Props = {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
};

export function DownloadFeedbackModal({
  visible,
  type,
  title,
  message,
  onClose,
  onRetry,
}: Props) {
  const { colors, isDark } = useTheme();
  const success = type === 'success';

  const accent = success ? '#16A34A' : colors.danger;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close message"
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          accessibilityRole="alert"
          accessibilityLabel={`${title}. ${message}`}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: success ? '#DCFCE7' : '#FEE2E2' },
            ]}
          >
            <Ionicons
              name={success ? 'checkmark-circle' : 'alert-circle'}
              size={42}
              color={accent}
            />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {title}
          </Text>

          <Text style={[styles.message, { color: colors.textMuted }]}>
            {message}
          </Text>

          <View style={styles.actions}>
            {!success && onRetry && (
              <Pressable
                onPress={onRetry}
                style={[
                  styles.secondaryButton,
                  { borderColor: colors.border },
                ]}
                accessibilityRole="button"
              >
                <Text style={[styles.secondaryText, { color: colors.text }]}>
                  Try again
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={onClose}
              style={[styles.primaryButton, { backgroundColor: accent }]}
              accessibilityRole="button"
            >
              <Text style={styles.primaryText}>
                {success ? 'Done' : 'Close'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 26,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
