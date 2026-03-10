// JSON Data Loader for Memory Game
import memoryGameData from '../data/memoryGameData.json';

export type Language = 'en' | 'te' | 'mr' | 'kn' | 'hi';

export interface MemoryGameData {
  languages: {
    [key in Language]: {
      name: string;
      nativeName: string;
      flag: string;
      letters: {
        basic: string[];
        intermediate: string[];
        advanced: string[];
        expert: string[];
        master: string[];
      };
      levelLetters?: {
        [level: string]: string[];
      };
      confusingLetters: {
        [letter: string]: string[];
      };
      audioTexts: {
        instruction: string;
        correct: string;
        incorrect: string;
        replay: string;
      };
    };
  };
  gameSettings: {
    sequenceLengths: {
      basic: number;
      intermediate: number;
      advanced: number;
      expert: number;
      master: number;
    };
    displayTime: number;
    questionsPerSession: number;
    minScoreToAdvance: number;
  };
}

export interface MultilingualMemoryQuestion {
  sequence: string[];
  length: number;
  complexity: string;
  language: Language;
  audioText: string;
  display: string;
}

class MemoryGameDataLoader {
  private data: MemoryGameData;

  constructor() {
    this.data = memoryGameData as MemoryGameData;
  }

  // Get all available languages
  getLanguages(): Array<{ code: Language; name: string; nativeName: string; flag: string }> {
    return Object.entries(this.data.languages).map(([code, lang]) => ({
      code: code as Language,
      name: lang.name,
      nativeName: lang.nativeName,
      flag: lang.flag
    }));
  }

  // Get letters for specific language and complexity
  getLetters(language: Language, complexity: string): string[] {
    const langData = this.data.languages[language];
    if (!langData) return [];

    const complexityKey = complexity.toLowerCase() as keyof typeof langData.letters;
    return langData.letters[complexityKey] || langData.letters.basic;
  }

  // Get letters for specific language and exact level (for Telugu)
  getLettersByLevel(language: Language, level: string): string[] {
    let langData = this.data.languages[language];
    if (!langData) return [];

    // Check if levelLetters exists (for Telugu)
    if ('levelLetters' in langData && langData.levelLetters) {
      return langData.levelLetters[level] || [];
    }

    // Fallback to complexity mapping for other languages
    const levelNum = parseInt(level);
    if (levelNum <= 2) return langData.letters.basic;
    if (levelNum <= 4) return langData.letters.intermediate;
    if (levelNum <= 6) return langData.letters.advanced;
    if (levelNum <= 8) return langData.letters.expert;
    return langData.letters.master;
  }

  // Get confusing letters for a specific letter
  getConfusingLetters(language: Language, letter: string): string[] {
    const langData = this.data.languages[language];
    if (!langData) return [];

    return langData.confusingLetters[letter] || [];
  }

  // Get audio text for specific language
  getAudioText(language: Language, type: 'instruction' | 'correct' | 'incorrect' | 'replay'): string {
    const langData = this.data.languages[language];
    if (!langData) return '';

    return langData.audioTexts[type] || '';
  }

  // Get sequence length for complexity
  getSequenceLength(complexity: string): number {
    const complexityKey = complexity.toLowerCase() as keyof typeof this.data.gameSettings.sequenceLengths;
    return this.data.gameSettings.sequenceLengths[complexityKey] || 3;
  }

  // Get game settings
  getGameSettings() {
    return this.data.gameSettings;
  }

  // Generate memory sequences using JSON data
  generateMemoryQuestions(
    language: Language,
    level: number,
    complexity: string,
    count: number = 5
  ): MultilingualMemoryQuestion[] {
    const sequences: MultilingualMemoryQuestion[] = [];
    const usedSequenceIds = new Set<string>();
    
    // For Telugu, Kannada, and Marathi, use exact level mapping
    let letters: string[];
    if (language === 'te' || language === 'kn' || language === 'mr' || language === 'en' || language === 'hi') {
      const levelKey = level.toString();
      letters = this.getLettersByLevel(language, levelKey);
    } else {
      // For other languages, use complexity-based approach
      letters = this.getLetters(language, complexity);
    }
    
    const sequenceLength = this.getSequenceLength(complexity);
    
    // Dynamic sequence length based on level
    const baseLength = language === 'en' ? 3 : 2;
    const finalLength = Math.min(baseLength + Math.floor(level / 2), sequenceLength);
    
    for (let i = 0; i < count; i++) {
      let sequence: string[];
      let sequenceId: string;
      let attempts = 0;
      const maxAttempts = 50;
      
      // Generate unique sequences
      do {
        sequence = [];
        const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);
        
        for (let j = 0; j < finalLength; j++) {
          // Allow some repetition for longer sequences but prefer variety
          if (j < shuffledLetters.length) {
            sequence.push(shuffledLetters[j]);
          } else {
            sequence.push(shuffledLetters[Math.floor(Math.random() * shuffledLetters.length)]);
          }
        }
        
        sequenceId = sequence.join('-');
        attempts++;
      } while (usedSequenceIds.has(sequenceId) && attempts < maxAttempts);
      
      usedSequenceIds.add(sequenceId);
      
      // Create display format (space-separated)
      const display = sequence.join(' - ');
      
      // Create audio text based on language
      const instructionText = this.getAudioText(language, 'instruction');
      const audioText = `${instructionText} ${sequence.join(', ')}`;
      
      sequences.push({
        sequence,
        length: finalLength,
        complexity,
        language,
        audioText,
        display
      });
    }
    
    return sequences;
  }

  // Generate better wrong options using confusing letters
  generateWrongOptions(language: Language, correctSequence: string[]): string[] {
    const wrongOptions: string[] = [];
    const allLetters = this.getLetters(language, 'master');
    
    for (const correctLetter of correctSequence) {
      // Get confusing letters for this letter
      const confusingLetters = this.getConfusingLetters(language, correctLetter);
      
      if (confusingLetters.length > 0) {
        // Pick a random confusing letter
        const randomConfusing = confusingLetters[Math.floor(Math.random() * confusingLetters.length)];
        wrongOptions.push(randomConfusing);
      } else {
        // Fallback to random letter
        const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
        wrongOptions.push(randomLetter);
      }
    }
    
    return wrongOptions;
  }

  // Get all available letters for input selection
  getAllLetters(language: Language): string[] {
    const langData = this.data.languages[language];
    if (!langData) return [];

    // Combine all complexity levels
    return [
      ...langData.letters.basic,
      ...langData.letters.intermediate,
      ...langData.letters.advanced,
      ...langData.letters.expert,
      ...langData.letters.master
    ].filter((letter, index, array) => array.indexOf(letter) === index); // Remove duplicates
  }
}

// Export singleton instance
export const memoryGameDataLoader = new MemoryGameDataLoader();
