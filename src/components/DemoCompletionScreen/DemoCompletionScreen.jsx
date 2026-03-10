import { Card, Button } from "@mui/material";
import { ArrowLeft, Gamepad2, RotateCcw, Sparkles, Trophy } from "lucide-react";

const completionMessages = {
  en: {
    title: "Demo Complete!",
    subtitle: "You're ready to start speaking!",
    message:
      "Great job! You've learned how to record and listen to your voice. Now it's time to practice with real sentences!",
    startGame: "Start Speaking",
    replayDemo: "Replay Demo",
    back: "Back",
  },
  te: {
    title: "డెమో పూర్తయింది!",
    subtitle: "మీరు మాట్లాడటం ప్రారంభించడానికి సిద్ధంగా ఉన్నారు!",
    message:
      "బాగా చేసారు! మీరు మీ గొంతును రికార్డ్ చేయడం మరియు వినడం ఎలా చేయాలో నేర్చుకున్నారు. ఇప్పుడు నిజమైన వాక్యాలతో అభ్యసించే సమయం!",
    startGame: "మాట్లాడటం ప్రారంభించండి",
    replayDemo: "డెమోను మళ్లీ ప్లే చేయండి",
    back: "వెనుకకు",
  },
  kn: {
    title: "ಡೆಮೊ ಪೂರ್ಣಗೊಂಡಿದೆ!",
    subtitle: "ನೀವು ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧರಾಗಿದ್ದೀರಿ!",
    message:
      "ಅದ್ಭುತ! ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡುವುದು ಮತ್ತು ಕೇಳುವುದು ಹೇಗೆ ಎಂದು ನೀವು ಕಲಿತಿದ್ದೀರಿ. ಈಗ ನೈಜ ವಾಕ್ಯಗಳೊಂದಿಗೆ ಅಭ್ಯಾಸ ಮಾಡುವ ಸಮಯ!",
    startGame: "ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ",
    replayDemo: "ಡೆಮೊವನ್ನು ಮರು ಪ್ಲೇ ಮಾಡಿ",
    back: "ಹಿಂದಕ್ಕೆ",
  },
  mr: {
    title: "डेमो पूर्ण झाला!",
    subtitle: "तुम्ही बोलणे सुरू करण्यास तयार आहात!",
    message:
      "छान केलं! तुम्ही तुमचा आवाज रेकॉर्ड कसा करायचा आणि ऐकायचा हे शिकलात. आता खऱ्या वाक्यांसह सराव करण्याची वेळ आली आहे!",
    startGame: "बोलणे सुरू करा",
    replayDemo: "डेमो पुन्हा प्ले करा",
    back: "मागे",
  },
};

const DemoCompletionScreen = ({
  language = "en",
  onStartGame,
  onReplayDemo,
  onBack,
  hideHeader = false,
}) => {
  const messages = completionMessages[language] || completionMessages.en;

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(45deg, #FF730E 30%, #FFB951 90%)",
        padding: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {!hideHeader && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              flexShrink: 0,
            }}
          >
            <Button
              onClick={onBack}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                fontSize: "14px",
                padding: "8px 12px",
              }}
            >
              <ArrowLeft
                style={{ height: "12px", width: "12px", marginRight: "4px" }}
              />
              {messages.back}
            </Button>
          </div>
        )}

        <Card
          style={{
            flex: 1,
            padding: "40px",
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px",
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "32px",
              textAlign: "center",
            }}
          >
            {/* Trophy Animation */}
            <div
              style={{
                position: "relative",
                animation: "trophy-bounce 2s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  background:
                    "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 25px 50px -12px rgba(251,191,36,0.5)",
                  position: "relative",
                }}
              >
                <Trophy
                  style={{ width: "80px", height: "80px", color: "white" }}
                />

                {/* Sparkles */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    fontSize: "40px",
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  ✨
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    left: "-20px",
                    fontSize: "32px",
                    animation: "float 3s ease-in-out infinite",
                    animationDelay: "0.5s",
                  }}
                >
                  🌟
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "36px",
                    animation: "float 3s ease-in-out infinite",
                    animationDelay: "1s",
                  }}
                >
                  ⭐
                </div>
              </div>
            </div>

            {/* Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Sparkles
                style={{ width: "32px", height: "32px", color: "#F59E0B" }}
              />
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "900",
                  color: "#1F2937",
                  margin: 0,
                }}
              >
                {messages.title}
              </h1>
              <Sparkles
                style={{ width: "32px", height: "32px", color: "#F59E0B" }}
              />
            </div>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#6B7280",
                margin: 0,
              }}
            >
              {messages.subtitle}
            </p>

            {/* Message */}
            <div
              style={{
                backgroundColor: "#FEF3C7",
                border: "2px solid #FBBF24",
                borderRadius: "16px",
                padding: "24px 32px",
                maxWidth: "600px",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  color: "#92400E",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                {messages.message}
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <Button
                onClick={onReplayDemo}
                style={{
                  padding: "16px 32px",
                  backgroundColor: "#6B7280",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "16px",
                  borderRadius: "9999px",
                  boxShadow: "0 10px 15px -3px rgba(107,114,128,0.4)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <RotateCcw style={{ width: "20px", height: "20px" }} />
                {messages.replayDemo}
              </Button>

              <Button
                onClick={onStartGame}
                style={{
                  padding: "16px 32px",
                  background:
                    "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "18px",
                  borderRadius: "9999px",
                  boxShadow: "0 10px 15px -3px rgba(16,185,129,0.4)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  animation: "pulse-button 2s ease-in-out infinite",
                }}
              >
                <Gamepad2 style={{ width: "24px", height: "24px" }} />
                {messages.startGame}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <style>
        {`
          @keyframes trophy-bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes pulse-button {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}
      </style>
    </div>
  );
};

export default DemoCompletionScreen;
