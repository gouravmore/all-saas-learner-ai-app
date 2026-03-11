// Kannada Audio Manager for local .wav files
import { attachSlowLoadToast } from "./audioUtils";

export interface KannadaAudioConfig {
  audioFolderPath: string; // Path to audio folder
  fileExtension: string; // .wav, .mp3, etc.
}

class KannadaAudioManager {
  private config: KannadaAudioConfig = {
    audioFolderPath: '/audio/kannada/letter',
    fileExtension: '.wav'
  };

  // Get audio URL for a specific Kannada letter
  getAudioUrl(letter: string): string {
    // Clean the letter for filename (remove any special characters)
    const cleanLetter = letter.replace(/[^\u0C80-\u0CFF]/g, '');
    
    // Create filename: letter + extension
    const filename = `${cleanLetter}${this.config.fileExtension}`;
    
    // URL encode the filename to handle Kannada Unicode characters properly
    const encodedFilename = encodeURIComponent(filename);
    
    // Return full URL path with proper encoding
    return `${this.config.audioFolderPath}/${encodedFilename}`;
  }

  // Check if audio file exists (basic check)
  async checkAudioExists(letter: string): Promise<boolean> {
    const audioUrl = this.getAudioUrl(letter);
    
    try {
      const response = await fetch(audioUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Play audio for a letter
  async playAudio(letter: string): Promise<boolean> {
    const audioUrl = this.getAudioUrl(letter);
    
    try {
      const audio = new Audio(audioUrl);
      attachSlowLoadToast(audio);
      await audio.play();
      return true;
    } catch (error) {
      console.warn(`Failed to play audio for letter ${letter}:`, error);
      return false;
    }
  }

  // Get all available audio files (for debugging)
  async getAvailableAudioFiles(): Promise<string[]> {
    // This is a simple implementation - in a real app you might want to
    // maintain a list of available files or check the server
    const letters = [
      // Level 1
      'ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ',
      // Level 2
      'ಅಂ', 'ಅಃ', 'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ', 'ಚ', 'ಛ',
      // Level 3
      'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ',
      // Level 4
      'ಹ', 'ಡ', 'ಢ', 'ಣ', 'ಟ', 'ಠ', 'ಡ', 'ಢ',
      // Level 5
      'ರ', 'ಫ', 'ಛ',
      // Level 6
      'ಜ್ಞ', 'ರು', 'ಸ್ನು', 'ದು',
      // Level 7
      'ಳಿ', 'ಸಿ', 'ಡಿ', 'ಲ್ಲಿ', 'ಗಿ', 'ರೊ', 'ಸು', 'ಳು', 'ಮಾ',
      // Level 8
      'ದಿ', 'ವು', 'ಡು', 'ವಾ', 'ಸು', 'ತಿ', 'ಗು', 'ನಿ', 'ತು',
      // Level 9
      'ನೆ', 'ಕಾ', 'ಕೆ', 'ಯಾ', 'ವಿ', 'ಲು', 'ಲಿ', 'ನಾ', 'ಕು',
      // Level 10
      'ಯಿ', 'ಹಾ', 'ರಾ', 'ತೆ', 'ದೆ', 'ಹೇ', 'ತ್ತು', 'ಕೊ', 'ಬಾ'
    ];

    const availableFiles: string[] = [];
    
    for (const letter of letters) {
      const exists = await this.checkAudioExists(letter);
      if (exists) {
        availableFiles.push(letter);
      }
    }
    
    return availableFiles;
  }

  // Configure audio settings
  configure(config: Partial<KannadaAudioConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Get current configuration
  getConfig(): KannadaAudioConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const kannadaAudioManager = new KannadaAudioManager();
