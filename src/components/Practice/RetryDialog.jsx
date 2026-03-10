import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import textureImage from "../../assets/images/textureImage.png";
import cryPanda from "../../assets/images/cryPanda.svg";
import { NextButton } from "../../utils/constants";

export const RetryDialog = ({ message, onRetry, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  const handleRetry = () => {
    // Call custom retry handler if provided (usually redirects to discover-start)
    if (onRetry) {
      onRetry();
    } else {
      // Fallback: redirect to discover-start if no handler provided
      navigate("/discover-start", { replace: true });
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 999999,
      }}
    >
      <Box
        sx={{
          width: isMobile ? "90%" : "600px",
          minHeight: isMobile ? "350px" : "424px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${textureImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "round",
          boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
          backdropFilter: "blur(25px)",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: 10,
            bottom: 0,
            pointerEvents: "none",
          }}
        >
          <img src={cryPanda} alt="cryPanda" />
        </Box>

        <Box mt="32px">
          <Typography
            className="failureHeader"
            sx={{
              mt: 3,
              textAlign: "center",
            }}
          >
            Oops...
          </Typography>
        </Box>

        <Box
          mt="28px"
          display={"flex"}
          flexWrap={"wrap"}
          padding={"0px 10px 0px 10px"}
          width={"80%"}
        >
          <span
            style={{
              color: "#000000",
              fontWeight: 700,
              fontSize: isMobile ? "18px" : "32px",
              fontFamily: "Quicksand",
              lineHeight: isMobile ? "28px" : "48px",
              textAlign: "center",
            }}
          >
            {message || "Something went wrong. Please try again."}
          </span>
        </Box>

        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          mt={isMobile ? "20px" : "40px"}
          mb={2}
        >
          <Box
            onClick={handleRetry}
            sx={{
              cursor: "pointer",
              background: "linear-gradient(135deg, #E15404 0%, #FF9050 100%)",
              minWidth: isMobile ? "200px" : "250px",
              height: isMobile ? "50px" : "60px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
              zIndex: "9999",
              gap: 1,
              boxShadow: "0px 4px 10px rgba(225, 84, 4, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #D14503 0%, #E88040 100%)",
                transform: "scale(1.02)",
                transition: "all 0.2s ease",
              },
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: isMobile ? "16px" : "20px",
                fontFamily: "Quicksand",
              }}
            >
              Retry
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RetryDialog;
