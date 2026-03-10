import pictureWordsData from "../data/pictureWordsData.json";

export type Language = 'en' | 'te' | 'mr' | 'kn';
export type ComplexityLevel = 'basic' | 'intermediate' | 'advanced' | 'expert' | 'master';

export interface PictureWord {
  image: string;
  word: string;
  category: string;
  ageGroup: string;
}

export interface PictureWordsData {
  metadata: {
    version: string;
    description: string;
    languages: string[];
    complexityLevels: string[];
    lastUpdated: string;
    validation: {
      rules: string[];
    };
  };
  questionTracking: {
    [key: string]: {
      usedQuestions: string[];
      levelQuestions: {
        [key: string]: string[];
      };
    };
  };
  questions: {
    [key: string]: {
      [key: string]: PictureWord[];
    };
  };
}

class PictureWordsDataLoader {
  private data: PictureWordsData;

  constructor() {
    this.data = pictureWordsData as PictureWordsData;
  }

  /**
   * Get picture words for a specific language and complexity level
   * Falls back to lower complexity levels if requested level is not available
   */
  getPictureWords(language: Language, complexity: ComplexityLevel): PictureWord[] {
    const langKey = language === 'en' ? 'en' : language;
    const complexityKey = complexity.toLowerCase() as ComplexityLevel;
    
    // Try to get words for the requested complexity
    if (this.data.questions[langKey] && this.data.questions[langKey][complexityKey]) {
      const words = this.data.questions[langKey][complexityKey];
      if (words && words.length > 0) {
        return words;
      }
    }
    
    // Fallback hierarchy: master -> expert -> advanced -> intermediate -> basic
    const fallbackOrder: ComplexityLevel[] = ['master', 'expert', 'advanced', 'intermediate', 'basic'];
    const startIndex = fallbackOrder.indexOf(complexityKey);
    
    // Try lower complexity levels
    for (let i = startIndex + 1; i < fallbackOrder.length; i++) {
      const fallbackLevel = fallbackOrder[i];
      if (this.data.questions[langKey] && this.data.questions[langKey][fallbackLevel]) {
        const words = this.data.questions[langKey][fallbackLevel];
        if (words && words.length > 0) {
          console.warn(`No picture words found for language: ${language}, complexity: ${complexity}. Using fallback: ${fallbackLevel}`);
          return words;
        }
      }
    }
    
    console.warn(`No picture words found for language: ${language}, complexity: ${complexity} (even after fallback)`);
    return [];
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
  getAvailableComplexityLevels(): ComplexityLevel[] {
    return this.data.metadata.complexityLevels as ComplexityLevel[];
  }

  /**
   * Get random picture words for a specific language and complexity level
   */
  getRandomPictureWords(
    language: Language, 
    complexity: ComplexityLevel, 
    count: number,
    usedQuestions: Set<string> = new Set()
  ): PictureWord[] {
    const allWords = this.getPictureWords(language, complexity);
    const availableWords = allWords.filter(word => !usedQuestions.has(word.word));
    
    if (availableWords.length === 0) {
      console.warn(`No available words for language: ${language}, complexity: ${complexity}`);
      return [];
    }

    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Generate picture word questions for the game
   */
  generatePictureWordQuestions(
    language: Language,
    level: number,
    complexity: string,
    count: number,
    usedQuestions: Set<string>
  ): Array<{
    target: { image: string; word: string; category: string };
    options: Array<{ image: string; word: string; category: string }>;
    complexity: string;
  }> {
    // Map level to complexity
    const complexityLevel = this.mapLevelToComplexity(level);
    const words = this.getRandomPictureWords(language, complexityLevel, count, usedQuestions);
    
    return words.map(word => ({
      target: {
        image: word.image,
        word: word.word,
        category: word.category
      },
      options: this.generateOptions(word, language, complexityLevel),
      complexity: complexity
    }));
  }

  /**
   * Map numeric level to complexity level
   */
  private mapLevelToComplexity(level: number): ComplexityLevel {
    if (level <= 2) return 'basic';
    if (level <= 4) return 'intermediate';
    if (level <= 6) return 'advanced';
    if (level <= 8) return 'expert';
    return 'master';
  }

  /**
   * Generate options for a picture word question
   */
  private generateOptions(
    targetWord: PictureWord, 
    language: Language, 
    complexity: ComplexityLevel
  ): Array<{ image: string; word: string; category: string }> {
    const allWords = this.getPictureWords(language, complexity);
    const options = [targetWord];
    
    // Add random options from the same category and complexity level
    const sameCategoryWords = allWords.filter(word => 
      word.category === targetWord.category && word.word !== targetWord.word
    );
    
    // Add words from different categories
    const differentCategoryWords = allWords.filter(word => 
      word.category !== targetWord.category
    );
    
    // Combine and shuffle
    const allOptions = [...sameCategoryWords, ...differentCategoryWords];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    
    // Add up to 3 more options
    for (let i = 0; i < Math.min(3, shuffled.length); i++) {
      if (!options.some(opt => opt.word === shuffled[i].word)) {
        options.push(shuffled[i]);
      }
    }
    
    // Shuffle final options
    return options.sort(() => Math.random() - 0.5);
  }

  /**
   * Get metadata about the data
   */
  getMetadata() {
    return this.data.metadata;
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language: string): language is Language {
    return this.data.metadata.languages.includes(language);
  }

  /**
   * Check if a complexity level is supported
   */
  isComplexitySupported(complexity: string): complexity is ComplexityLevel {
    return this.data.metadata.complexityLevels.includes(complexity);
  }
}

// Export singleton instance
export const pictureWordsDataLoader = new PictureWordsDataLoader();
