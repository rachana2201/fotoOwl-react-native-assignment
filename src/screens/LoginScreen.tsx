import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FormLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useForm } from '../hooks/useForm';
import { useThemedStyles } from '../hooks/useTheme';
import type { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import type { Colors } from '../theme';
import { validateLogin, type LoginForm } from '../utils/validation';

const factory = (c: Colors) => ({
  title: { color: c.text, fontSize: 30, fontWeight: '800' as const, marginTop: 40 },
  subtitle: { color: c.textMuted, fontSize: 15, marginTop: 6, marginBottom: 28 },
  banner: {
    backgroundColor: c.danger + '20',
    borderColor: c.danger,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  bannerText: { color: c.danger, fontSize: 14 },
  footer: { flexDirection: 'row' as const, justifyContent: 'center' as const, marginTop: 20 },
  footerText: { color: c.textMuted, fontSize: 14 },
  link: { color: c.primary, fontSize: 14, fontWeight: '700' as const },
});

export default function LoginScreen() {
  const styles = useThemedStyles(factory);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { values, errors, setValue, touch, handleSubmit } = useForm<LoginForm>(
    { email: '', password: '' },
    validateLogin,
  );

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setFormError('');
    setLoading(true);
    try {
      await login(email, password); // on success the navigator swaps to the app stack
    } catch (e) {
      setFormError((e as Error).message);
      setLoading(false);
    }
  });

  return (
    <FormLayout topInset>
      <Text style={styles.title}>Welcome back 👋</Text>
      <Text style={styles.subtitle}>Log in to browse your gallery</Text>

      {!!formError && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{formError}</Text>
        </View>
      )}

      <Input
        label="Email Address"
        value={values.email}
        onChangeText={(t) => setValue('email', t)}
        onBlur={() => touch('email')}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        value={values.password}
        onChangeText={(t) => setValue('password', t)}
        onBlur={() => touch('password')}
        error={errors.password}
        secure
        autoCapitalize="none"
        placeholder="Your password"
        onSubmitEditing={onSubmit}
      />

      <Button title="Log In" onPress={onSubmit} loading={loading} style={{ marginTop: 6 }} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Register</Text>
        </Pressable>
      </View>
    </FormLayout>
  );
}
