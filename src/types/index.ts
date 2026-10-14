export type Gender = 'Male' | 'Female' | 'Other';

export interface User {
  fullName: string;
  email: string;
  gender: Gender;
  mobile: string;
  address: string;
  city: string;
  avatarId?: string;
}

/** What is persisted for a registered user (password is stored hashed). */
export interface StoredUser extends User {
  passwordHash: string;
}

export interface ImageItem {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type FilterOption = 'all' | 'a-m' | 'n-z';
export type SortOption = 'default' | 'asc' | 'desc';

export interface ImageQuery {
  search: string;
  filter: FilterOption;
  sort: SortOption;
}
