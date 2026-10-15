import { STORAGE_KEYS } from "../constants";
import type { StoredUser, User } from "../types";
import type { RegisterForm } from "../utils/validation";
import { hashPassword } from "./security";
import { getJSON, getString, removeItem, setJSON, setString } from "./storage";

type UsersMap = Record<string, StoredUser>;

const normalise = (email: string) => email.trim().toLowerCase();

/** Strip the password hash before handing a user to the UI layer. */
const toPublicUser = ({ passwordHash: _omit, ...user }: StoredUser): User =>
  user;

const loadUsers = () => getJSON<UsersMap>(STORAGE_KEYS.USERS, {});

export async function registerUser(form: RegisterForm): Promise<void> {
  const users = await loadUsers();
  const key = normalise(form.email);
  if (users[key]) {
    throw new Error("An account with this email already exists");
  }

  users[key] = {
    fullName: form.fullName.trim(),
    email: key,
    gender: form.gender as StoredUser["gender"],
    mobile: form.mobile.trim(),
    address: form.address.trim(),
    city: form.city,
    passwordHash: await hashPassword(key, form.password),
  };
  await setJSON(STORAGE_KEYS.USERS, users);
}

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const users = await loadUsers();
  const key = normalise(email);
  const stored = users[key];
  const hash = await hashPassword(key, password);

  if (!stored || stored.passwordHash !== hash) {
    // Same message for both cases so we don't leak which emails are registered.
    throw new Error("Invalid email or password");
  }
  await setString(STORAGE_KEYS.SESSION, stored.email);
  return toPublicUser(stored);
}

export async function restoreSession(): Promise<User | null> {
  const email = await getString(STORAGE_KEYS.SESSION);
  if (!email) return null;
  const users = await loadUsers();
  const stored = users[normalise(email)];
  return stored ? toPublicUser(stored) : null;
}

export async function endSession(): Promise<void> {
  await removeItem(STORAGE_KEYS.SESSION);
}

export async function updateUserProfile(
  email: string,
  patch: Partial<Omit<User, "email">>,
): Promise<User> {
  const users = await loadUsers();
  const key = normalise(email);
  const existing = users[key];
  if (!existing) throw new Error("User not found");

  const updated: StoredUser = { ...existing, ...patch, email: existing.email };
  users[key] = updated;
  await setJSON(STORAGE_KEYS.USERS, users);
  return toPublicUser(updated);
}
