import React from "react";
import { useNavigate } from "react-router-dom";
import DiscoverSentencePreview from "../../components/DiscoverSentance/DiscoverSentencePreview";
import { setLocalData } from "../../utils/constants";

/**
 * DEMO ROUTE - Discovery Game Demo
 *
 * This is a demo route for showcasing the Discovery game with tutorial instructions.
 * Accessible at: /discover-demo
 *
 * Shows step-by-step tutorial:
 * 1. Read the sentence
 * 2. Click the speaker icon to start recording
 * 3. Speak the sentence
 * 4. Click the stop button
 * 5. Listen to your recording
 * 6. Retry if needed
 */
const DiscoverDemo = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/discover-start");
  };

  const handleStartGame = () => {
    // Mark demo as seen so it won't show again
    setLocalData("hasSeenDiscoverDemo", "true");
    navigate("/discover");
  };

  return (
    <DiscoverSentencePreview
      onStartGame={handleStartGame}
      onBack={handleBack}
    />
  );
};

export default DiscoverDemo;
