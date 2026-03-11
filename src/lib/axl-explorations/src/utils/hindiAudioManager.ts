// Hindi Audio Manager for local .wav files
import { attachSlowLoadToast } from "./audioUtils";

export interface HindiAudioConfig {
  audioFolderPath: string; // Path to audio folder
  fileExtension: string; // .wav, .mp3, etc.
}

class HindiAudioManager {
  private config: HindiAudioConfig = {
    audioFolderPath: '/audio/hindi/letter',
    fileExtension: '.wav'
  };

  // Get audio URL for a specific Hindi letter
  getAudioUrl(letter: string): string {
    // Clean the letter for filename (remove any special characters, keep only Devanagari)
    const cleanLetter = letter.replace(/[^\u0900-\u097F]/g, '');
    
    // Create filename: letter + extension
    const filename = `${cleanLetter}${this.config.fileExtension}`;
    
    // URL encode the filename to handle Hindi Unicode characters properly
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

  // Configure audio settings
  configure(config: Partial<HindiAudioConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Get current configuration
  getConfig(): HindiAudioConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const hindiAudioManager = new HindiAudioManager();
