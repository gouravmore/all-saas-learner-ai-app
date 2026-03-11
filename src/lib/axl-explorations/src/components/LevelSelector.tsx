import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ArrowLeft, TrendingUp, Award,PlayCircle, Lock as LockIcon, Star } from "lucide-react";
import { Language, LANGUAGES } from "../constants/languages";
import { useState, useEffect } from "react";
import { trackingAssessmentService } from "../utils/trackingAssessmentService";
import { sessionManager } from "../utils/sessionManager";

interface LevelStats {
  level: number;
  highestScore?: number;
  totalMaxScore?: number;
  lastAttemptedOn?: string;
  scorePercentage?: number;
  isUnlocked?: boolean;
  isCompleted?: boolean;
  color?: string;
}

interface LevelSelectorProps {
  selectedLanguage: Language;
  currentLevel: number;
  maxLevels: number;
  onLevelSelect: (level: number) => void;
  onBack: () => void;
  onDemo?: () => void; // Add demo callback
  gameTitle?: string;
  showBadge?: boolean;
  onCollectBadge?: () => void;
  badgeTooltip?: string; // Add custom tooltip text
  gameKey?: string; // Add gameKey to fetch level stats
  unlockAll?: boolean; // When true, ignore backend locks and unlock all levels
}

export function LevelSelector({ 
  selectedLanguage, 
  currentLevel, 
  maxLevels, 
  onLevelSelect, 
  onBack,
  onDemo,
  gameTitle,
  showBadge = false,
  onCollectBadge,
  badgeTooltip = "Coming Soon",
  gameKey,
  unlockAll
}: LevelSelectorProps) {
  const language = LANGUAGES.find(l => l.code === selectedLanguage);
  const [levelStats, setLevelStats] = useState<Map<number, LevelStats>>(new Map());
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [backendCurrentLevel, setBackendCurrentLevel] = useState<number>(1);

  // Fetch level stats on mount
  useEffect(() => {
    const fetchLevelStats = async () => {
      if (!gameKey) return;
      
      const currentUser = sessionManager.getCurrentUser();
      if (!currentUser) return;

      setIsLoadingStats(true);
      
      // Extract game name without language suffix
      const gameName = gameKey.split('_')[0];
      const statsMap = new Map<number, LevelStats>();

      // Search for level stats using current user
      const searchParams = {
        userId: currentUser.username,
        courseId: gameName,
        unitId: selectedLanguage // Use language as unitId
      };
      
      const result = await trackingAssessmentService.searchAssessmentTracking(searchParams);

      // Handle the enhanced backend response format
      if (result.success && result.data && typeof result.data === 'object') {
        // Process each level from backend response
        Object.keys(result.data).forEach(levelKey => {
          if (!levelKey.startsWith('level')) return;
          
          const levelData = result.data[levelKey];
          const levelNumber = parseInt(levelKey.replace('level', ''));
          
          // Process level data even if metadata structure varies
          if (levelData) {
            // Extract percentage from metadata if available, otherwise calculate from highest score
            const metadata = levelData.metadata || {};
            const highest = levelData.highest || {};
            const scorePercentage = metadata.scorePercentage ?? 
              (highest.totalMaxScore > 0 ? ((highest.totalScore || 0) / highest.totalMaxScore * 100) : 0);
            
            statsMap.set(levelNumber, {
              level: levelNumber,
              highestScore: highest.totalScore,
              totalMaxScore: highest.totalMaxScore || 10,
              lastAttemptedOn: highest.createdOn,
              scorePercentage: scorePercentage,
              isUnlocked: metadata.isUnlocked ?? (levelNumber === 1 || highest.totalScore > 0),
              isCompleted: metadata.isCompleted ?? false,
              color: metadata.color
            });
          }
        });

        // For combined games, use backend's currentLevel directly (calculated with 80% validation)
        // For individual games, compute from progress
        const isCombinedGame = gameName && (
          gameName.startsWith('combinedLetter') ||
          gameName.startsWith('combinedWord') ||
          gameName.startsWith('combinedSentence')
        );
        
        if (isCombinedGame) {
          // Combined games: Use backend's currentLevel directly (trust backend calculation)
          const backendProvided = result.metadata?.currentLevel || 1;
          setBackendCurrentLevel(Math.min(Math.max(1, backendProvided), maxLevels));
        } else {
          // Individual games: Compute current level based on successful progress
          let highestSuccessfulLevel = 0;
          statsMap.forEach((value, levelNum) => {
            const percent = value.scorePercentage ?? 0;
            const completed = value.isCompleted ?? false;
            if (completed || percent > 0) {
              highestSuccessfulLevel = Math.max(highestSuccessfulLevel, levelNum);
            }
          });
          const computedFromProgress = Math.min(
            Math.max(1, (highestSuccessfulLevel > 0 ? highestSuccessfulLevel + 1 : 1)),
            maxLevels
          );
          const backendProvided = result.metadata?.currentLevel || 1;
          const effectiveCurrentLevel = Math.min(
            Math.max(computedFromProgress, backendProvided),
            maxLevels
          );
          setBackendCurrentLevel(effectiveCurrentLevel);
        }
      }
      setLevelStats(statsMap);
      setIsLoadingStats(false);
    };

    fetchLevelStats();
  }, [gameKey, selectedLanguage, maxLevels]);
  
  // Use English text for all languages (including Telugu and Marathi)
  const getLocalizedText = () => {
    return {
      title: 'Choose Level',
      subtitle: 'All levels are unlocked for practice',
      currentLevel: `Current Level: ${backendCurrentLevel}/${maxLevels}`,
      backButton: 'Back',
      complete: 'Complete',
      current: 'Current',
      available: 'Available',
      locked: 'Locked',
      allLevelsMessage: '🎮 All levels are available to play!',
      practiceMessage: '💡 Practice any level to strengthen your skills'
    };
  };

  const localizedText = getLocalizedText();
  const levels = Array.from({ length: maxLevels }, (_, i) => i + 1);
  const isLetterBadge = !!gameKey && gameKey.startsWith('combinedLetter');
  const isBadgeUnlocked = isLetterBadge && !!(levelStats.get(maxLevels)?.isCompleted);
  const effectiveBadgeTooltip = isLetterBadge
    ? (isBadgeUnlocked ? badgeTooltip : `Complete Level ${maxLevels} to unlock`)
    : (badgeTooltip || 'Coming Soon');

  // Helper function to get star count based on percentage
  const getStarCount = (percentage: number): number => {
    if (percentage >= 100) return 3;
    if (percentage >= 90) return 2;
    if (percentage >= 80) return 1;
    return 0; // Less than 80% - show greyed out stars
  };

  return (
    <div className="h-screen bg-gradient-cool p-2 sm:p-4 overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-1.5 sm:mb-2 gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{localizedText.backButton}</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-tight">
              {gameTitle}
            </h1>
          </div>
          
          {/* Demo Button */}
          {onDemo && (
            <Button 
              onClick={onDemo}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <PlayCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Watch Demo</span>
              <span className="sm:hidden">Demo</span>
            </Button>
          )}
          {!onDemo && <div className="w-12 sm:w-32"></div>}
        </div>

        {/* Level Selection */}
        <Card className="flex-1 p-3 sm:p-4 md:p-5 bg-white/95 backdrop-blur-sm shadow-floating overflow-hidden flex flex-col">
          <div className="text-center mb-2 sm:mb-3 flex-shrink-0">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 mx-auto mb-1 text-primary" />
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-1">
              {localizedText.title}
            </h1>
            {/* <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">
              {localizedText.subtitle}
            </p>
            <p className="text-[10px] sm:text-xs text-blue-600 mt-0.5">
              {localizedText.currentLevel}
            </p> */}
          </div>

          <TooltipProvider>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 md:gap-4 w-full max-w-4xl mx-auto flex-1 content-center overflow-hidden px-3 sm:px-4">
              {levels.map((level) => {
                // For unlockAll (individual games), no current highlight
                const isCurrent = !unlockAll && level === backendCurrentLevel;
                const stats = levelStats.get(level);
                
                // Use backend-provided unlock/completion status
                const isUnlocked = unlockAll ? true : (stats?.isUnlocked ?? (level === 1));
                const isCompleted = stats?.isCompleted ?? false;
                const isLocked = !isUnlocked;
                const currentPercent = stats?.scorePercentage ?? 0;
                
                // Get color from metadata, but only use it if it's not "white"
                const levelColor = stats?.color;
                const useCustomColor = levelColor && levelColor.toLowerCase() !== 'white';
                
                // Determine border color style with thicker stroke
                const borderStyle: { borderColor?: string; borderWidth?: string } = {};
                if (!isLocked && useCustomColor) {
                  borderStyle.borderColor = levelColor;
                  borderStyle.borderWidth = '3px'; // Thicker stroke for custom colors
                }
                
                const variantClasses = isLocked
                  ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed hover:scale-100'
                  : (isCurrent
                      ? useCustomColor 
                        ? 'bg-white text-black hover:bg-white hover:text-black'
                        : 'bg-white text-black border-blue-500 hover:bg-white hover:text-black hover:border-blue-600'
                      : useCustomColor
                        ? 'bg-white hover:bg-blue-50'
                        : 'bg-white hover:bg-blue-50 hover:border-blue-300');
                
                return (
                  <Tooltip key={level} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => onLevelSelect(level)}
                        variant="outline"
                        disabled={isLocked}
                        style={borderStyle}
                        className={`aspect-square w-full min-h-[65px] sm:min-h-[70px] md:min-h-[80px] font-bold transition-all duration-200 hover:scale-105 ${useCustomColor && !isLocked ? 'border-[3px]' : 'border-2'} rounded-xl sm:rounded-2xl p-0 ${variantClasses}`}
                      >
                        <div className="flex flex-col items-center justify-center w-full h-full gap-1 px-1">
                          <span className={`text-lg sm:text-xl md:text-2xl ${isCurrent ? 'text-blue-500' : ''}`}>{level}</span>
                          
                          {/* Show stars based on percentage - positioned attractively for children */}
                          {stats && stats.lastAttemptedOn != null ? (
                            <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-1 px-1">
                              {[1, 2, 3].map((starNum) => {
                                const filledStars = getStarCount(currentPercent);
                                const isFilled = starNum <= filledStars;
                                // Center star (2) is larger, side stars (1, 3) are smaller
                                const isCenter = starNum === 2;
                                const sizeClasses = isCenter
                                  ? 'h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7'
                                  : 'h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6';
                                return (
                                  <Star
                                    key={starNum}
                                    className={`transition-all duration-300 ${sizeClasses} ${
                                      isFilled
                                        ? 'fill-yellow-400 text-yellow-500'
                                        : 'fill-gray-200 text-gray-200'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          ) : !isLocked && (
                            // Show greyed out stars if no stats available
                            <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-1 px-1">
                              {[1, 2, 3].map((starNum) => {
                                // Center star (2) is larger, side stars (1, 3) are smaller
                                const isCenter = starNum === 2;
                                const sizeClasses = isCenter
                                  ? 'h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7'
                                  : 'h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6';
                                return (
                                  <Star
                                    key={starNum}
                                    className={`${sizeClasses} fill-gray-200 text-gray-200`}
                                  />
                                );
                              })}
                            </div>
                          )}
                          
                          {/* Lock icon for locked levels */}
                          {isLocked && (
                            <LockIcon className="h-3.5 w-3.5 text-gray-400 mt-0.5" />
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    {isLocked && (
                      <TooltipContent side="top" className="bg-gray-900 text-white">
                        <p>Score 80%+ in Level {level - 1} to unlock</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
              
              {/* Add badge level if showBadge is true */}
              {showBadge && (
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div className="relative col-start-2 sm:col-start-3 col-span-1 flex justify-center">
                      <Button
                        onClick={onCollectBadge}
                        variant="outline"
                        className={`aspect-square w-full min-h-[65px] sm:min-h-[70px] md:min-h-[80px] font-bold border-2 rounded-xl sm:rounded-2xl p-0 ${
                          (isLetterBadge ? !isBadgeUnlocked : true)
                            ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-700 cursor-not-allowed opacity-80'
                            : 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-700 hover:from-yellow-200 hover:to-yellow-300 hover:border-yellow-400'
                        }`}
                        disabled={isLetterBadge ? !isBadgeUnlocked : true}
                      >
                        <div className="flex flex-col items-center justify-center w-full h-full gap-0.5">
                          <Award className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                          <div className="text-[9px] sm:text-[10px] md:text-xs leading-tight">
                            Collect Badge
                          </div>
                        </div>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-900 text-white">
                    <p>{effectiveBadgeTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>

          {/* <div className="text-center mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500 flex-shrink-0 leading-tight">
            <p>{localizedText.allLevelsMessage}</p>
            <p className="mt-0.5">{localizedText.practiceMessage}</p>
          </div> */}
        </Card>
      </div>
    </div>
  );
}