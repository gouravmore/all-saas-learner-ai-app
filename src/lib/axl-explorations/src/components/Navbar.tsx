import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { 
  Globe,
  ChevronDown,
  LogOut,
  UserCircle,
  Grid3X3,
  Volume2
} from "lucide-react";
import { LanguageSelectionPopup } from "./LanguageSelectionPopup";
import { useLanguage } from "../contexts/LanguageContext";
import { useAudioLanguage } from "../contexts/AudioLanguageContext";
import { getLanguageByCode, AUDIO_LANGUAGES } from "../constants/languages";

interface NavbarProps {
  currentUser: string;
  onLogout: () => void;
  showViewAllButton?: boolean;
}

const Navbar = ({ 
  currentUser, 
  onLogout,
  showViewAllButton = true
}: NavbarProps) => {
  const navigate = useNavigate();
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const { selectedAudioLanguage, setSelectedAudioLanguage } = useAudioLanguage();
  const audioLanguageDetails = getLanguageByCode(selectedAudioLanguage);

  return (
    <div className="w-full bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 via-purple-400 to-pink-400 sticky top-0 z-50 overflow-hidden shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-0 min-h-[80px] sm:min-h-[80px] max-w-full relative">
        
        {/* Right side - User profile, View All button and Language Settings */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-4 text-white/80 w-full sm:w-auto ml-auto">
          <LanguageSelectionPopup 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
          
          {showViewAllButton && (
            <Button
              onClick={() => navigate('/all-activities')}
              variant="outline"
              size="sm"
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-3 py-2 sm:py-2 min-h-[36px]"
            >
              <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">View All</span>
              <span className="hidden sm:inline md:hidden">All</span>
              <span className="sm:hidden">All</span>
            </Button>
          )}

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-3 py-2 sm:py-2 min-h-[36px]"
              >
                <UserCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">{currentUser}</span>
                <span className="hidden sm:inline md:hidden">{currentUser.split(' ')[0]}</span>
                <span className="sm:hidden">{currentUser.split(' ')[0].charAt(0)}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">Logged in as</p>
                <p className="text-sm text-muted-foreground">{currentUser}</p>
              </div>
            <LanguageSelectionPopup
              selectedLanguage={selectedAudioLanguage}
              onLanguageChange={setSelectedAudioLanguage}
              title="Select Audio Instruction Language"
              description="Choose narration and preview language"
              icon={<Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />}
              languages={AUDIO_LANGUAGES}
              trigger={
                <DropdownMenuItem
                  className="flex items-center gap-3 cursor-pointer"
                  onSelect={(event) => event.preventDefault()}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-base">
                    {audioLanguageDetails?.flag || '🎧'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Audio instructions</span>
                    <span className="text-xs text-muted-foreground">
                      {audioLanguageDetails?.name || 'English'}
                    </span>
                  </div>
                </DropdownMenuItem>
              }
            />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
