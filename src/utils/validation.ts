import type { Gender } from '../types';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export interface RegisterForm {
  fullName: string;
  email: string;
  gender: Gender | '';
  mobile: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface ProfileForm {
  fullName: string;
  gender: Gender | '';
  mobile: string;
  address: string;
  city: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DIGITS_ONLY = /^\d+$/;

export const MIN_PASSWORD_LENGTH = 6;
export const MOBILE_LENGTH = 10;

export const isRequired = (v: string) => v.trim().length > 0;
export const isValidEmail = (v: string) => EMAIL_REGEX.test(v.trim());
export const isNumeric = (v: string) => DIGITS_ONLY.test(v.trim());

function validateEmail(email: string): string | undefined {
  if (!isRequired(email)) return 'Email is required';
  if (!isValidEmail(email)) return 'Enter a valid email address';
}

function validateMobile(mobile: string): string | undefined {
  if (!isRequired(mobile)) return 'Mobile number is required';
  if (!isNumeric(mobile)) return 'Mobile number must contain digits only';
  if (mobile.trim().length !== MOBILE_LENGTH) {
    return `Mobile number must be exactly ${MOBILE_LENGTH} digits`;
  }
}

function validateProfileFields(
  form: Pick<ProfileForm, 'fullName' | 'gender' | 'mobile' | 'address' | 'city'>,
): FieldErrors<ProfileForm> {
  const errors: FieldErrors<ProfileForm> = {};
  if (!isRequired(form.fullName)) errors.fullName = 'Full name is required';
  if (!form.gender) errors.gender = 'Please select a gender';
  const mobileError = validateMobile(form.mobile);
  if (mobileError) errors.mobile = mobileError;
  if (!isRequired(form.address)) errors.address = 'Address is required';
  if (!form.city) errors.city = 'Please select a city';
  return errors;
}

export function validateRegister(form: RegisterForm): FieldErrors<RegisterForm> {
  const errors: FieldErrors<RegisterForm> = validateProfileFields(form);

  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
}

export function validateLogin(form: LoginForm): FieldErrors<LoginForm> {
  const errors: FieldErrors<LoginForm> = {};
  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;
  if (!form.password) errors.password = 'Password is required';
  return errors;
}

export function validateProfile(form: ProfileForm): FieldErrors<ProfileForm> {
  return validateProfileFields(form);
}
