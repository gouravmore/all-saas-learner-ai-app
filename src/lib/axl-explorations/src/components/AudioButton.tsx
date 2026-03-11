import { useState } from "react";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "../lib/utils";

interface AudioButtonProps {
  audioText: string;
  language?: string; // Add language support
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function AudioButton({ audioText, language, className, variant = "outline", size = "default" }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Create enhanced speech synthesis with language-specific settings
    const utterance = new SpeechSynthesisUtterance(audioText);
    
    // ✅ UPDATED: Language-specific voice settings with improved speed and clarity
    switch (language) {
      case 'te':
        utterance.lang = 'te-IN';
        utterance.rate = 0.8; // ✅ FASTER: More natural speed for Telugu
        utterance.pitch = 0.8; // ✅ LOWER: More natural for Telugu
        utterance.volume = 1.0; // ✅ CLEAR: Full volume for clarity
        break;
      case 'mr':
        utterance.lang = 'mr-IN';
        utterance.rate = 0.8; // ✅ FASTER: More natural speed for Marathi
        utterance.pitch = 0.8; // ✅ LOWER: More natural for Marathi
        utterance.volume = 1.0; // ✅ CLEAR: Full volume for clarity
        break;
      case 'en':
      default:
        utterance.lang = 'en-IN';
        utterance.rate = 0.9; // ✅ FASTER: More natural speed for English
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        break;
    }
    
    // Enhanced voice selection with fallbacks
    const voices = speechSynthesis.getVoices();
    let selectedVoice = null;
    
    // First try: Exact language match
    selectedVoice = voices.find(voice => voice.lang === utterance.lang);
    
    // Second try: Language family match (e.g., 'te' for 'te-IN')
    if (!selectedVoice && language) {
      const langCode = utterance.lang.split('-')[0];
      selectedVoice = voices.find(voice => voice.lang.startsWith(langCode));
    }
    
    // Third try: Regional variations
    if (!selectedVoice && language === 'te') {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('te') || voice.lang.includes('Telugu') || 
        voice.lang.includes('hi-IN') || voice.lang.includes('hi') // Hindi fallback
      );
    }
    
    if (!selectedVoice && language === 'mr') {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('mr') || voice.lang.includes('Marathi') || 
        voice.lang.includes('hi-IN') || voice.lang.includes('hi') // Hindi fallback
      );
    }
    
    // Apply selected voice if found
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`🎤 AudioButton using voice: ${selectedVoice.name} (${selectedVoice.lang}) for ${language}`);
    } else {
      console.warn(`⚠️ AudioButton: No suitable voice found for ${language}, using default`);
    }
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = (event) => {
      console.warn('AudioButton speech synthesis error for:', audioText, event);
      setIsPlaying(false);
    };
    
    speechSynthesis.speak(utterance);
  };

  return (
    <Button
      onClick={handlePlay}
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-300 hover:scale-105",
        isPlaying && "animate-pulse",
        className
      )}
      disabled={isPlaying}
    >
      {isPlaying ? (
        <VolumeX className="h-4 w-4 mr-2" />
      ) : (
        <Volume2 className="h-4 w-4 mr-2" />
      )}
      Listen
    </Button>
  );
}