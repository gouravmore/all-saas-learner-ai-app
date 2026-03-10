import React, { useState } from "react";
import { Box, Modal, useMediaQuery, useTheme } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import * as Assets from "../../utils/imageAudioLinks";

/**
 * ZoomableImage - A reusable component for displaying images with zoom functionality
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for the image
 * @param {object} imageStyle - Custom styles for the image
 * @param {string} iconPosition - Position of zoom icon: "top-left" | "bottom-right" (default: "top-left")
 * @param {boolean} useCustomIcon - Whether to use custom icon image instead of Material-UI icon (default: false)
 * @param {object} containerStyle - Custom styles for the image container
 * @param {boolean} showGradientOverlay - Whether to show gradient overlay (default: true)
 */
const ZoomableImage = ({
  src,
  alt = "contentImage",
  imageStyle = {},
  iconPosition = "top-left",
  useCustomIcon = false,
  containerStyle = {},
  showGradientOverlay = true,
}) => {
  const [zoomOpen, setZoomOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Default image styles
  const defaultImageStyle = {
    borderRadius: "20px",
    maxWidth: "100%",
    height: isMobile ? "150px" : "250px",
    cursor: "pointer",
    ...imageStyle,
  };

  // Default container styles
  const defaultContainerStyle = {
    position: "relative",
    cursor: "zoom-in",
    width: "fit-content",
    ...containerStyle,
  };

  if (!src) {
    return null;
  }

  return (
    <>
      <Box sx={defaultContainerStyle}>
        <img
          src={src}
          alt={alt}
          style={defaultImageStyle}
          onClick={() => setZoomOpen(true)}
        />

        {showGradientOverlay && (
          <>
            {useCustomIcon && iconPosition === "bottom-right" ? (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "6px",
                  right: "6px",
                  zIndex: 10,
                }}
              >
                <img
                  src={Assets.zoomIcon}
                  onClick={() => setZoomOpen(true)}
                  height="65px"
                  width="65px"
                  alt="Zoom"
                  style={{ cursor: "pointer" }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "40px",
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent)",
                  borderTopLeftRadius: "20px",
                  borderTopRightRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "8px",
                }}
              >
                <ZoomInIcon
                  onClick={() => setZoomOpen(true)}
                  sx={{
                    color: "white",
                    fontSize: "22px",
                    cursor: "pointer",
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Modal for zoomed image */}
      <Modal
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
        }}
      >
        <Box
          sx={{
            position: "relative",
            outline: "none",
            height: isMobile ? "300px" : "500px",
            width: isMobile ? "90vw" : "500px",
            maxWidth: "90vw",
            maxHeight: "90vh",
            marginTop: isMobile ? "0px" : isTablet ? "45px" : "0px",
          }}
        >
          {/* Gradient overlay at the top of the zoomed image */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40px",
              background:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: "8px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              zIndex: 1,
            }}
          >
            {/* Close icon */}
            {useCustomIcon ? (
              <img
                src={Assets.closeIcon}
                onClick={() => setZoomOpen(false)}
                style={{
                  marginTop: "20px",
                  cursor: "pointer",
                  width: "24px",
                  height: "24px",
                }}
                alt="Close"
              />
            ) : (
              <CloseIcon
                onClick={() => setZoomOpen(false)}
                sx={{
                  color: "white",
                  fontSize: isMobile ? "20px" : "24px",
                  cursor: "pointer",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "50%",
                  padding: "4px",
                }}
              />
            )}
          </Box>

          {/* Zoomed image */}
          <img
            src={src}
            alt={alt || "Zoomed content"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ZoomableImage;
