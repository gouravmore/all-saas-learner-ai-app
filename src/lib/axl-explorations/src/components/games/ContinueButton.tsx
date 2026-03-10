import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface ContinueButtonProps {
  onContinue?: () => void;
  mode?: 'game' | 'preview';
  isPreview?: boolean;
  showContinueButton?: boolean;
  className?: string;
}

export function ContinueButton({
  onContinue,
  mode,
  isPreview = false,
  showContinueButton,
  className = ''
}: ContinueButtonProps) {
  // Determine if button should be shown
  // Priority: showContinueButton (if explicitly passed) > mode === 'game' > !isPreview
  // When showContinueButton is explicitly passed (true or false), use that value
  // Otherwise, fall back to checking mode or isPreview
  const shouldShow = onContinue && (
    showContinueButton !== undefined ? showContinueButton :
    mode ? mode === 'game' :
    !isPreview
  );

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`mt-3 sm:mt-4 ${className}`}>
      <Button
        onClick={onContinue}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold"
      >
        <ArrowRight 
          style={{ 
            width: '1.25rem', 
            height: '1.25rem',
            minWidth: '1.25rem', 
            minHeight: '1.25rem'
          }} 
          className="sm:!w-6 sm:!h-6 md:!w-7 md:!h-7 lg:!w-8 lg:!h-8" 
        />
      </Button>
    </div>
  );
}

