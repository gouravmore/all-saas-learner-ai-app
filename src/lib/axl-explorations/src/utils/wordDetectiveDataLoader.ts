// JSON Data Loader for Word Detective Game
import wordDetectiveData from '../data/wordDetectiveData.json';

export type Language = 'en' | 'te' | 'mr' | 'kn';

export interface WordDetectiveData {
  languages: {
    [key in Language]: {
      name: string;
      nativeName: string;
      flag: string;
      words: {
        basic: { real: string[]; fake: string[] };
        intermediate: { real: string[]; fake: string[] };
        advanced: { real: string[]; fake: string[] };
        expert: { real: string[]; fake: string[] };
        master: { real: string[]; fake: string[] };
      };
      audioTexts: {
        question: string;
        correct: string;
        incorrect: string;
        replay: string;
      };
    };
  };
  gameSettings: {
    questionsPerSession: number;
    minScoreToAdvance: number;
  };
}

export interface ROARWordQuestion {
  word: string;
  isReal: boolean;
  audio: string;
  complexity: string;
  language: Language;
}

class WordDetectiveDataLoader {
  private data: WordDetectiveData;

  constructor() {
    this.data = wordDetectiveData as WordDetectiveData;
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

  // Get words for specific language and complexity
  getWords(language: Language, complexity: string): { real: string[]; fake: string[] } {
    const langData = this.data.languages[language];
    if (!langData) return { real: [], fake: [] };

    const complexityKey = complexity.toLowerCase() as keyof typeof langData.words;
    return langData.words[complexityKey] || langData.words.basic;
  }

  // Get audio text for specific language
  getAudioText(language: Language, type: 'question' | 'correct' | 'incorrect' | 'replay'): string {
    const langData = this.data.languages[language];
    if (!langData) return '';

    return langData.audioTexts[type] || '';
  }

  // Get game settings
  getGameSettings() {
    return this.data.gameSettings;
  }

  // Generate word questions using JSON data
  generateWordQuestions(
    language: Language,
    level: number,
    complexity: string,
    count: number = 10,
    usedQuestions: Set<string> = new Set()
  ): ROARWordQuestion[] {
    const questions: ROARWordQuestion[] = [];
    const localUsedWords: string[] = [];
    
    // Get language-specific word sets
    const wordSets = this.getWords(language, complexity);
    const realWords = wordSets.real;
    const fakeWords = wordSets.fake;
    
    // Filter out words already used in this session
    const availableRealWords = realWords.filter(word => !usedQuestions.has(word));
    const availableFakeWords = fakeWords.filter(word => !usedQuestions.has(word));
    
    // Reset session cache if we've exhausted most words
    const totalAvailable = availableRealWords.length + availableFakeWords.length;
    if (totalAvailable < count) {
      console.log(`🔄 Resetting word cache for ${language} ${complexity} - only ${totalAvailable} fresh words remaining`);
      // Clear words from this specific complexity level
      realWords.forEach(word => usedQuestions.delete(word));
      fakeWords.forEach(word => usedQuestions.delete(word));
      // Refresh available words
      availableRealWords.push(...realWords);
      availableFakeWords.push(...fakeWords);
    }
    
    const actualCount = Math.min(count, availableRealWords.length + availableFakeWords.length);
    console.log(`🎮 Generating ${actualCount} UNIQUE child-friendly questions for ${language} level ${level} (${complexity})`);

    for (let i = 0; i < actualCount; i++) {
      // Alternate between real and fake words
      const isReal = i % 2 === 0;
      const wordPool = isReal ? availableRealWords : availableFakeWords;
      
      // Filter out words already used in this question set
      const unusedWords = wordPool.filter(word => !localUsedWords.includes(word));
      
      if (unusedWords.length === 0) {
        console.warn(`⚠️ No more ${isReal ? 'real' : 'fake'} words available for ${language} ${complexity}`);
        break;
      }
      
      // Pick a random word from unused words
      const randomIndex = Math.floor(Math.random() * unusedWords.length);
      const word = unusedWords[randomIndex];
      
      // Track usage
      localUsedWords.push(word);
      usedQuestions.add(word); // Add to session cache
      
      // Create audio text
      const questionTemplate = this.getAudioText(language, 'question');
      const audio = questionTemplate.replace('{word}', word);
      
      questions.push({
        word,
        isReal,
        audio,
        complexity,
        language
      });
    }

    // Shuffle questions to randomize real/fake order
    return questions.sort(() => Math.random() - 0.5);
  }
}

// Export singleton instance
export const wordDetectiveDataLoader = new WordDetectiveDataLoader();
