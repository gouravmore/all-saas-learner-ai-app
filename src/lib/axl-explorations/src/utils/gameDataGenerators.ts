// Adaptive game content generators based on difficulty level

export interface LetterQuestion {
  target: string;
  options: string[];
  audio: string;
  complexity: string;
}

export interface PhonemeQuestion {
  target: string;
  sound: string;
  options: string[];
  audio: string;
  complexity: string;
}

export interface SyllableQuestion {
  syllables: string[];
  target: string;
  audio: string;
  complexity: string;
}

export interface WordQuestion {
  target: string;
  options: Array<{ word: string; image: string }>;
  audio: string;
  complexity: string;
}

export interface SentenceQuestion {
  words: string[];
  target: string;
  audio: string;
  complexity: string;
}

export interface MemoryQuestion {
  sequence: string[];
  length: number;
  complexity: string;
}

// All letters A-Z for maximum variety
const ALL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Letter combinations by difficulty - determines pool size and complexity
const LETTER_SETS = {
  basic: ALL_LETTERS.slice(0, 10),        // A-J (10 letters)
  intermediate: ALL_LETTERS.slice(0, 16), // A-P (16 letters)  
  advanced: ALL_LETTERS.slice(0, 20),     // A-T (20 letters)
  expert: ALL_LETTERS.slice(0, 24),       // A-X (24 letters)
  master: ALL_LETTERS                     // A-Z (all 26 letters)
};

const CONFUSING_LETTERS = {
  'A': ['R', 'H', 'N', 'V'],
  'B': ['R', 'P', 'D', 'F'],
  'C': ['O', 'G', 'Q', 'U'],
  'D': ['B', 'O', 'P', 'Q'],
  'E': ['F', 'L', 'T', 'I'],
  'F': ['E', 'T', 'P', 'B'],
  'G': ['C', 'O', 'Q', 'S'],
  'H': ['A', 'N', 'M', 'U'],
  'I': ['J', 'L', 'T', 'E'],
  'J': ['I', 'G', 'Y', 'T'],
  'K': ['R', 'X', 'H', 'N'],
  'L': ['I', 'T', 'E', 'F'],
  'M': ['N', 'W', 'H', 'A'],
  'N': ['M', 'H', 'A', 'Z'],
  'O': ['C', 'G', 'Q', 'D'],
  'P': ['R', 'B', 'D', 'F'],
  'Q': ['O', 'C', 'G', 'D'],
  'R': ['A', 'P', 'B', 'K'],
  'S': ['G', 'C', 'Z', 'O'],
  'T': ['I', 'L', 'E', 'F'],
  'U': ['V', 'C', 'O', 'H'],
  'V': ['U', 'Y', 'A', 'W'],
  'W': ['M', 'V', 'Y', 'N'],
  'X': ['K', 'Y', 'Z', 'H'],
  'Y': ['V', 'J', 'X', 'W'],
  'Z': ['N', 'S', 'X', 'Y']
};

export function generateLetterQuestions(level: number, complexity: string, count: number = 10): LetterQuestion[] {
  const letterSet = LETTER_SETS[complexity as keyof typeof LETTER_SETS] || LETTER_SETS.basic;
  const questions: LetterQuestion[] = [];
  const usedTargets: string[] = [];

  // Create a shuffled version of the letter set for better randomization
  const shuffledLetterSet = [...letterSet].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    // Get a random target letter that hasn't been used yet
    let target: string;
    let attempts = 0;
    
    // First try to get an unused letter from shuffled set
    if (usedTargets.length < shuffledLetterSet.length) {
      target = shuffledLetterSet.find(letter => !usedTargets.includes(letter)) || shuffledLetterSet[0];
    } else {
      // If all letters used, pick randomly (allowing repeats for longer games)
      target = shuffledLetterSet[Math.floor(Math.random() * shuffledLetterSet.length)];
    }
    
    usedTargets.push(target);
    
    const confusingOptions = CONFUSING_LETTERS[target as keyof typeof CONFUSING_LETTERS] || [];
    let options = [target];
    
    // Add 2 confusing letters first (if available)
    const shuffledConfusing = [...confusingOptions].sort(() => Math.random() - 0.5);
    for (let j = 0; j < Math.min(2, shuffledConfusing.length); j++) {
      if (!options.includes(shuffledConfusing[j])) {
        options.push(shuffledConfusing[j]);
      }
    }
    
    // Fill remaining with random letters to always have exactly 4 options
    while (options.length < 4) {
      const randomLetter = letterSet[Math.floor(Math.random() * letterSet.length)];
      if (!options.includes(randomLetter)) {
        options.push(randomLetter);
      }
    }
    
    // Shuffle options to randomize position of correct answer
    options = options.sort(() => Math.random() - 0.5);
    
    questions.push({
      target,
      options,
      audio: `Find the letter ${target}`,
      complexity
    });
  }

  return questions;
}

// Phoneme data by complexity
const PHONEME_SETS = {
  basic: [
    { target: "क", sound: "/ka/" },
    { target: "म", sound: "/ma/" },
    { target: "त", sound: "/ta/" },
    { target: "न", sound: "/na/" }
  ],
  intermediate: [
    { target: "प", sound: "/pa/" },
    { target: "ब", sound: "/ba/" },
    { target: "च", sound: "/cha/" },
    { target: "ज", sound: "/ja/" },
    { target: "द", sound: "/da/" }
  ],
  advanced: [
    { target: "ख", sound: "/kha/" },
    { target: "घ", sound: "/gha/" },
    { target: "छ", sound: "/chha/" },
    { target: "झ", sound: "/jha/" },
    { target: "ध", sound: "/dha/" }
  ],
  expert: [
    { target: "फ", sound: "/pha/" },
    { target: "भ", sound: "/bha/" },
    { target: "थ", sound: "/tha/" },
    { target: "श", sound: "/sha/" }
  ],
  master: [
    { target: "ष", sound: "/shha/" },
    { target: "स", sound: "/sa/" },
    { target: "ह", sound: "/ha/" },
    { target: "क्ष", sound: "/ksha/" }
  ]
};

export function generatePhonemeQuestions(level: number, complexity: string, count: number = 10): PhonemeQuestion[] {
  const phonemeSet = PHONEME_SETS[complexity as keyof typeof PHONEME_SETS] || PHONEME_SETS.basic;
  const allPhonemes = Object.values(PHONEME_SETS).flat();
  const questions: PhonemeQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const targetPhoneme = phonemeSet[Math.floor(Math.random() * phonemeSet.length)];
    let options = [targetPhoneme.target];
    
    // Add similar looking/sounding phonemes
    while (options.length < Math.min(3 + level, 6)) {
      const randomPhoneme = allPhonemes[Math.floor(Math.random() * allPhonemes.length)];
      if (!options.includes(randomPhoneme.target)) {
        options.push(randomPhoneme.target);
      }
    }
    
    options = options.sort(() => Math.random() - 0.5);
    
    questions.push({
      target: targetPhoneme.target,
      sound: targetPhoneme.sound,
      options,
      audio: `Find the sound ${targetPhoneme.sound}`,
      complexity
    });
  }

  return questions;
}

// Word sets by complexity
const WORD_SETS = {
  basic: [
    { word: "cat", image: "🐱" },
    { word: "dog", image: "🐶" },
    { word: "sun", image: "☀️" },
    { word: "tree", image: "🌳" }
  ],
  intermediate: [
    { word: "house", image: "🏠" },
    { word: "flower", image: "🌸" },
    { word: "rainbow", image: "🌈" },
    { word: "butterfly", image: "🦋" }
  ],
  advanced: [
    { word: "elephant", image: "🐘" },
    { word: "mountain", image: "⛰️" },
    { word: "telescope", image: "🔭" },
    { word: "celebration", image: "🎉" }
  ],
  expert: [
    { word: "encyclopedia", image: "📚" },
    { word: "constellation", image: "✨" },
    { word: "democracy", image: "🗳️" },
    { word: "photosynthesis", image: "🌱" }
  ],
  master: [
    { word: "metamorphosis", image: "🦋" },
    { word: "paleontology", image: "🦕" },
    { word: "biodiversity", image: "🌍" },
    { word: "consciousness", image: "🧠" }
  ]
};

export function generateWordQuestions(level: number, complexity: string, count: number = 10): WordQuestion[] {
  const wordSet = WORD_SETS[complexity as keyof typeof WORD_SETS] || WORD_SETS.basic;
  const allWords = Object.values(WORD_SETS).flat();
  const questions: WordQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const target = wordSet[Math.floor(Math.random() * wordSet.length)];
    let options = [target];
    
    while (options.length < Math.min(3 + Math.floor(level/2), 6)) {
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
      if (!options.find(opt => opt.word === randomWord.word)) {
        options.push(randomWord);
      }
    }
    
    options = options.sort(() => Math.random() - 0.5);
    
    questions.push({
      target: target.word,
      options,
      audio: `Find the word "${target.word}"`,
      complexity
    });
  }

  return questions;
}

// Sentence complexity by level
const SENTENCE_SETS = {
  basic: [
    { words: ["I", "am", "happy"], target: "I am happy" },
    { words: ["The", "cat", "sleeps"], target: "The cat sleeps" },
    { words: ["We", "like", "books"], target: "We like books" }
  ],
  intermediate: [
    { words: ["The", "red", "car", "is", "fast"], target: "The red car is fast" },
    { words: ["She", "reads", "a", "good", "book"], target: "She reads a good book" },
    { words: ["My", "friend", "plays", "the", "piano"], target: "My friend plays the piano" }
  ],
  advanced: [
    { words: ["The", "intelligent", "student", "solved", "the", "difficult", "problem"], target: "The intelligent student solved the difficult problem" },
    { words: ["After", "dinner", "we", "watched", "a", "fascinating", "documentary"], target: "After dinner we watched a fascinating documentary" }
  ],
  expert: [
    { words: ["The", "magnificent", "orchestra", "performed", "beautifully", "at", "the", "concert", "hall"], target: "The magnificent orchestra performed beautifully at the concert hall" },
    { words: ["Scientists", "discovered", "an", "extraordinary", "species", "in", "the", "Amazon", "rainforest"], target: "Scientists discovered an extraordinary species in the Amazon rainforest" }
  ],
  master: [
    { words: ["The", "interdisciplinary", "research", "team", "collaborated", "extensively", "to", "develop", "innovative", "solutions"], target: "The interdisciplinary research team collaborated extensively to develop innovative solutions" }
  ]
};

export function generateSentenceQuestions(level: number, complexity: string, count: number = 10): SentenceQuestion[] {
  const sentenceSet = SENTENCE_SETS[complexity as keyof typeof SENTENCE_SETS] || SENTENCE_SETS.basic;
  const questions: SentenceQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const sentence = sentenceSet[Math.floor(Math.random() * sentenceSet.length)];
    const shuffledWords = [...sentence.words].sort(() => Math.random() - 0.5);
    
    questions.push({
      words: shuffledWords,
      target: sentence.target,
      audio: `Arrange these words to say "${sentence.target}"`,
      complexity
    });
  }

  return questions;
}

// Language-specific letters for memory sequences
const MEMORY_LANGUAGE_LETTERS = {
  en: ALL_LETTERS, // English A-Z
  te: [
    // Basic vowels
    'అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ',
    // Basic consonants
    'క', 'ఖ', 'గ', 'ఘ', 'చ', 'ఛ', 'జ', 'ఝ', 'ట', 'ఠ', 'డ', 'ఢ', 'ణ',
    'త', 'థ', 'ద', 'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య', 'ర', 'ల', 'వ', 'శ', 'ష', 'స', 'హ',
    // Matras (vowel signs) - most common combinations
    'కా', 'కి', 'కీ', 'కు', 'కూ', 'కె', 'కే', 'కై', 'కొ', 'కో', 'కౌ',
    'గా', 'గి', 'గీ', 'గు', 'గూ', 'గె', 'గే', 'గై', 'గొ', 'గో', 'గౌ',
    'చా', 'చి', 'చీ', 'చు', 'చూ', 'చె', 'చే', 'చై', 'చొ', 'చో', 'చౌ',
    'టా', 'టి', 'టీ', 'టు', 'టూ', 'టె', 'టే', 'టై', 'టొ', 'టో', 'టౌ',
    'తా', 'తి', 'తీ', 'తు', 'తూ', 'తె', 'తే', 'తై', 'తొ', 'తో', 'తౌ',
    // Compound letters (conjunct consonants)
    'క్క', 'చ్చ', 'ట్ట', 'త్త', 'ప్ప'
  ], // Telugu letters with matras
  mr: [
    // Basic vowels
    'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ',
    // Basic consonants
    'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह',
    // Matras (vowel signs) - most common combinations
    'का', 'कि', 'की', 'कु', 'कू', 'के', 'कै', 'को', 'कौ',
    'गा', 'गि', 'गी', 'गु', 'गू', 'गे', 'गै', 'गो', 'गौ',
    'चा', 'चि', 'ची', 'चु', 'चू', 'चे', 'चै', 'चो', 'चौ',
    'टा', 'टि', 'टी', 'टु', 'टू', 'टे', 'टै', 'टो', 'टौ',
    'ता', 'ति', 'ती', 'तु', 'तू', 'ते', 'तै', 'तो', 'तौ',
    // Compound letters (conjunct consonants)
    'क्क', 'च्च', 'ट्ट', 'त्त', 'प्प'
  ] // Marathi letters with matras
};

// Memory complexity sets per language
const MEMORY_COMPLEXITY_SETS = {
  en: {
    basic: ALL_LETTERS.slice(0, 8),        // A-H (8 letters)
    intermediate: ALL_LETTERS.slice(0, 12), // A-L (12 letters)  
    advanced: ALL_LETTERS.slice(0, 16),     // A-P (16 letters)
    expert: ALL_LETTERS.slice(0, 20),       // A-T (20 letters)
    master: ALL_LETTERS                     // A-Z (all 26 letters)
  },
  te: {
    basic: MEMORY_LANGUAGE_LETTERS.te.slice(0, 10),
    intermediate: MEMORY_LANGUAGE_LETTERS.te.slice(0, 15),
    advanced: MEMORY_LANGUAGE_LETTERS.te.slice(0, 20),
    expert: MEMORY_LANGUAGE_LETTERS.te.slice(0, 30),
    master: MEMORY_LANGUAGE_LETTERS.te
  },
  mr: {
    basic: MEMORY_LANGUAGE_LETTERS.mr.slice(0, 10),
    intermediate: MEMORY_LANGUAGE_LETTERS.mr.slice(0, 15),
    advanced: MEMORY_LANGUAGE_LETTERS.mr.slice(0, 20),
    expert: MEMORY_LANGUAGE_LETTERS.mr.slice(0, 30),
    master: MEMORY_LANGUAGE_LETTERS.mr
  }
};

export type Language = 'en' | 'te' | 'mr';

export interface MultilingualMemoryQuestion extends MemoryQuestion {
  language: Language;
  audioText: string;
  display: string;
}

export function generateMemorySequence(level: number, complexity: string): MemoryQuestion {
  const sequenceLength = Math.min(3 + Math.floor(level / 2), 5); // Capped at 5 letters
  const letterSet = LETTER_SETS[complexity as keyof typeof LETTER_SETS] || LETTER_SETS.basic;
  
  // Create a shuffled letter set for better variety
  const shuffledLetters = [...letterSet].sort(() => Math.random() - 0.5);
  
  const sequence: string[] = [];
  for (let i = 0; i < sequenceLength; i++) {
    // Use shuffled letters with some repetition allowed for longer sequences
    const letterIndex = i < shuffledLetters.length ? i : Math.floor(Math.random() * shuffledLetters.length);
    sequence.push(shuffledLetters[letterIndex]);
  }
  
  return {
    sequence,
    length: sequenceLength,
    complexity
  };
}

// Generate multilingual memory sequences
export function generateMemoryQuestions(
  language: Language, 
  level: number, 
  complexity: string, 
  count: number = 5
): MultilingualMemoryQuestion[] {
  const sequences: MultilingualMemoryQuestion[] = [];
  const usedSequenceIds = new Set<string>();
  
  // Get language-specific letter set
  const languageComplexitySets = MEMORY_COMPLEXITY_SETS[language] || MEMORY_COMPLEXITY_SETS.en;
  const letterSet = languageComplexitySets[complexity as keyof typeof languageComplexitySets] || languageComplexitySets.basic;
  
  // Dynamic sequence length based on level and language
  const baseLength = language === 'en' ? 3 : 2; // Start shorter for non-English
  const sequenceLength = Math.min(baseLength + Math.floor(level / 2), 5); // Capped at 5 letters for all languages
  
  for (let i = 0; i < count; i++) {
    let sequence: string[];
    let sequenceId: string;
    let attempts = 0;
    const maxAttempts = 50;
    
    // Generate unique sequences
    do {
      sequence = [];
      const shuffledLetters = [...letterSet].sort(() => Math.random() - 0.5);
      
      for (let j = 0; j < sequenceLength; j++) {
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
    const audioText = getMemoryAudioText(language, sequence);
    
    sequences.push({
      sequence,
      length: sequenceLength,
      complexity,
      language,
      audioText,
      display
    });
  }
  
  return sequences;
}

// Generate audio text for memory sequences based on language
function getMemoryAudioText(language: Language, sequence: string[]): string {
  switch (language) {
    case 'te':
      return `ఈ అక్షరాలను గుర్తుంచుకోండి: ${sequence.join(', ')}`;
    case 'mr':
      return `या अक्षरांची आठवण ठेवा: ${sequence.join(', ')}`;
    default:
      return `Remember these letters: ${sequence.join(', ')}`;
  }
}