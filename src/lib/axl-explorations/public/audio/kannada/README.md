# Kannada Audio Files

This directory contains audio files for Kannada language support in the letter games.

## Directory Structure

```
kannada/
├── letter/           # Individual letter pronunciation files
│   ├── Level 1/      # Basic vowels: ಅ, ಆ, ಇ, ಈ, ಉ, ಊ, ಋ, ಎ, ಏ
│   ├── Level 2/      # Vowel modifiers and consonants: ಅಂ, ಅಃ, ಕ, ಖ, ಗ, ಘ, ಙ, ಚ, ಛ
│   ├── Level 3/      # Consonants: ತ, ಥ, ದ, ಧ, ನ, ಪ, ಫ, ಬ, ಭ
│   ├── Level 4/      # More consonants: ಹ, ಡ, ಢ, ಣ, ಟ, ಠ, ಡ, ಢ
│   ├── Level 5/      # Advanced consonants: ರ, ಫ, ಛ, etc.
│   ├── Level 6/      # Complex syllables: ಜ್ಞ, ರು, ಸ್ನು, ದು
│   ├── Level 7/      # Syllables with matras: ಳಿ, ಸಿ, ಡಿ, ಲ್ಲಿ, ಗಿ, ರೊ, ಸು, ಳು, ಮಾ
│   ├── Level 8/      # More syllables: ದಿ, ವು, ಡು, ವಾ, ಸು, ತಿ, ಗು, ನಿ, ತು
│   ├── Level 9/      # Advanced syllables: ನೆ, ಕಾ, ಕೆ, ಯಾ, ವಿ, ಲು, ಲಿ, ನಾ, ಕು
│   └── Level 10/     # Expert syllables: ಯಿ, ಹಾ, ರಾ, ತೆ, ದೆ, ಹೇ, ತ್ತು, ಕೊ, ಬಾ
└── README.md        # This file
```

## Audio File Naming Convention

- Each letter/syllable should have its own `.wav` file
- File names should match the exact Kannada character
- Example: `ಅ.wav`, `ಆ.wav`, `ಕ.wav`, `ಜ್ಞ.wav`

## Level-wise Content

### Level 1 (Basic Vowels)
- ಅ, ಆ, ಇ, ಈ, ಉ, ಊ, ಋ, ಎ, ಏ

### Level 2 (Vowel Modifiers + Basic Consonants)  
- ಅಂ, ಅಃ, ಕ, ಖ, ಗ, ಘ, ಙ, ಚ, ಛ

### Level 3 (Consonants)
- ತ, ಥ, ದ, ಧ, ನ, ಪ, ಫ, ಬ, ಭ

### Level 4 (More Consonants)
- ಹ, ಡ, ಢ, ಣ, ಟ, ಠ, ಡ, ಢ

### Level 5 (Advanced Consonants)
- ರ, ಫ, ಛ, etc.

### Level 6 (Complex Syllables)
- ಜ್ಞ, ರು, ಸ್ನು, ದು

### Level 7 (Syllables with Matras)
- ಳಿ, ಸಿ, ಡಿ, ಲ್ಲಿ, ಗಿ, ರೊ, ಸು, ಳು, ಮಾ

### Level 8 (More Syllables)
- ದಿ, ವು, ಡು, ವಾ, ಸು, ತಿ, ಗು, ನಿ, ತು

### Level 9 (Advanced Syllables)
- ನೆ, ಕಾ, ಕೆ, ಯಾ, ವಿ, ಲು, ಲಿ, ನಾ, ಕು

### Level 10 (Expert Syllables)
- ಯಿ, ಹಾ, ರಾ, ತೆ, ದೆ, ಹೇ, ತ್ತು, ಕೊ, ಬಾ

## Usage

These audio files are used by the Kannada audio manager to provide pronunciation support for letter games including:
- Letter Recognition Game
- Combined Letter Games (Letter Hunt, Quick Sight, Memory Challenge)

## Audio Quality Guidelines

- Format: WAV files
- Sample Rate: 44.1 kHz or 48 kHz
- Bit Depth: 16-bit or 24-bit
- Duration: 1-3 seconds per letter/syllable
- Clear pronunciation with native Kannada speaker
- Consistent volume levels across all files
