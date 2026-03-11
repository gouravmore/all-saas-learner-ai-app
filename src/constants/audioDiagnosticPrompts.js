/**
 * Multi-lingual audio prompts for audio diagnostic test
 * These prompts are used for children to listen and repeat
 */

export const AUDIO_DIAGNOSTIC_PROMPTS = {
  en: ["This is a cat", "It is a table"],
  hi: ["यह एक बिल्ली है", "यह एक मेज है"],
  ta: ["இது ஒரு பூனை", "இது ஒரு மேசை"],
  tn: ["இது ஒரு பூனை", "இது ஒரு மேசை"], // Tamil alternative code
  te: ["ఇది ఒక పిల్లి", "ఇది ఒక మేజ్"],
  ka: ["ಇದು ಒಂದು ಬೆಕ್ಕು", "ಇದು ಒಂದು ಮೇಜು"],
  kn: ["ಇದು ಒಂದು ಬೆಕ್ಕು", "ಇದು ಒಂದು ಮೇಜು"], // Kannada alternative code
};

/**
 * Get audio prompts for a specific language
 * @param {string} lang - Language code (en, hi, ta, tn, te, ka, kn, etc.)
 * @returns {string[]} Array of prompts for the language, defaults to English
 */
export const getAudioPromptsByLang = (lang) => {
  // Handle language code aliases
  const langMap = {
    tn: "ta", // Map tn to ta (Tamil)
    kn: "ka", // Map kn to ka (Kannada)
  };

  const mappedLang = langMap[lang] || lang;
  return AUDIO_DIAGNOSTIC_PROMPTS[mappedLang] || AUDIO_DIAGNOSTIC_PROMPTS.en;
};

/**
 * Get a random prompt for a specific language
 * @param {string} lang - Language code (en, hi, ta, te, ka, etc.)
 * @returns {string} A random prompt from the language-specific prompts
 */
export const getRandomAudioPrompt = (lang) => {
  const prompts = getAudioPromptsByLang(lang);
  return prompts[Math.floor(Math.random() * prompts.length)];
};
