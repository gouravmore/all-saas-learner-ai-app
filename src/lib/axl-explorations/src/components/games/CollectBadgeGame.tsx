import { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ClockwiseTimer } from "../ClockwiseTimer";
import { ArrowLeft, Timer, Star } from "lucide-react";
import { TryAgainScreen } from "../TryAgainScreen";
import { GameCompleteScreen } from "../GameCompleteScreen";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language } from "../../constants/languages";

interface CardData {
  id: number;
  letter: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameResult {
  step: number;
  pairsFound: number;
  movesUsed: number;
  timeTaken: number;
  score: number;
}

interface CollectBadgeGameProps {
  onBack: () => void;
}

export function CollectBadgeGame({ onBack }: CollectBadgeGameProps) {
  const { selectedLanguage } = useLanguage();
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [pairsFound, setPairsFound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes = 300 seconds
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isGameFailed, setIsGameFailed] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [gameStarted, setGameStarted] = useState(true); // Start game immediately
  const [gameStartTime, setGameStartTime] = useState(0);
  const [showStartOverlay, setShowStartOverlay] = useState(true); // Show start overlay

  // Generate letters for 4x4 grid (16 cards, 8 pairs)
  const generateLetters = (): string[] => {
    const baseLetters: Record<Language, string[]> = {
      'en': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      'te': ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఋ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ', 'క', 'ఖ', 'గ', 'ఘ', 'ఙ', 'చ', 'ఛ', 'జ', 'ఝ', 'ఞ', 'ట', 'ఠ', 'డ'],
      'mr': ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण'],
      'kn': ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ']
    };

    const letters = baseLetters[selectedLanguage];
    
    // 4x4 grid = 16 cards = 8 pairs
    const uniquePairs = 8;
    
    // Take only the number of unique letters needed for pairs
    const stepLetters = letters.slice(0, uniquePairs);
    const pairedLetters = [...stepLetters, ...stepLetters]; // Duplicate for pairs
    
    return pairedLetters;
  };

  // Initialize cards for 4x4 grid
  const initializeCards = useCallback(() => {
    const letters = generateLetters();
    const shuffledLetters = letters.sort(() => Math.random() - 0.5);
    
    console.log(`Initializing 4x4 grid: 8 pairs, ${letters.length} cards`);
    
    const newCards: CardData[] = shuffledLetters.map((letter, index) => ({
      id: index,
      letter,
      isFlipped: false,
      isMatched: false
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setPairsFound(0);
  }, [selectedLanguage]);

  // Start game function
  const startGame = () => {
    setShowStartOverlay(false);
    setGameStartTime(Date.now());
    setTimeRemaining(300); // Reset timer to 5 minutes
  };

  // Reset game function
  const resetGame = () => {
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setPairsFound(0);
    setScore(0);
    setTimeRemaining(300);
    setIsGameComplete(false);
    setIsGameFailed(false);
    setGameResult(null);
    setShowStartOverlay(true); // Show start overlay so user can click "Start Game"
    initializeCards(); // Reinitialize cards with new shuffle
  };

  // Initialize cards immediately when component mounts
  useEffect(() => {
    initializeCards();
  }, [initializeCards]);

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.letter === secondCard.letter) {
        // Match found
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstId || card.id === secondId 
                ? { ...card, isMatched: true, isFlipped: true }
                : card
            )
          );
          setPairsFound(prev => {
            const newCount = prev + 1;
            console.log(`Match found! Pairs found: ${newCount}`);
            return newCount;
          });
          setScore(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstId || card.id === secondId 
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check if game is complete
  useEffect(() => {
    const totalPairs = 8; // 4x4 grid = 8 pairs
    
    console.log(`Game: Pairs found: ${pairsFound}/${totalPairs}`);
    
    if (pairsFound === totalPairs && gameStarted) {
      console.log(`Game completed!`);
      const gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
      const result: GameResult = {
        step: 1,
        pairsFound,
        movesUsed: moves,
        timeTaken: gameTime,
        score: score
      };

      setGameResult(result);
      
      // Game complete
      setTimeout(() => {
        setIsGameComplete(true);
      }, 1500);
    }
  }, [pairsFound, gameStarted, moves, score, gameStartTime]);

  // Timer effect
  useEffect(() => {
    if (!showStartOverlay && !isGameComplete && !isGameFailed) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsGameFailed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showStartOverlay, isGameComplete, isGameFailed]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time in minutes only
  const formatTimeInMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}s`;
    } else if (secs === 0) {
      return `${mins}m`;
    } else {
      return `${mins}m ${secs}s`;
    }
  };




  // Show game failed screen
  if (isGameFailed) {
    return <TryAgainScreen onTryAgain={resetGame} onBack={onBack} />;
  }

  // Show game complete screen
  if (isGameComplete) {
    return <GameCompleteScreen stepResults={gameResult ? [gameResult] : []} timeRemaining={timeRemaining} score={score} onBack={onBack} />;
  }

  // Main game interface
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
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-tight">
              Collect Badge Game
            </h1>
            <div className="hidden sm:flex items-center justify-center gap-1.5 text-white/80 text-[10px] sm:text-xs mt-0.5">
              <span>Memory Card Challenge</span>
            </div>
          </div>
          
          <div className="w-12 sm:w-32"></div>
        </div>

        {/* Main Content Card */}
        <Card className="flex-1 p-3 sm:p-4 bg-white/95 backdrop-blur-sm shadow-floating overflow-hidden flex flex-col">
          {/* Game Stats and Timer - Top Section */}
          <div className="flex-shrink-0 mb-2 sm:mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold text-lg">{score}</span>
                  <span className="text-sm text-gray-600">Score</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg">{pairsFound}</span>
                  <span className="text-sm text-gray-600">Pairs</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg">{moves}</span>
                  <span className="text-sm text-gray-600">Moves</span>
                </div>
              </div>
              
              {/* Timer Section - Right aligned */}
              <div className="flex flex-col items-center gap-1">
                <div className="scale-[0.7] sm:scale-[0.72] md:scale-[0.75] origin-center">
                  <ClockwiseTimer 
                    timeRemaining={timeRemaining}
                    totalTime={300}
                    className="justify-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Game Content - Compact spacing */}
          <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
            <div className="text-center mb-2 sm:mb-3">
              <h2 className="text-lg sm:text-xl font-bold mb-1 text-gray-800">Memory Game</h2>
              <p className="text-sm sm:text-base text-gray-600">
                Find 8 matching pairs
              </p>
            </div>

            {/* Card Grid - 4x4 with responsive spacing */}
            <div className="grid gap-1.5 sm:gap-2 max-w-sm sm:max-w-md mx-auto grid-cols-4 mb-2 sm:mb-3 px-2 sm:px-0">
              {cards.map((card) => (
                <Button
                  key={card.id}
                  variant="outline"
                  className={`font-bold transition-all duration-300 rounded-md border-0 h-12 w-10 sm:h-14 sm:w-12 md:h-16 md:w-14 text-sm sm:text-base md:text-lg ${
                    card.isFlipped || card.isMatched
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm'
                  }`}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isMatched || showStartOverlay}
                >
                  {card.isFlipped || card.isMatched ? card.letter : '?'}
                </Button>
              ))}
            </div>

            {/* Start Button - Responsive positioning */}
            {showStartOverlay && (
              <div className="text-center px-2 sm:px-0">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-semibold w-full max-w-xs sm:max-w-none"
                >
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1.5 sm:mr-2" />
                  Start Game
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CollectBadgeGame;