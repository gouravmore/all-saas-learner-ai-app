import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import config from "../../utils/urlConstants.json";
import { useMediaQuery, useTheme } from "@mui/material";
import { fetchVirtualId } from "../../services/userservice/userService";
import { jwtDecode } from "jwt-decode";
import "./LoginPage.css";
import { setLocalData } from "../../utils/constants";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { initialize } from "../../services/telementryService";
import { startEvent } from "../../services/callTelemetryIntract";
import LanguageModalNew from "../../utils/LanguageModal";
import { AudioDiagnosticModal } from "../../components/AudioDiagnostic";
import panda from "../../assets/images/panda.svg";
import textureImage from "../../assets/images/textureImage.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const ranonce = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const [showAudioDiagnostic, setShowAudioDiagnostic] = useState(false);

  const handleWordClick = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }
    localStorage.clear();

    try {
      const usernameDetails = await fetchVirtualId(username);
      let token = usernameDetails?.result?.token;

      localStorage.setItem("apiToken", token);
      // const tokenDetails = jwtDecode(token);
      if (token) {
        setLocalData("profileName", username);

        const initService = async (visitorId) => {
          await initialize({
            context: {
              mode: process.env.REACT_APP_MODE,
              authToken: token,
              did: localStorage.getItem("deviceId") || visitorId,
              uid: username || "anonymous",
              channel: process.env.REACT_APP_CHANNEL,
              env: process.env.REACT_APP_ENV,
              pdata: {
                id: process.env.REACT_APP_ID,
                ver: process.env.REACT_APP_VER,
                pid: process.env.REACT_APP_PID,
              },
              tags: [""],
              timeDiff: 0,
              host: process.env.REACT_APP_HOST,
              endpoint: process.env.REACT_APP_ENDPOINT,
              apislug: process.env.REACT_APP_APISLUG,
            },
            config: {},
            metadata: {},
          });

          if (!ranonce.current) {
            if (!localStorage.getItem("contentSessionId")) {
              startEvent();
            }
            ranonce.current = true;
          }
        };

        const fp = await FingerprintJS.load();
        const { visitorId } = await fp.get();
        await initService(visitorId);

        // setLocalData("readMatch", true);
        //setLocalData("rFlow", true);
        //setLocalData("wordWall", true);
        // Show audio diagnostic modal first
        setShowAudioDiagnostic(true);
      } else {
        alert("Enter correct username and password");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${textureImage})`,
        backgroundRepeat: "round",
        backgroundSize: "contain",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "500px",
          px: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Speech Bubble */}
        <Box
          sx={{
            position: "relative",
            mb: 3,
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Box
            sx={{
              background: "#ffffff",
              border: "3px solid #6DAF19",
              borderRadius: "20px",
              p: { xs: 2, sm: 2.5 },
              position: "relative",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "12px solid #ffffff",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                bottom: "-15px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "13px solid transparent",
                borderRight: "13px solid transparent",
                borderTop: "13px solid #6DAF19",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Quicksand",
                fontSize: { xs: "20px", sm: "24px", md: "28px" },
                fontWeight: 600,
                color: "#333333",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              Welcome! Let's get started!
            </Typography>
          </Box>
        </Box>

        {/* Centered Panda Mascot */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <img
            src={panda}
            alt="panda"
            style={{
              width: isMobile ? "150px" : "200px",
              height: "auto",
              filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))",
            }}
          />
        </Box>

        {/* Login Form */}
        <Box
          sx={{
            width: "100%",
            background: "white",
            borderRadius: "20px",
            p: { xs: 3, sm: 4 },
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontFamily: "Quicksand",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "Quicksand",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontFamily: "Quicksand",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "Quicksand",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(135deg, #6DAF19 0%, #5a9a15 100%)",
                    color: "white",
                    fontFamily: "Quicksand",
                    fontWeight: 700,
                    borderRadius: "25px",
                    padding: { xs: "16px 32px", sm: "18px 40px" },
                    textTransform: "none",
                    fontSize: { xs: "18px", sm: "20px", md: "22px" },
                    boxShadow: "0 8px 20px rgba(109, 175, 25, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a9a15 0%, #4a8a10 100%)",
                      transform: "scale(1.02)",
                      boxShadow: "0 12px 24px rgba(109, 175, 25, 0.5)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  LOGIN
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>

      <LanguageModalNew show={showModal} onClose={() => setShowModal(false)} />
      <AudioDiagnosticModal
        show={showAudioDiagnostic}
        onClose={() => {
          setShowAudioDiagnostic(false);
          // Show language modal after audio diagnostic is closed
          handleWordClick();
          navigate("/discover-start");
        }}
      />
    </Box>
  );
};

export default LoginPage;
