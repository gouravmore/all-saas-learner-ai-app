import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LetterLauncherGame,
  LanguageProvider,
  AudioLanguageProvider,
} from "../../lib/axl-explorations/src/lib/index";

/**
 * DEMO ROUTE - Letter Launcher Game Demo
 *
 * This is a demo route for showcasing the Letter Launcher game.
 * Accessible at: /letter-launcher-demo or /letter-launcher-demo/:level (e.g., /letter-launcher-demo/1, /letter-launcher-demo/2)
 */
const LetterLauncherDemo = () => {
  const navigate = useNavigate();
  const params = useParams();

  // Get level from URL params, default to 1 if not provided
  const levelFromUrl = params?.level ? parseInt(params.level, 10) : 1;
  const initialLevel =
    isNaN(levelFromUrl) || levelFromUrl < 1 ? 1 : levelFromUrl;

  // Debug logging
  useEffect(() => {
    console.log(
      "LetterLauncherDemo mounted - Level from URL:",
      params?.level,
      "Parsed:",
      initialLevel
    );
  }, [params?.level, initialLevel]);

  const handleBack = () => {
    navigate("/");
  };

  const initialLanguage = localStorage.getItem("selectedLanguage") || "en";
  const initialAudioLanguage =
    localStorage.getItem("selectedAudioLanguage") || "en";

  // Error boundary - if component fails to render, show error
  try {
    return (
      <LanguageProvider initialLanguage={initialLanguage}>
        <AudioLanguageProvider initialLanguage={initialAudioLanguage}>
          <LetterLauncherGame onBack={handleBack} />
        </AudioLanguageProvider>
      </LanguageProvider>
    );
  } catch (error) {
    console.error("LetterLauncherDemo render error:", error);
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Error loading game</h2>
        <p>{error.message}</p>
        <button onClick={handleBack}>Go Back</button>
      </div>
    );
  }
};

export default LetterLauncherDemo;
