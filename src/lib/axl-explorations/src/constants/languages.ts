// Shared language constants and types
export type Language = 'en' | 'te' | 'mr' | 'kn' | 'hi';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
];

// Content languages (for game content) - excludes Hindi as it's only for audio instructions
export const CONTENT_LANGUAGES: LanguageOption[] = LANGUAGES.filter(lang => lang.code !== 'hi');

// Audio languages (for audio instructions) - includes all languages
export const AUDIO_LANGUAGES: LanguageOption[] = LANGUAGES;

// Helper function to get language by code
export const getLanguageByCode = (code: Language): LanguageOption | undefined => {
  return LANGUAGES.find(lang => lang.code === code);
};

// Helper function to get language name
export const getLanguageName = (code: Language): string => {
  return getLanguageByCode(code)?.name || 'English';
};

// Helper function to get native language name
export const getNativeLanguageName = (code: Language): string => {
  return getLanguageByCode(code)?.nativeName || 'English';
};

// Helper function to get language flag
export const getLanguageFlag = (code: Language): string => {
  return getLanguageByCode(code)?.flag || '🇺🇸';
};
