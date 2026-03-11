import { Button } from "./button";
import { RotateCcw } from "lucide-react";
import { Language } from "../../constants/languages";

interface ReplayButtonProps {
  onClick: () => void;
  language?: Language;
  className?: string;
  variant?: "default" | "transparent";
}

const replayTranslations = {
  en: "Replay",
  te: "మళ్లీ ప్లే చేయండి",
  kn: "ಮತ್ತೆ ಪ್ಲೇ ಮಾಡಿ",
  mr: "पुन्हा प्ले करा",
};

export function ReplayButton({ 
  onClick, 
  language = 'en',
  className = "",
  variant = "transparent"
}: ReplayButtonProps) {
  const buttonText = replayTranslations[language] || replayTranslations.en;
  
  const baseClassName = variant === "transparent"
    ? "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
    : "";

  return (
    <Button
      onClick={onClick}
      className={`${baseClassName} ${className}`}
      aria-label={buttonText}
    >
      {variant === "transparent" ? (
        buttonText
      ) : (
        <>
          <RotateCcw className="h-4 w-4 mr-2" />
          {buttonText}
        </>
      )}
    </Button>
  );
}

