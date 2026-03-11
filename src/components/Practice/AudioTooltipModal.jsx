import React, { useState, useEffect, useRef } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { ListenButton } from "../../utils/constants";
import * as Assets from "../../utils/imageAudioLinks";

const AudioTooltipModal = ({ audioSrc, description, children }) => {
  const [showModal, setShowModal] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (showModal && audioSrc) {
      const audio = new Audio(
        `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/multilingual_audios/${audioSrc}`
      );
      audioRef.current = audio;
      audio.play().catch((err) => console.log("Audio play error:", err));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [showModal, audioSrc]);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShowModal(true)}
      onMouseLeave={() => setShowModal(false)}
    >
      {children}

      {showModal && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            //width: "150px",
            background: "#fff",
            border: "2px solid #ff8c52",
            borderRadius: "16px",
            boxShadow: "0px 0px 20px 10px #FF7F367A",
            padding: "10px 0px",
            marginTop: "8px",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <div>
            <Box
              className="walkthrough-step-1"
              sx={{
                //marginTop: "7px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                //minWidth: { xs: "50px", sm: "60px", md: "70px" },
                cursor: "pointer",
              }}
              onClick={() => {
                // playWordAudio(
                //   `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${"text"}`
                // );
              }}
            >
              <img
                src={Assets.graph}
                alt="graph"
                style={{ height: "40px", margin: "10px" }}
              />
            </Box>
          </div>
          {/* <div
            style={{
              width: "100%",
              height: "1.5px",
              backgroundColor: "#ff8c52",
              marginTop: "15px",
              borderRadius: "1px",
            }}
          />
          <p style={{ fontSize: "18px", color: "#333", margin: 15, fontStyle: "Quicksand", fontWeight: "600" }}>
            {description}
          </p> */}
        </div>
      )}
    </div>
  );
};

export default AudioTooltipModal;
