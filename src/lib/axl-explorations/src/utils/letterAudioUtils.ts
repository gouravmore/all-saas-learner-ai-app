import { Language } from '../constants/languages';
import { englishAudioManager } from './englishAudioManager';
import { teluguAudioManager } from './teluguAudioManager';
import { kannadaAudioManager } from './kannadaAudioManager';
import { marathiAudioManager } from './marathiAudioManager';
import { hindiAudioManager } from './hindiAudioManager';
import { attachSlowLoadToast } from './audioUtils';

/**
 * Play audio for a letter in the specified language
 * @param letter - The letter to play audio for
 * @param language - The language to use for audio
 * @returns Promise that resolves when audio finishes playing
 */
export async function playLetterAudio(letter: string, language: Language): Promise<void> {
  return new Promise((resolve) => {
    let audioManager;
    
    switch (language) {
      case 'en':
        audioManager = englishAudioManager;
        break;
      case 'te':
        audioManager = teluguAudioManager;
        break;
      case 'kn':
        audioManager = kannadaAudioManager;
        break;
      case 'mr':
        audioManager = marathiAudioManager;
        break;
      case 'hi':
        audioManager = hindiAudioManager;
        break;
      default:
        audioManager = englishAudioManager;
    }
    
    const audioUrl = audioManager.getAudioUrl(letter);
    const audio = new Audio(audioUrl);
    attachSlowLoadToast(audio);
    
    audio.onloadeddata = () => {
      audio.play().then(() => {
        audio.onended = () => {
          resolve();
        };
      }).catch(() => {
        // Fallback to TTS if audio file doesn't exist
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.lang = language === 'te' ? 'te-IN' : 
                        language === 'kn' ? 'kn-IN' : 
                        language === 'mr' ? 'mr-IN' : 
                        language === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onend = () => {
          resolve();
        };
        
        speechSynthesis.speak(utterance);
      });
    };
    
    audio.onerror = () => {
      // Fallback to TTS if audio file doesn't exist
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = language === 'te' ? 'te-IN' : 
                      language === 'kn' ? 'kn-IN' : 
                      language === 'mr' ? 'mr-IN' : 
                      language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        resolve();
      };
      
      speechSynthesis.speak(utterance);
    };
  });
}
