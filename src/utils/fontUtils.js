import { getLocalData } from "./constants";

/**
 * Get the appropriate font family based on the current language
 * @param {string} lang - Language code (optional, will use localStorage if not provided)
 * @returns {string} Font family string
 */
export const getFontFamily = (lang = null) => {
  const currentLang = lang || getLocalData("lang") || "en";

  // Apply Sree Krushnadevaraya font for Telugu
  if (currentLang === "te") {
    return "Sree Krushnadevaraya, Quicksand, sans-serif";
  }

  // Default font for all other languages
  return "Quicksand, sans-serif";
};

/**
 * Get font family for a specific language code
 * @param {string} langCode - Language code (e.g., "te", "en", "ta", "kn", "hi")
 * @returns {string} Font family string
 */
export const getFontFamilyByLang = (langCode) => {
  if (!langCode) {
    return "Quicksand, sans-serif";
  }

  const normalizedLang = langCode.toLowerCase().trim();

  // Apply Sree Krushnadevaraya font for Telugu
  if (normalizedLang === "te") {
    return "Sree Krushnadevaraya, Quicksand, sans-serif";
  }

  // Default font for all other languages
  return "Quicksand, sans-serif";
};
