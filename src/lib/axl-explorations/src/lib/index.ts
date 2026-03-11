// Library entry point for axl-explorations
// Export LetterGame and all necessary components, contexts, and utilities

// Main game component
export { LetterGame } from '../components/games/LetterGame';
export { LetterHuntGameCore, type LetterHuntQuestion } from '../components/games/LetterHuntGameCore';
export { LetterGamePreview } from '../components/games/LetterGamePreview';
export { MemoryGame } from '../components/games/MemoryGame';
export { MemoryGameCore, type MemoryQuestion } from '../components/games/MemoryGameCore';
export { LetterLauncherGame } from '../components/games/LetterLauncherGame';
export { LetterLauncherGameCore, type LetterLauncherQuestion } from '../components/games/LetterLauncherGameCore';
export { ROARRapidVisualGame } from '../components/games/ROARRapidVisualGame';
export { ROARRapidVisualGameCore, type ROARRapidVisualQuestion } from '../components/games/ROARRapidVisualGameCore';

// Contexts
export { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
export { AudioLanguageProvider, useAudioLanguage } from '../contexts/AudioLanguageContext';

// Utilities
export { memoryGameDataLoader } from '../utils/memoryGameDataLoader';
export { generateLetterQuestions } from '../utils/gameDataGenerators';
export * from '../utils/audioUtils';
export { englishAudioManager } from '../utils/englishAudioManager';
export { teluguAudioManager } from '../utils/teluguAudioManager';
export { kannadaAudioManager } from '../utils/kannadaAudioManager';
export { marathiAudioManager } from '../utils/marathiAudioManager';
export { playLetterAudio } from '../utils/letterAudioUtils';
export * from '../utils/fuelCalculation';

// Session management
export { sessionManager } from '../utils/sessionManager';
export { sessionTelemetryManager } from '../utils/sessionTelemetryManager';

// Constants
export type { Language } from '../constants/languages';
export { LANGUAGES, getNativeLanguageName } from '../constants/languages';

// Supporting components
export { SuccessScreen } from '../components/SuccessScreen';
export { LevelSelector } from '../components/LevelSelector';
export { TryAgain } from '../components/TryAgain';
export { ProgressBar } from '../components/ProgressBar';
export { FuelProgressBar } from '../components/FuelProgressBar';
export { SpaceBackground } from '../components/SpaceBackground';
export { PlanetWithRocketAnimation } from '../components/PlanetWithRocketAnimation';
export { LetterLauncherLevelSelector } from '../components/LetterLauncherLevelSelector';

// Types
export type { LetterQuestion } from '../utils/gameDataGenerators';

