import { create } from 'zustand';
import {
  endSession,
  loginUser,
  registerUser,
  restoreSession,
  updateUserProfile,
} from '../services/authService';
import type { User } from '../types';
import type { RegisterForm } from '../utils/validation';

interface AuthState {
  user: User | null;
  /** false until the persisted session has been read from AsyncStorage */
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  register: (form: RegisterForm) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Omit<User, 'email'>>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isHydrated: false,

  hydrate: async () => {
    try {
      const user = await restoreSession();
      set({ user, isHydrated: true });
    } catch {
      set({ user: null, isHydrated: true });
    }
  },

  register: async (form) => {
    await registerUser(form);
  },

  login: async (email, password) => {
    const user = await loginUser(email, password);
    set({ user });
  },

  logout: async () => {
    await endSession();
    set({ user: null });
  },

  updateProfile: async (patch) => {
    const current = get().user;
    if (!current) return;
    const updated = await updateUserProfile(current.email, patch);
    set({ user: updated }); // UI everywhere reflects the change immediately
  },
}));
