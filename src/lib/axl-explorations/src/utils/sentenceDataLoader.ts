// JSON Data Loader for Sentence Game
import sentenceData from '../data/sentenceData.json';

export type Language = 'en' | 'te' | 'mr' | 'kn';

export interface SentenceData {
  words: string[];
  correct: string[];
}

export function loadSentenceData(language: Language, difficulty: string): SentenceData[] {
  const languageData = sentenceData[language];
  if (!languageData) {
    console.warn(`No data found for language: ${language}`);
    return [];
  }

  const difficultyData = languageData[difficulty];
  if (!difficultyData) {
    console.warn(`No data found for difficulty: ${difficulty} in language: ${language}`);
    return [];
  }

  return difficultyData;
}

export function getAvailableDifficulties(language: Language): string[] {
  const languageData = sentenceData[language];
  if (!languageData) {
    return [];
  }
  
  return Object.keys(languageData);
}

export function getAvailableLanguages(): Language[] {
  return Object.keys(sentenceData) as Language[];
}

export function getSentenceCount(language: Language, difficulty: string): number {
  const data = loadSentenceData(language, difficulty);
  return data.length;
}

export default sentenceData;
