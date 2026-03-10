import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AserFlow from "../../components/Practice/AserFlow";
import AserFlowPreview from "../../components/Practice/AserFlowPreview";

const LetterHunt = () => {
  const [showDemo, setShowDemo] = useState(true); // Always show demo initially
  const navigate = useNavigate();

  useEffect(() => {
    // Always show demo when entering /letter-hunt
    setShowDemo(true);
  }, []);

  const handleDemoComplete = () => {
    setShowDemo(false);
  };

  const handleDemoBack = () => {
    // Navigate back to home or appropriate page
    navigate("/");
  };

  if (showDemo) {
    return (
      <AserFlowPreview
        onStartGame={handleDemoComplete}
        onBack={handleDemoBack}
      />
    );
  }

  return <AserFlow />;
};

export default LetterHunt;
