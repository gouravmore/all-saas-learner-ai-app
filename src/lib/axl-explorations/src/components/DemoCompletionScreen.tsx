import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CheckCircle, Gamepad2, RotateCcw, ArrowLeft } from "lucide-react";

/**
 * DemoCompletionScreen - A reusable completion screen for game demos
 * 
 * @example
 * ```tsx
 * // In your game preview component:
 * if (previewPhase === 'completion') {
 *   return (
 *     <DemoCompletionScreen
 *       language={selectedLanguage || 'en'}
 *       onStartGame={() => onStartGame()}
 *       onReplayDemo={() => setPreviewPhase('countdown')}
 *       onBack={handleBack}
 *       hideHeader={false}
 *       totalDemos={3}
 *     />
 *   );
 * }
 * ```
 * 
 * @param language - The current language code ('en', 'te', 'kn', 'mr')
 * @param onStartGame - Callback when "Start Game" button is clicked
 * @param onReplayDemo - Callback when "Replay Demo" button is clicked
 * @param onBack - Optional callback for the back button
 * @param hideHeader - Whether to hide the header/back button
 * @param totalDemos - Total number of demos (for tracking purposes)
 */

interface DemoCompletionScreenProps {
  language: string;
  onStartGame: () => void;
  onReplayDemo: () => void;
  onBack?: () => void;
  hideHeader?: boolean;
  totalDemos?: number;
}

export function DemoCompletionScreen({
  language,
  onStartGame,
  onReplayDemo,
  onBack,
  hideHeader = false,
  totalDemos = 3
}: DemoCompletionScreenProps) {

  const translations = {
    en: {
      title: 'Demo Complete!',
      description: 'You\'ve completed the demo. Ready to play?',
      startGame: 'Start Game',
      replayDemo: 'Replay Demo',
      back: 'Back'
    },
    te: {
      title: 'డెమో పూర్తి!',
      description: 'మీరు డెమోను పూర్తి చేశారు. ఆడటానికి సిద్ధంగా ఉన్నారా?',
      startGame: 'గేమ్ ప్రారంభించండి',
      replayDemo: 'డెమోను మళ్లీ ఆడండి',
      back: 'వెనుకకు'
    },
    kn: {
      title: 'ಡೆಮೊ ಪೂರ್ಣವಾಗಿದೆ!',
      description: 'ನೀವು ಡೆಮೊವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ. ಆಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?',
      startGame: 'ಆಟವನ್ನು ಪ್ರಾರಂಭಿಸಿ',
      replayDemo: 'ಡೆಮೊವನ್ನು ಮತ್ತೆ ಆಡಿ',
      back: 'ಹಿಂದಕ್ಕೆ'
    },
    mr: {
      title: 'डेमो पूर्ण झाले!',
      description: 'तुम्ही डेमो पूर्ण केला आहे. खेळण्यासाठी तयार आहात?',
      startGame: 'गेम सुरू करा',
      replayDemo: 'डेमो पुन्हा खेळा',
      back: 'मागे'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="h-screen bg-gradient-cool p-2 sm:p-3 md:p-4 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 overflow-hidden">
        {!hideHeader && onBack && (
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <Button
              onClick={onBack}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 text-sm px-3 py-2"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              {t.back}
            </Button>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-lg p-6 sm:p-8 bg-white/95 backdrop-blur-sm shadow-floating">
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {t.title}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {t.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">

                <Button
                  onClick={onReplayDemo}
                  aria-label={t.replayDemo}
                  className="flex-1 sm:w-40 px-5 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-base rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform flex items-center justify-center min-h-[76px]"
                >
                  <div className="scale-[1.6] sm:scale-[2] flex items-center justify-center">
                    <RotateCcw className="h-10 w-10" />
                  </div>
                </Button>

                <Button
                  onClick={onStartGame}
                  aria-label={t.startGame}
                  className="flex-1 sm:w-40 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 text-base px-5 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center min-h-[76px]"
                >
                  <div className="scale-[1.6] sm:scale-[2] flex items-center justify-center">
                    <Gamepad2 className="h-10 w-10" />
                  </div>
                </Button>

              </div>

            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

