import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from "../constants/languages";

interface AudioLanguageContextType {
  selectedAudioLanguage: Language;
  setSelectedAudioLanguage: (language: Language) => void;
}

const AudioLanguageContext = createContext<AudioLanguageContextType | undefined>(undefined);

interface AudioLanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

export function AudioLanguageProvider({
  children,
  initialLanguage = 'en',
}: AudioLanguageProviderProps) {
  const [selectedAudioLanguage, setSelectedAudioLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    const savedAudioLanguage = localStorage.getItem('selectedAudioLanguage') as Language;
    if (savedAudioLanguage && ['en', 'te', 'mr', 'kn', 'hi'].includes(savedAudioLanguage)) {
      setSelectedAudioLanguage(savedAudioLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedAudioLanguage', selectedAudioLanguage);
  }, [selectedAudioLanguage]);

  const value = {
    selectedAudioLanguage,
    setSelectedAudioLanguage,
  };

  return (
    <AudioLanguageContext.Provider value={value}>
      {children}
    </AudioLanguageContext.Provider>
  );
}

export function useAudioLanguage() {
  const context = useContext(AudioLanguageContext);
  if (context === undefined) {
    throw new Error('useAudioLanguage must be used within an AudioLanguageProvider');
  }
  return context;
}


