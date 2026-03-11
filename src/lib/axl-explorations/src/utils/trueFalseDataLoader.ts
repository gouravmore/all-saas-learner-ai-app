import trueFalseData from '../data/trueFalseData.json';

export interface TrueFalseQuestion {
  statement: string;
  isTrue: boolean;
  explanation: string;
  language: 'en' | 'te' | 'mr' | 'kn';
}

export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced' | 'expert' | 'master';
export type Language = 'en' | 'te' | 'mr' | 'kn';

/**
 * Loads True/False questions from JSON data based on language and difficulty level
 * @param language - The language code ('en', 'te', 'mr')
 * @param difficulty - The difficulty level ('basic', 'intermediate', 'advanced', 'expert', 'master')
 * @param count - Number of questions to return (default: 10)
 * @param usedQuestions - Set of already used question statements to avoid repetition
 * @returns Array of TrueFalseQuestion objects
 */
export function loadTrueFalseQuestions(
  language: Language,
  difficulty: DifficultyLevel,
  count: number = 10,
  usedQuestions: Set<string> = new Set()
): TrueFalseQuestion[] {
  // Get questions for the specified language and difficulty
  const languageData = trueFalseData[language];
  if (!languageData) {
    console.warn(`No data found for language: ${language}`);
    return [];
  }

  // Check if the requested difficulty exists, if not, find the closest available difficulty
  let difficultyData = languageData[difficulty];
  if (!difficultyData) {
    console.warn(`No data found for difficulty: ${difficulty} in language: ${language}`);
    
    // Try to find the closest available difficulty
    const availableDifficulties = Object.keys(languageData) as DifficultyLevel[];
    console.log(`Available difficulties for ${language}:`, availableDifficulties);
    
    // Find the highest available difficulty
    const difficultyOrder: DifficultyLevel[] = ['basic', 'intermediate', 'advanced', 'expert', 'master'];
    let fallbackDifficulty: DifficultyLevel | null = null;
    
    for (let i = difficultyOrder.indexOf(difficulty); i >= 0; i--) {
      if (availableDifficulties.includes(difficultyOrder[i])) {
        fallbackDifficulty = difficultyOrder[i];
        break;
      }
    }
    
    if (fallbackDifficulty) {
      console.log(`Using fallback difficulty: ${fallbackDifficulty} for ${language}`);
      difficultyData = languageData[fallbackDifficulty];
    } else {
      console.error(`No suitable difficulty found for ${language}`);
      return [];
    }
  }

  // Filter out already used questions
  const availableQuestions = difficultyData.filter(q => !usedQuestions.has(q.statement));
  
  // If we don't have enough unused questions, reset the used questions set
  if (availableQuestions.length < count) {
    console.log(`Not enough unused questions for ${language}-${difficulty}, resetting used questions`);
    difficultyData.forEach(q => usedQuestions.delete(q.statement));
    availableQuestions.push(...difficultyData);
  }

  // Shuffle and select the requested number of questions
  const shuffledQuestions = [...availableQuestions].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffledQuestions.slice(0, count);

  // Add selected questions to used set
  selectedQuestions.forEach(q => usedQuestions.add(q.statement));

  // Add language property to each question
  return selectedQuestions.map(question => ({
    ...question,
    language
  }));
}

/**
 * Gets all available difficulty levels for a given language
 * @param language - The language code
 * @returns Array of available difficulty levels
 */
export function getAvailableDifficulties(language: Language): DifficultyLevel[] {
  const languageData = trueFalseData[language];
  if (!languageData) {
    return [];
  }
  
  return Object.keys(languageData) as DifficultyLevel[];
}

/**
 * Gets the total number of questions available for a language and difficulty
 * @param language - The language code
 * @param difficulty - The difficulty level
 * @returns Number of available questions
 */
export function getQuestionCount(language: Language, difficulty: DifficultyLevel): number {
  const languageData = trueFalseData[language];
  if (!languageData) {
    return 0;
  }

  const difficultyData = languageData[difficulty];
  if (!difficultyData) {
    return 0;
  }

  return difficultyData.length;
}

/**
 * Gets all available languages
 * @returns Array of available language codes
 */
export function getAvailableLanguages(): Language[] {
  return Object.keys(trueFalseData) as Language[];
}

/**
 * Validates if a language and difficulty combination exists
 * @param language - The language code
 * @param difficulty - The difficulty level
 * @returns True if the combination exists
 */
export function isValidLanguageDifficulty(language: Language, difficulty: DifficultyLevel): boolean {
  const languageData = trueFalseData[language];
  if (!languageData) {
    return false;
  }

  return difficulty in languageData;
}

/**
 * Gets a random question from a specific language and difficulty
 * @param language - The language code
 * @param difficulty - The difficulty level
 * @param usedQuestions - Set of already used question statements
 * @returns A single TrueFalseQuestion or null if none available
 */
export function getRandomQuestion(
  language: Language,
  difficulty: DifficultyLevel,
  usedQuestions: Set<string> = new Set()
): TrueFalseQuestion | null {
  const questions = loadTrueFalseQuestions(language, difficulty, 1, usedQuestions);
  return questions.length > 0 ? questions[0] : null;
}

/**
 * Resets the used questions set for a specific language and difficulty
 * @param language - The language code
 * @param difficulty - The difficulty level
 * @param usedQuestions - The used questions set to reset
 */
export function resetUsedQuestions(
  language: Language,
  difficulty: DifficultyLevel,
  usedQuestions: Set<string>
): void {
  const languageData = trueFalseData[language];
  if (!languageData) {
    return;
  }

  const difficultyData = languageData[difficulty];
  if (!difficultyData) {
    return;
  }

  // Remove all questions from this difficulty level from the used set
  difficultyData.forEach(q => usedQuestions.delete(q.statement));
}

/**
 * Gets statistics about available questions
 * @returns Object with question counts by language and difficulty
 */
export function getQuestionStatistics(): Record<Language, Record<DifficultyLevel, number>> {
  const stats: Record<Language, Record<DifficultyLevel, number>> = {} as any;
  
  Object.keys(trueFalseData).forEach(lang => {
    const language = lang as Language;
    stats[language] = {} as any;
    
    Object.keys(trueFalseData[language]).forEach(diff => {
      const difficulty = diff as DifficultyLevel;
      stats[language][difficulty] = getQuestionCount(language, difficulty);
    });
  });
  
  return stats;
}

