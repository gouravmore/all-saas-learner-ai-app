// English Audio Manager for local .wav files
import { attachSlowLoadToast } from "./audioUtils";

export interface EnglishAudioConfig {
  audioFolderPath: string; // Path to audio folder
  fileExtension: string; // .wav, .mp3, etc.
}

class EnglishAudioManager {
  private config: EnglishAudioConfig = {
    audioFolderPath: '/audio/english/letter',
    fileExtension: '.wav'
  };

  // Get audio URL for a specific English letter
  getAudioUrl(letter: string): string {
    // Convert to uppercase for filename consistency
    const cleanLetter = letter.toUpperCase().trim();
    
    // Create filename: letter + extension
    const filename = `${cleanLetter}${this.config.fileExtension}`;
    
    // Return full URL path
    return `${this.config.audioFolderPath}/${filename}`;
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
    // English letters A-Z
    const letters = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z'
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
  configure(config: Partial<EnglishAudioConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Get current configuration
  getConfig(): EnglishAudioConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const englishAudioManager = new EnglishAudioManager();
