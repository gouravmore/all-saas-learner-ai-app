// textUtils.js
import { doubleMetaphone } from "double-metaphone";
import Sanscript from "@indic-transliteration/sanscript";
import levenshtein from "fast-levenshtein";

/**
 * Transliterates Kannada text (in Unicode) to Latin.
 * Uses Sanscript with 'kannada' → 'iast' or 'itrans' scheme.
 */
export function transliterateKannadaToLatin(kannadaText) {
  return Sanscript.t(kannadaText, "kannada", "iast").toLowerCase();
}

/**
 * Compares two English (Latin) strings using Double Metaphone.
 * Returns primary codes and boolean match flag.
 */
export function compareWords(str1, str2) {
  // Step 1: Double Metaphone
  const [metaphone1] = doubleMetaphone(str1);
  const [metaphone2] = doubleMetaphone(str2);

  let similarity = 0;

  if (metaphone1 && metaphone2) {
    // Metaphone similarity (percentage)
    const maxLen = Math.max(metaphone1.length, metaphone2.length);
    const distance = levenshtein.get(metaphone1, metaphone2);
    similarity = Math.round(((maxLen - distance) / maxLen) * 100);
  }

  // Step 2: If similarity < 50, fallback to direct Levenshtein on original words
  if (similarity < 50) {
    const maxLen = Math.max(str1.length, str2.length);
    const distance = levenshtein.get(str1, str2);
    similarity = Math.round(((maxLen - distance) / maxLen) * 100);
  }

  return {
    metaphone1,
    metaphone2,
    similarity,
    isFine: similarity >= 50,
  };
}
