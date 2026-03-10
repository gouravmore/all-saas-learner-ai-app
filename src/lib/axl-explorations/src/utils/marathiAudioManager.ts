// Marathi Audio Manager for local .wav files
import { attachSlowLoadToast } from "./audioUtils";

export interface MarathiAudioConfig {
  audioFolderPath: string; // Path to audio folder
  fileExtension: string; // .wav, .mp3, etc.
}

class MarathiAudioManager {
  private config: MarathiAudioConfig = {
    audioFolderPath: '/audio/marathi/letter',
    fileExtension: '.wav'
  };

  // Get audio URL for a specific Marathi letter
  getAudioUrl(letter: string): string {
    // Clean the letter for filename (remove any special characters, keep only Devanagari)
    const cleanLetter = letter.replace(/[^\u0900-\u097F]/g, '');
    
    // Create filename: letter + extension
    const filename = `${cleanLetter}${this.config.fileExtension}`;
    
    // URL encode the filename to handle Marathi Unicode characters properly
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
      // Vowels (स्वर)
      'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः',
      // Consonants (व्यंजन)
      'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'ण',
      'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल',
      'ळ', 'व', 'श', 'ष', 'स', 'ह', 'क्ष', 'ज्ञ',
      // Common combinations with क
      'का', 'कि', 'की', 'कु', 'कू', 'कृ', 'के', 'कै', 'को', 'कौ', 'कं',
      // Common combinations with ग
      'गा', 'गि', 'गी', 'गु', 'गू', 'गृ', 'गे', 'गै', 'गो', 'गौ', 'गं',
      // Common combinations with त
      'ता', 'ति', 'ती', 'तु', 'तू', 'ते', 'तै', 'तो',
      // Common combinations with न
      'ना', 'नि', 'नी', 'नु', 'नू', 'ने', 'नै', 'नो',
      // Common combinations with म
      'मा', 'मि', 'मी', 'मु', 'मू', 'मे', 'मै', 'मो',
      // Common combinations with र
      'रा', 'री', 'रु', 'रू', 'रे', 'रो',
      // Common combinations with ल
      'ला', 'ली', 'लु', 'लू', 'ले', 'लो',
      // Common combinations with स
      'सा', 'सु', 'से',
      // Common combinations with व
      'वा',
      // Common combinations with य
      'या'
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
  configure(config: Partial<MarathiAudioConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Get current configuration
  getConfig(): MarathiAudioConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const marathiAudioManager = new MarathiAudioManager();

