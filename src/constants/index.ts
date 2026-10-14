import type { FilterOption, Gender, SortOption } from '../types';

export const CITIES = [
  'Mumbai',
  'Pune',
  'Nashik',
  'Nagpur',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Other',
] as const;

export const GENDERS: Gender[] = ['Male', 'Female', 'Other'];

export const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All Images' },
  { value: 'a-m', label: 'Author A–M' },
  { value: 'n-z', label: 'Author N–Z' },
];

export const SORT_LABELS: Record<SortOption, string> = {
  default: 'Sort: Default',
  asc: 'Sort: A → Z',
  desc: 'Sort: Z → A',
};

export const SORT_CYCLE: SortOption[] = ['default', 'asc', 'desc'];

/** Predefined avatars (no network / assets needed). */
export const AVATARS = [
  { id: 'a1', emoji: '🦊', color: '#F59E0B' },
  { id: 'a2', emoji: '🐼', color: '#64748B' },
  { id: 'a3', emoji: '🦁', color: '#EAB308' },
  { id: 'a4', emoji: '🐙', color: '#EC4899' },
  { id: 'a5', emoji: '🦉', color: '#8B5CF6' },
  { id: 'a6', emoji: '🐬', color: '#0EA5E9' },
  { id: 'a7', emoji: '🐸', color: '#22C55E' },
  { id: 'a8', emoji: '🦄', color: '#F43F5E' },
] as const;

export const API = {
  BASE_URL: 'https://picsum.photos/v2/list',
  PAGE_SIZE_FROM_API: 50,
  /** How many cards are rendered initially / per scroll step. */
  VISIBLE_STEP: 10,
};

export const STORAGE_KEYS = {
  USERS: '@picsum/users',
  SESSION: '@picsum/session',
  THEME: '@picsum/theme',
  favorites: (email: string) => `@picsum/favorites/${email.toLowerCase()}`,
} as const;
