// Audio utility functions for game narrations
import { Language } from "../constants/languages";
import { toast } from "../hooks/use-toast";
import { WifiOff } from 'lucide-react';
import React from 'react';

const AUDIO_LANGUAGE_STORAGE_KEY = 'selectedAudioLanguage';
const VALID_LANGUAGES: Language[] = ['en', 'te', 'mr', 'kn', 'hi'];

interface PlaybackOptions {
  exactLanguage?: boolean;
}

const resolveAudioLanguage = (language?: Language): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(AUDIO_LANGUAGE_STORAGE_KEY) as Language | null;
    if (stored && VALID_LANGUAGES.includes(stored)) {
      return stored;
    }
  }

  if (language && VALID_LANGUAGES.includes(language)) {
    return language;
  }

  return 'en';
};

// Track all audio instances created with new Audio()
const activeAudioInstances: Set<HTMLAudioElement> = new Set();

// Simple flag to prevent TTS after audio stop
let audioStopped = false;

/**
 * Helper function to show the "No Internet Connection" toast with icon
 */
const showSlowLoadToast = () => {
  const toastInstance = toast({
    title: React.createElement(
      'div',
      { className: 'flex items-center gap-2' },
      React.createElement(WifiOff, { 
        className: 'h-5 w-5 flex-shrink-0',
      }),
      React.createElement('span', { 
        style: { 
          fontFamily: 'sans-serif',
          fontWeight: 1200,
          fontStyle: 'normal',
          fontSize: '16px',
          lineHeight: '100%',
          letterSpacing: '0%',
          color: '#484848'
        }
      }, 'No Internet Connection')
    ),
    description: React.createElement('span', {
      style: { 
        fontFamily: 'sans-serif',
        fontWeight: 400,
        fontStyle: 'normal',
        fontSize: '14px',
        lineHeight: '100%',
        letterSpacing: '0%',
        color: '#484848'
      }
    }, 'Audio is taking longer than expected to load..'),
    variant: 'default',
    style: {
      backgroundColor: '#FFE6D4',
      border: '5px solid #FF6900',
      color: '#484848'
    }
  } as any);

  // Auto-dismiss after 2.5 seconds
  setTimeout(() => {
    toastInstance.dismiss();
  }, 2500);
};

/**
 * Attach a 1-second timeout toast to an HTMLAudioElement.
 * Shows a "Check internet connection" message if audio hasn't loaded or started within the timeout.
 */
export const attachSlowLoadToast = (audio: HTMLAudioElement, timeoutMs: number = 1000) => {
  if (typeof window === 'undefined') return;

  let audioLoaded = false;
  let audioStarted = false;
  let timeoutId: number | undefined;

  const clear = () => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  timeoutId = window.setTimeout(() => {
    if (!audioLoaded && !audioStarted) {
      showSlowLoadToast();
    }
  }, timeoutMs);

  audio.addEventListener('loadeddata', () => {
    audioLoaded = true;
    clear();
  });

  audio.addEventListener('play', () => {
    audioStarted = true;
    clear();
  });

  audio.addEventListener('error', clear);
  audio.addEventListener('ended', clear);
};

// Track audio instance
export const trackAudio = (audio: HTMLAudioElement): void => {
  activeAudioInstances.add(audio);
  
  // Remove from tracking when audio ends or errors
  const cleanup = () => {
    activeAudioInstances.delete(audio);
  };
  
  audio.addEventListener('ended', cleanup);
  audio.addEventListener('error', cleanup);
};

// Check if audio was stopped
export const isAudioStopped = () => audioStopped;

export interface AudioConfig {
  gameName: string;
  subGame?: string;
  language: Language;
  type: 'introduction' | 'narration';
  step?: number;
}

/**
 * Get the audio file path for a given configuration
 */
export const getAudioPath = (config: AudioConfig): string => {
  const { gameName, subGame, language, type, step } = config;
  
  // Map game names to folder names
  const gameFolderMap: Record<string, string> = {
    'Combined Letter Games': 'combined-letter-games',
    'Combined Word Games': 'combined-word-games',
    'Combined Sentence Games': 'combined-sentence-games',
    'Letter Recognition': 'standalone-games/letter-recognition',
    'Memory Challenge': 'standalone-games/memory-challenge',
    'Fill in the Blanks': 'standalone-games/fill-in-the-blanks',
    'Sentence Builder': 'standalone-games/sentence-builder',
    'Word Detective': 'standalone-games/word-detective',
    'Sound Match': 'standalone-games/sound-match',
    'Picture Words': 'standalone-games/picture-words',
    'True or False': 'standalone-games/true-or-false',
    'ROAR Rapid Visual': 'standalone-games/roar-rapid-visual'
  };

  // Map sub-game names to folder names
  const subGameFolderMap: Record<string, string> = {
    'Letter Hunt': 'letter-hunt',
    'Quick Sight': 'quick-sight',
    'Memory Challenge': 'memory-challenge',
    'Word Detective': 'word-detective',
    'Sound Match': 'sound-match',
    'Picture Words': 'picture-words',
    'Sentence Builder': 'sentence-builder',
    'Fill in Blanks': 'fill-in-blanks',
    'True or False': 'true-or-false'
  };

  const gameFolder = gameFolderMap[gameName] || gameName.toLowerCase().replace(/\s+/g, '-');
  const subGameFolder = subGame ? subGameFolderMap[subGame] || subGame.toLowerCase().replace(/\s+/g, '-') : '';
  
  if (type === 'introduction') {
    return `/audio/audio-preview/${gameFolder}/introduction/${language}/introduction.wav`;
  } else if (type === 'narration' && step) {
    return `/audio/audio-preview/${gameFolder}/${subGameFolder}/${language}/narration${step}.wav`;
  }
  
  throw new Error(`Invalid audio configuration: ${JSON.stringify(config)}`);
};

/**
 * Play audio file with fallback to TTS
 */
export const playAudio = async (
  config: AudioConfig,
  fallbackText?: string
): Promise<void> => {
  const resolvedLanguage = resolveAudioLanguage(config.language);
  const effectiveConfig: AudioConfig = {
    ...config,
    language: resolvedLanguage,
  };

  return new Promise((resolve) => {
    // Flags to track loading state
    let audioLoaded = false;
    let audioStarted = false;
    let slowLoadTimeout: number | undefined;

    try {
      const audioPath = getAudioPath(effectiveConfig);
      const audio = new Audio(audioPath);
      
      // Track this audio instance
      trackAudio(audio);

      // Show message if audio takes too long to preload (1 second)
      slowLoadTimeout = window.setTimeout(() => {
        if (!audioLoaded && !audioStarted) {
          showSlowLoadToast();
        }
      }, 1000);
      
      audio.onloadeddata = () => {
        audioLoaded = true;
        if (slowLoadTimeout !== undefined) {
          window.clearTimeout(slowLoadTimeout);
          slowLoadTimeout = undefined;
        }
        audio.play().then(() => {
          audio.onended = () => resolve();
        }).catch((error) => {
          console.warn('Audio playback failed, falling back to TTS:', error);
          if (fallbackText && !isAudioStopped()) {
            playTTS(fallbackText, resolvedLanguage).then(() => resolve());
          } else {
            resolve();
          }
        });
      };
      
      audio.onerror = () => {
        if (slowLoadTimeout !== undefined) {
          window.clearTimeout(slowLoadTimeout);
          slowLoadTimeout = undefined;
        }
        console.warn('Audio file not found, falling back to TTS:', audioPath);
        if (fallbackText && !isAudioStopped()) {
          playTTS(fallbackText, resolvedLanguage).then(() => resolve());
        } else {
          resolve();
        }
      };
      
      // Set a timeout to prevent hanging (only if audio hasn't started)
      setTimeout(() => {
        if (slowLoadTimeout !== undefined) {
          window.clearTimeout(slowLoadTimeout);
          slowLoadTimeout = undefined;
        }
        if (!audio.ended && !audioStarted) {
          console.warn('Audio loading timeout - file may be missing or corrupted');
          audio.pause();
          resolve();
        }
      }, 15000); // 15 second timeout
      
      // Track when audio actually starts playing
      audio.onplay = () => {
        audioStarted = true;
        if (slowLoadTimeout !== undefined) {
          window.clearTimeout(slowLoadTimeout);
          slowLoadTimeout = undefined;
        }
      };
      
    } catch (error) {
      console.warn('Audio setup failed, falling back to TTS:', error);
      if (fallbackText && !isAudioStopped()) {
        playTTS(fallbackText, resolvedLanguage).then(() => resolve());
      } else {
        resolve();
      }
    }
  });
};

/**
 * Play text-to-speech as fallback
 */
export const playTTS = (text: string, language?: Language): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      resolve();
      return;
    }

    // Check if audio was stopped
    if (isAudioStopped()) {
      console.warn('TTS blocked - audio was stopped');
      resolve();
      return;
    }

    const resolvedLanguage = resolveAudioLanguage(language);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = resolvedLanguage === 'te' ? 'te-IN' : 
                    resolvedLanguage === 'kn' ? 'kn-IN' : 
                    resolvedLanguage === 'mr' ? 'mr-IN' : 
                    resolvedLanguage === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    
    speechSynthesis.speak(utterance);
  });
};

/**
 * Play success sound with fallback
 */
export const playSuccessSound = (language: Language = 'en', options?: PlaybackOptions): Promise<void> => {
  const resolvedLanguage = options?.exactLanguage ? language : resolveAudioLanguage(language);
  return new Promise((resolve) => {
    // Use language-specific audio file
    const audioPath = `/audio/audio-preview/success message/${resolvedLanguage}/success.wav`;
    const audio = new Audio(audioPath);
    
    // Track this audio instance
    trackAudio(audio);

    // Flags to track loading state
    let audioLoaded = false;
    let audioStarted = false;
    let slowLoadTimeout: number | undefined;

    // Show message if audio takes too long to preload (1 second)
    slowLoadTimeout = window.setTimeout(() => {
      if (!audioLoaded && !audioStarted) {
        showSlowLoadToast();
      }
    }, 1000);
    
    audio.onloadeddata = () => {
      audioLoaded = true;
      if (slowLoadTimeout !== undefined) {
        window.clearTimeout(slowLoadTimeout);
        slowLoadTimeout = undefined;
      }
      audio.play().then(() => {
        audio.onended = () => resolve();
      }).catch(() => {
        // Fallback to TTS if audio file doesn't exist or fails
        if (!isAudioStopped()) {
          playTTS('Success', resolvedLanguage).then(() => resolve());
        } else {
          resolve();
        }
      });
    };
    
    audio.onerror = () => {
      if (slowLoadTimeout !== undefined) {
        window.clearTimeout(slowLoadTimeout);
        slowLoadTimeout = undefined;
      }
      // Fallback to TTS if audio file doesn't exist
      if (!isAudioStopped()) {
        playTTS('Success', resolvedLanguage).then(() => resolve());
      } else {
        resolve();
      }
    };
    
    // Track when audio actually starts playing
    audio.onplay = () => {
      audioStarted = true;
      if (slowLoadTimeout !== undefined) {
        window.clearTimeout(slowLoadTimeout);
        slowLoadTimeout = undefined;
      }
    };
    
    audio.onended = () => resolve();
  });
};

/**
 * Play failure sound with fallback
 */
export const playFailureSound = (language: Language = 'en', options?: PlaybackOptions): Promise<void> => {
  const resolvedLanguage = options?.exactLanguage ? language : resolveAudioLanguage(language);
  return new Promise((resolve) => {
    // Use language-specific audio file
    const audioPath = `/audio/audio-preview/failure message/${resolvedLanguage}/failure.wav`;
    const audio = new Audio(audioPath);
    
    // Track this audio instance
    trackAudio(audio);

    // Flags to track loading state
    let audioLoaded = false;
    let audioStarted = false;
    let slowLoadTimeout: number | undefined;

    // Show message if audio takes too long to preload (1 second)
    slowLoadTimeout = window.setTimeout(() => {
      if (!audioLoaded && !audioStarted) {
        showSlowLoadToast();
      }
    }, 1000);
    
    audio.onloadeddata = () => {
      audioLoaded = true;
      if (slowLoadTimeout !== undefined) {
        window.clearTimeout(slowLoadTimeout);
        slowLoadTimeout = undefined;
      }
      audio.play().then(() => {
        audio.onended = () => resolve();
      }).catch(() => {
        // Fallback to TTS if audio file doesn't exist or fails
        if (!isAudioStopped()) {
          playTTS('Try again', resolvedLanguage).then(() => resolve());
        } else {
          resolve();
        }
      });
    };
    
    audio.onerror = () => {
      if (slowLoadTimeout !== undefined) {
        window.clearTimeout(slowLoadTimeout);
        slowLoadTimeout = undefined;
      }
      // Fallback to TTS if audio file doesn't exist
      if (!isAudioStopped()) {
        playTTS('Try again', resolvedLanguage).then(() => resolve());
      } else {
        resolve();
      }
    };
    
    // Track when audio actually starts playing
    audio.onplay = () => {
      audioStarted = true;
      if (slowLoadTimeout !== undefined) {
        window.clearTimeout(slowLoadTimeout);
        slowLoadTimeout = undefined;
      }
    };
    
    audio.onended = () => resolve();
  });
};

/**
 * Stop all audio playback
 */
export const stopAllAudio = (): void => {
  // Set flag to prevent TTS from playing
  audioStopped = true;
  
  // Stop all tracked audio instances
  activeAudioInstances.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  activeAudioInstances.clear();
  
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  
  // Stop all audio elements in DOM (fallback)
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  
  // Reset flag after delay
  setTimeout(() => {
    audioStopped = false;
  }, 500);
};
