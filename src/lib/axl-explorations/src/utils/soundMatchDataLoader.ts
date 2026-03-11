import soundMatchData from '../data/soundMatchData.json';

// Types for the sound match game data
export interface SoundMatchItem {
  image: string;
  word: string;
  phoneme: string;
  category: string;
  difficulty: number;
}

export interface SoundMatchComplexityLevel {
  description: string;
  maxLevel: number;
  items: SoundMatchItem[];
}

export interface SoundMatchLanguage {
  name: string;
  nativeName: string;
  flag: string;
  complexityLevels: {
    basic: SoundMatchComplexityLevel;
    intermediate: SoundMatchComplexityLevel;
    advanced: SoundMatchComplexityLevel;
    expert: SoundMatchComplexityLevel;
    master: SoundMatchComplexityLevel;
  };
}

export interface SoundMatchData {
  metadata: {
    version: string;
    description: string;
    languages: string[];
    complexityLevels: string[];
    lastUpdated: string;
  };
  questionTracking: {
    en: {
      usedQuestions: string[];
      levelQuestions: {
        basic: string[];
        intermediate: string[];
        advanced: string[];
        expert: string[];
        master: string[];
      };
    };
    te: {
      usedQuestions: string[];
      levelQuestions: {
        basic: string[];
        intermediate: string[];
        advanced: string[];
        expert: string[];
        master: string[];
      };
    };
    kn: {
      usedQuestions: string[];
      levelQuestions: {
        basic: string[];
        intermediate: string[];
        advanced: string[];
        expert: string[];
        master: string[];
      };
    };
    mr: {
      usedQuestions: string[];
      levelQuestions: {
        basic: string[];
        intermediate: string[];
        advanced: string[];
        expert: string[];
        master: string[];
      };
    };
  };
  languages: {
    en: SoundMatchLanguage;
    te: SoundMatchLanguage;
    kn: SoundMatchLanguage;
    mr: SoundMatchLanguage;
  };
  gameSettings: {
    questionsPerGame: number;
    optionsPerQuestion: number;
    correctAnswersPerQuestion: number;
    maxAttemptsPerQuestion: number;
    timeLimitPerQuestion: number;
    audioSettings: {
      en: { lang: string; rate: number; pitch: number; volume: number };
      te: { lang: string; rate: number; pitch: number; volume: number };
      kn: { lang: string; rate: number; pitch: number; volume: number };
      mr: { lang: string; rate: number; pitch: number; volume: number };
    };
  };
  validation: {
    rules: string[];
    checks: {
      phonemeAccuracy: boolean;
      noDuplicates: boolean;
      imageWordMatching: boolean;
      questionGeneration: boolean;
      childAppropriate: boolean;
    };
  };
}

// Type for the question structure used in the game
export interface ROARPhonemeQuestion {
  target: {
    image: string;
    word: string;
    phoneme: string;
  };
  options: Array<{
    image: string;
    word: string;
    phoneme: string;
  }>;
  audio: string;
  complexity: string;
}

// Language type
export type Language = 'en' | 'te' | 'mr' | 'kn';

// Complexity type
export type Complexity = 'basic' | 'intermediate' | 'advanced' | 'expert' | 'master';

/**
 * Sound Match Data Loader
 * Provides utilities to load and work with sound match game data from JSON
 */
export class SoundMatchDataLoader {
  private data: SoundMatchData;

  constructor() {
    this.data = soundMatchData as unknown as SoundMatchData;
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): Language[] {
    return this.data.metadata.languages as Language[];
  }

  /**
   * Get all available complexity levels
   */
  getAvailableComplexityLevels(): Complexity[] {
    return this.data.metadata.complexityLevels as Complexity[];
  }

  /**
   * Get language-specific data
   */
  getLanguageData(language: Language): SoundMatchLanguage {
    return this.data.languages[language];
  }

  /**
   * Get items for a specific language and complexity level
   */
  getItemsForComplexity(language: Language, complexity: Complexity): SoundMatchItem[] {
    const languageData = this.getLanguageData(language);
    return languageData.complexityLevels[complexity].items;
  }

  /**
   * Get all items for a language (across all complexity levels)
   */
  getAllItemsForLanguage(language: Language): SoundMatchItem[] {
    const languageData = this.getLanguageData(language);
    const allItems: SoundMatchItem[] = [];
    
    Object.values(languageData.complexityLevels).forEach(level => {
      allItems.push(...level.items);
    });
    
    return allItems;
  }

  /**
   * Get audio settings for a language
   */
  getAudioSettings(language: Language) {
    return this.data.gameSettings.audioSettings[language];
  }

  /**
   * Get game settings
   */
  getGameSettings() {
    return this.data.gameSettings;
  }

  /**
   * Get validation rules
   */
  getValidationRules() {
    return this.data.validation;
  }

  /**
   * Find items that start with the same phoneme
   */
  findItemsWithSamePhoneme(language: Language, phoneme: string, excludeWords: string[] = []): SoundMatchItem[] {
    const allItems = this.getAllItemsForLanguage(language);
    return allItems.filter(item => 
      item.phoneme === phoneme && 
      !excludeWords.includes(item.word)
    );
  }

  /**
   * Find items with different phonemes (for distractors)
   */
  findItemsWithDifferentPhoneme(language: Language, phoneme: string, excludeWords: string[] = []): SoundMatchItem[] {
    const allItems = this.getAllItemsForLanguage(language);
    return allItems.filter(item => 
      item.phoneme !== phoneme && 
      !excludeWords.includes(item.word)
    );
  }

  /**
   * Get items by category
   */
  getItemsByCategory(language: Language, category: string): SoundMatchItem[] {
    const allItems = this.getAllItemsForLanguage(language);
    return allItems.filter(item => item.category === category);
  }

  /**
   * Get items by difficulty level
   */
  getItemsByDifficulty(language: Language, difficulty: number): SoundMatchItem[] {
    const allItems = this.getAllItemsForLanguage(language);
    return allItems.filter(item => item.difficulty === difficulty);
  }

  /**
   * Validate that a question structure is correct
   */
  validateQuestion(question: ROARPhonemeQuestion): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check if we have exactly 4 options
    if (question.options.length !== 4) {
      errors.push(`Question must have exactly 4 options, found ${question.options.length}`);
    }
    
    // Check if we have exactly 1 correct answer
    const correctAnswers = question.options.filter(opt => opt.phoneme === question.target.phoneme);
    if (correctAnswers.length !== 1) {
      errors.push(`Question must have exactly 1 correct answer, found ${correctAnswers.length}`);
    }
    
    // Check for duplicate words
    const words = [question.target.word, ...question.options.map(opt => opt.word)];
    const uniqueWords = new Set(words);
    if (uniqueWords.size !== words.length) {
      errors.push('Question contains duplicate words');
    }
    
    // Check for duplicate images
    const images = [question.target.image, ...question.options.map(opt => opt.image)];
    const uniqueImages = new Set(images);
    if (uniqueImages.size !== images.length) {
      errors.push('Question contains duplicate images');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get complexity level based on game level
   */
  getComplexityForLevel(level: number): Complexity {
    if (level <= 3) return 'basic';
    if (level <= 6) return 'intermediate';
    if (level <= 9) return 'advanced';
    if (level <= 12) return 'expert';
    return 'master';
  }

  /**
   * Get maximum level for a language
   */
  getMaxLevelForLanguage(language: Language): number {
    const languageData = this.getLanguageData(language);
    return Math.max(...Object.values(languageData.complexityLevels).map(level => level.maxLevel));
  }

  /**
   * Check if a level is valid for a language
   */
  isValidLevel(language: Language, level: number): boolean {
    const maxLevel = this.getMaxLevelForLanguage(language);
    return level >= 1 && level <= maxLevel;
  }

  /**
   * Get random items from a pool
   */
  getRandomItems(items: SoundMatchItem[], count: number): SoundMatchItem[] {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Filter items by used questions to avoid duplicates
   */
  filterUnusedItems(items: SoundMatchItem[], usedQuestions: Set<string>): SoundMatchItem[] {
    return items.filter(item => !usedQuestions.has(item.word));
  }

  /**
   * Get question tracking data for a language
   */
  getQuestionTracking(language: Language) {
    return this.data.questionTracking[language];
  }

  /**
   * Mark a question as used for a specific level
   */
  markQuestionAsUsed(language: Language, complexity: Complexity, word: string): void {
    const tracking = this.getQuestionTracking(language);
    
    // Add to used questions list
    if (!tracking.usedQuestions.includes(word)) {
      tracking.usedQuestions.push(word);
    }
    
    // Add to level-specific questions
    if (!tracking.levelQuestions[complexity].includes(word)) {
      tracking.levelQuestions[complexity].push(word);
    }
  }

  /**
   * Check if a question has been used in any level
   */
  isQuestionUsed(language: Language, word: string): boolean {
    const tracking = this.getQuestionTracking(language);
    return tracking.usedQuestions.includes(word);
  }

  /**
   * Check if a question has been used in a specific level
   */
  isQuestionUsedInLevel(language: Language, complexity: Complexity, word: string): boolean {
    const tracking = this.getQuestionTracking(language);
    return tracking.levelQuestions[complexity].includes(word);
  }

  /**
   * Get unused questions for a specific complexity level
   */
  getUnusedQuestionsForLevel(language: Language, complexity: Complexity): SoundMatchItem[] {
    const items = this.getItemsForComplexity(language, complexity);
    const tracking = this.getQuestionTracking(language);
    
    return items.filter(item => !tracking.levelQuestions[complexity].includes(item.word));
  }

  /**
   * Get unused questions across all levels for a language
   */
  getAllUnusedQuestions(language: Language): SoundMatchItem[] {
    const allItems = this.getAllItemsForLanguage(language);
    const tracking = this.getQuestionTracking(language);
    
    return allItems.filter(item => !tracking.usedQuestions.includes(item.word));
  }

  /**
   * Reset question tracking for a language (start fresh)
   */
  resetQuestionTracking(language: Language): void {
    const tracking = this.getQuestionTracking(language);
    tracking.usedQuestions = [];
    Object.keys(tracking.levelQuestions).forEach(level => {
      tracking.levelQuestions[level as Complexity] = [];
    });
  }

  /**
   * Get available questions count for a level
   */
  getAvailableQuestionsCount(language: Language, complexity: Complexity): number {
    const unused = this.getUnusedQuestionsForLevel(language, complexity);
    return unused.length;
  }

  /**
   * Check if there are enough questions available for a level
   */
  hasEnoughQuestions(language: Language, complexity: Complexity, requiredCount: number): boolean {
    return this.getAvailableQuestionsCount(language, complexity) >= requiredCount;
  }
}

// Export a singleton instance
export const soundMatchDataLoader = new SoundMatchDataLoader();

// Export the raw data for direct access if needed
export { soundMatchData };
