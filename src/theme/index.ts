export interface Colors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  danger: string;
  heart: string;
  inputBg: string;
  overlay: string;
}

export const lightColors: Colors = {
  background: '#F4F6FA',
  surface: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  primary: '#4F46E5',
  primaryText: '#FFFFFF',
  danger: '#DC2626',
  heart: '#EF4444',
  inputBg: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',
};

export const darkColors: Colors = {
  background: '#0B0F19',
  surface: '#161B26',
  text: '#F3F4F6',
  textMuted: '#9CA3AF',
  border: '#2A3140',
  primary: '#818CF8',
  primaryText: '#0B0F19',
  danger: '#F87171',
  heart: '#F87171',
  inputBg: '#1D2433',
  overlay: 'rgba(0,0,0,0.7)',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };
