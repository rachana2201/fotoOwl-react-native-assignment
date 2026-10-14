import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import type { RegisterForm } from '../utils/validation';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
// expo-crypto is native; replace hashing with a deterministic stand-in
jest.mock('../services/security', () => ({
  hashPassword: async (email: string, password: string) =>
    'h' + [...`${email.toLowerCase()}:${password}`].map((c) => c.charCodeAt(0).toString(16)).join(''),
}));

const form: RegisterForm = {
  fullName: 'Asha Patil', email: 'Asha@Example.com', gender: 'Female', mobile: '9876543210',
  address: '12 MG Road', city: 'Pune', password: 'secret1', confirmPassword: 'secret1',
};

const reset = () => useAuthStore.setState({ user: null, isHydrated: false });

beforeEach(async () => {
  await AsyncStorage.clear();
  reset();
});

describe('auth flow', () => {
  it('registers, rejects duplicates and never stores the plain password', async () => {
    const { register } = useAuthStore.getState();
    await register(form);
    await expect(register({ ...form, email: 'asha@example.com' })).rejects.toThrow(/already exists/);

    const raw = await AsyncStorage.getItem('@picsum/users');
    expect(raw).not.toContain('secret1');
  });

  it('logs in with correct credentials (case-insensitive email) and rejects wrong ones', async () => {
    await useAuthStore.getState().register(form);

    await expect(useAuthStore.getState().login('asha@example.com', 'wrong!!')).rejects.toThrow(/invalid email or password/i);
    await expect(useAuthStore.getState().login('nobody@example.com', 'secret1')).rejects.toThrow(/invalid email or password/i);

    await useAuthStore.getState().login('ASHA@example.com', 'secret1');
    expect(useAuthStore.getState().user?.fullName).toBe('Asha Patil');
    expect((useAuthStore.getState().user as any).passwordHash).toBeUndefined();
  });

  it('persists the session across restarts and clears it on logout', async () => {
    await useAuthStore.getState().register(form);
    await useAuthStore.getState().login(form.email, form.password);

    reset(); // simulate app restart
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().user?.email).toBe('asha@example.com');
    expect(useAuthStore.getState().isHydrated).toBe(true);

    await useAuthStore.getState().logout();
    reset();
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('updates the profile and persists it', async () => {
    await useAuthStore.getState().register(form);
    await useAuthStore.getState().login(form.email, form.password);
    await useAuthStore.getState().updateProfile({ city: 'Nashik', avatarId: 'a3' });
    expect(useAuthStore.getState().user).toMatchObject({ city: 'Nashik', avatarId: 'a3' });

    reset();
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().user?.city).toBe('Nashik');
  });
});
