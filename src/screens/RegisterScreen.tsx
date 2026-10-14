import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FormLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Dropdown } from '../components/Dropdown';
import { Input } from '../components/Input';
import { RadioGroup } from '../components/RadioGroup';
import { CITIES, GENDERS } from '../constants';
import { useForm } from '../hooks/useForm';
import { useThemedStyles } from '../hooks/useTheme';
import type { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import type { Colors } from '../theme';
import { validateRegister, type RegisterForm } from '../utils/validation';

const INITIAL: RegisterForm = {
  fullName: '',
  email: '',
  gender: '',
  mobile: '',
  address: '',
  city: '',
  password: '',
  confirmPassword: '',
};

const factory = (c: Colors) => ({
  banner: {
    backgroundColor: c.danger + '20',
    borderColor: c.danger,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  bannerText: { color: c.danger, fontSize: 14 },
});

export default function RegisterScreen() {
  const styles = useThemedStyles(factory);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const register = useAuthStore((s) => s.register);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { values, errors, setValue, touch, handleSubmit } = useForm<RegisterForm>(INITIAL, validateRegister);

  const onSubmit = handleSubmit(async (form) => {
    setFormError('');
    setLoading(true);
    try {
      await register(form);
      Alert.alert('Account created', 'You can now log in with your credentials.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormLayout>
      {!!formError && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{formError}</Text>
        </View>
      )}

      <Input
        label="Full Name"
        value={values.fullName}
        onChangeText={(t) => setValue('fullName', t)}
        onBlur={() => touch('fullName')}
        error={errors.fullName}
        autoCapitalize="words"
        placeholder="Your full name"
      />
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
      <RadioGroup
        label="Gender"
        options={GENDERS}
        value={values.gender}
        onChange={(g) => {
          setValue('gender', g);
          touch('gender');
        }}
        error={errors.gender}
      />
      <Input
        label="Mobile Number"
        value={values.mobile}
        onChangeText={(t) => setValue('mobile', t.replace(/\s/g, ''))}
        onBlur={() => touch('mobile')}
        error={errors.mobile}
        keyboardType="phone-pad"
        maxLength={10}
        placeholder="10-digit mobile number"
      />
      <Input
        label="Address"
        value={values.address}
        onChangeText={(t) => setValue('address', t)}
        onBlur={() => touch('address')}
        error={errors.address}
        multiline
        placeholder="Street, area"
        style={{ height: 80, textAlignVertical: 'top', paddingTop: 12 }}
      />
      <Dropdown
        label="City"
        options={CITIES}
        value={values.city}
        onChange={(c) => {
          setValue('city', c);
          touch('city');
        }}
        placeholder="Select your city"
        error={errors.city}
      />
      <Input
        label="Password"
        value={values.password}
        onChangeText={(t) => setValue('password', t)}
        onBlur={() => touch('password')}
        error={errors.password}
        secure
        autoCapitalize="none"
        placeholder="Minimum 6 characters"
      />
      <Input
        label="Confirm Password"
        value={values.confirmPassword}
        onChangeText={(t) => setValue('confirmPassword', t)}
        onBlur={() => touch('confirmPassword')}
        error={errors.confirmPassword}
        secure
        autoCapitalize="none"
        placeholder="Re-enter password"
      />

      <Button title="Create Account" onPress={onSubmit} loading={loading} style={{ marginTop: 6 }} />
    </FormLayout>
  );
}
