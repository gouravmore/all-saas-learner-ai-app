import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Globe, Check } from "lucide-react";
import { Language, LANGUAGES, CONTENT_LANGUAGES, AUDIO_LANGUAGES, getLanguageByCode, LanguageOption } from "../constants/languages";

interface LanguageSelectionPopupProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  languages?: LanguageOption[]; // Optional: allows custom language list, defaults to CONTENT_LANGUAGES
}

export function LanguageSelectionPopup({ 
  selectedLanguage, 
  onLanguageChange, 
  trigger,
  title = 'Select Language',
  description = 'Choose your preferred language for learning activities',
  icon = <Globe className="h-5 w-5 sm:h-6 sm:w-6" />,
  languages = CONTENT_LANGUAGES // Default to content languages (excludes Hindi)
}: LanguageSelectionPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  const currentLanguage = getLanguageByCode(selectedLanguage);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 min-h-[36px]"
          >
            <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">{currentLanguage?.flag}</span>
            <span className="hidden sm:inline text-xs sm:text-sm">{currentLanguage?.name}</span>
            <span className="sm:hidden text-xs">{currentLanguage?.name?.split(' ')[0]}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-md sm:max-w-lg mx-auto my-4 sm:my-8 max-h-[85vh] flex flex-col">
        <DialogHeader className="px-2 sm:px-4">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 sm:gap-3 py-2 sm:py-4 flex-1 overflow-y-auto px-2 sm:px-4">
          {languages.map((language) => (
            <Card
              key={language.code}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md min-h-[65px] sm:min-h-[70px] ${
                selectedLanguage === language.code 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleLanguageSelect(language.code)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-3">
                    <span className="text-2xl sm:text-2xl">{language.flag}</span>
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-base sm:text-lg">{language.name}</span>
                      <span className="text-sm sm:text-sm text-muted-foreground">{language.nativeName}</span>
                    </div>
                  </div>
                  {selectedLanguage === language.code && (
                    <div className="flex items-center justify-center w-6 h-6 sm:w-6 sm:h-6 bg-blue-500 rounded-full ml-2">
                      <Check className="h-4 w-4 sm:h-4 sm:w-4 text-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
