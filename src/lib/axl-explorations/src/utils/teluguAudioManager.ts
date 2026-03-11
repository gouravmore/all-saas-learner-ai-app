// Telugu Audio Manager for local .wav files
import { attachSlowLoadToast } from "./audioUtils";

export interface TeluguAudioConfig {
  audioFolderPath: string; // Path to audio folder
  fileExtension: string; // .wav, .mp3, etc.
}

class TeluguAudioManager {
  private config: TeluguAudioConfig = {
    audioFolderPath: '/audio/telugu/letter',
    fileExtension: '.wav'
  };

  // Get audio URL for a specific Telugu letter
  getAudioUrl(letter: string): string {
    // Clean the letter for filename (remove any special characters)
    const cleanLetter = letter.replace(/[^\u0C00-\u0C7F]/g, '');
    
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
    // This is a simple implementation - in a real app you might want to
    // maintain a list of available files or check the server
    const letters = [
      'అ', 'ఆ', 'ఉ', 'ఎ', 'ఏ', 'ఇ', 'ఒ', 'అం', 'ఈ', 'ఊ', 'ఓ',
      'ఐ', 'ఔ', 'ఋ', 'న', 'ల', 'క', 'ర', 'ప', 'త', 'ద',
      'మ', 'వ', 'డ', 'చ', 'గ', 'ట', 'స', 'య', 'బ', 'జ',
      'ష', 'శ', 'ళ', 'ణ', 'హ', 'ధ', 'భ', 'థ', 'ఠ', 'ఖ',
      'ఫ', 'ఘ', 'ఞ', 'ఛ', 'ఢ', 'ఝ', 'ఱ', 'లు', 'ని', 'ది',
      'ను', 'కు', 'లో', 'డి', 'రా', 'వా', 'గా', 'దా', 'రు', 'డు',
      'రి', 'గు', 'కా', 'చి', 'చేద', 'చె', 'పా', 'వియి', 'కి', 'దిు',
      'మా', 'లి', 'నా', 'వు', 'తో', 'న్నా', 'టి', 'పు', 'ము', 'సి',
      'యి', 'తి', 'నే', 'తా', 'తు', 'తె', 'పి', 'చూ', 'డా', 'కొ',
      'మీ', 'పో', 'సు', 'కిం', 'మై', 'కృ', 'గౌ'
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
  configure(config: Partial<TeluguAudioConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Get current configuration
  getConfig(): TeluguAudioConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const teluguAudioManager = new TeluguAudioManager();
