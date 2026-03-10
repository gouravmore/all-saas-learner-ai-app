import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LetterHuntMechanics from "../../components/Practice/LetterHuntMechanics";

/**
 * DEMO ROUTE - Letter Hunt Game Demo (Practice View)
 *
 * This is a demo route for showcasing the Letter Hunt game as it appears in Practice.
 * Accessible at: /letter-hunt-demo or /letter-hunt-demo/:level (e.g., /letter-hunt-demo/1, /letter-hunt-demo/2)
 *
 * TODO: Remove this component and route after demo is complete
 */
const LetterHuntDemo = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [page, setPage] = useState(1);

  // Get level from URL params, default to 1 if not provided
  const levelFromUrl = params?.level ? parseInt(params.level, 10) : 1;
  const initialLevel =
    isNaN(levelFromUrl) || levelFromUrl < 1 ? 1 : levelFromUrl;

  // Debug logging
  useEffect(() => {
    console.log(
      "LetterHuntDemo mounted - Level from URL:",
      params?.level,
      "Parsed:",
      initialLevel
    );
  }, [params?.level, initialLevel]);

  const handleBack = () => {
    navigate("/");
  };

  const handleNext = () => {
    // Demo: Just show completion message
    console.log("Game completed!");
  };

  // Error boundary - if component fails to render, show error
  try {
    // Mock props to match Practice.jsx structure
    return (
      <LetterHuntMechanics
        page={page}
        setPage={setPage}
        level={initialLevel}
        header="Letter Recognition"
        points={0}
        steps={10}
        currentStep={1}
        progressData={{}}
        showProgress={true}
        background="linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)"
        handleNext={handleNext}
        handleBack={handleBack}
        enableNext={false}
        setEnableNext={() => {}}
        isShowCase={false}
        loading={false}
        setOpenMessageDialog={() => {}}
        vocabCount={0}
        wordCount={0}
        showTimer={false}
      />
    );
  } catch (error) {
    console.error("LetterHuntDemo render error:", error);
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Error loading game</h2>
        <p>{error.message}</p>
        <button onClick={handleBack}>Go Back</button>
      </div>
    );
  }
};

export default LetterHuntDemo;
