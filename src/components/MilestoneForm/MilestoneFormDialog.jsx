import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { getLocalData } from "../../utils/constants";
import { setMilestoneScore } from "../../services/learnerAi/learnerAiService";

const MilestoneFormDialog = ({ language, onSuccess, onError }) => {
  const location = useLocation();
  const [openMilestoneForm, setOpenMilestoneForm] = useState(false);
  const [formData, setFormData] = useState({
    language: language || "en",
    milestone_level: "",
    session_id: "",
    sub_session_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Auto-open form when on /Reset route
  useEffect(() => {
    if (location.pathname === "/Reset" && !openMilestoneForm) {
      const sessionId = getLocalData("sessionId") || "";
      const subSessionId = getLocalData("sub_session_id") || "";
      setFormData({
        language: language || "en",
        milestone_level: "",
        session_id: sessionId,
        sub_session_id: subSessionId,
      });
      setOpenMilestoneForm(true);
    }
  }, [location.pathname, language, openMilestoneForm]);

  // Close dialog if route changes away from /Reset
  useEffect(() => {
    if (location.pathname !== "/Reset" && openMilestoneForm) {
      setOpenMilestoneForm(false);
    }
  }, [location.pathname, openMilestoneForm]);

  const handleSubmit = async () => {
    if (
      !formData.language ||
      !formData.milestone_level ||
      !formData.session_id ||
      !formData.sub_session_id
    ) {
      setMessage({ text: "Please fill all fields", isError: true });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", isError: false });
    try {
      await setMilestoneScore(
        formData.language,
        formData.milestone_level,
        formData.session_id,
        formData.sub_session_id
      );
      setMessage({ text: "Milestone score set successfully!", isError: false });
      if (onSuccess) {
        onSuccess("Milestone score set successfully!");
      }
      // Reset form after success
      setTimeout(() => {
        setOpenMilestoneForm(false);
        setFormData({
          language: language || "en",
          milestone_level: "",
          session_id: "",
          sub_session_id: "",
        });
        setMessage({ text: "", isError: false });
      }, 2000);
    } catch (error) {
      setMessage({
        text: "Failed to set milestone. Please try again.",
        isError: true,
      });
      if (onError) {
        onError("Failed to set milestone. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only render if on /Reset route
  if (location.pathname !== "/Reset") {
    return null;
  }

  return (
    <Dialog
      open={openMilestoneForm}
      onClose={() => !isSubmitting && setOpenMilestoneForm(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          padding: "20px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "Quicksand",
          fontWeight: 700,
          fontSize: "24px",
          textAlign: "center",
        }}
      >
        Set Milestone
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Language"
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
            fullWidth
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
          <TextField
            label="Milestone Level"
            value={formData.milestone_level}
            onChange={(e) =>
              setFormData({ ...formData, milestone_level: e.target.value })
            }
            fullWidth
            disabled={isSubmitting}
            placeholder="e.g., m5"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
          <TextField
            label="Session ID"
            value={formData.session_id}
            onChange={(e) =>
              setFormData({ ...formData, session_id: e.target.value })
            }
            fullWidth
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
          <TextField
            label="Sub Session ID"
            value={formData.sub_session_id}
            onChange={(e) =>
              setFormData({ ...formData, sub_session_id: e.target.value })
            }
            fullWidth
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
          {/* Success/Error Message */}
          {message.text && (
            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: "10px",
                backgroundColor: message.isError ? "#ffebee" : "#e8f5e9",
                border: `1px solid ${message.isError ? "#f44336" : "#4caf50"}`,
              }}
            >
              <Typography
                sx={{
                  color: message.isError ? "#d32f2f" : "#2e7d32",
                  fontWeight: 600,
                  fontSize: "16px",
                  fontFamily: "Quicksand",
                  textAlign: "center",
                }}
              >
                {message.text}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          padding: "20px",
          gap: 2,
        }}
      >
        <Button
          onClick={() => setOpenMilestoneForm(false)}
          disabled={isSubmitting}
          sx={{
            minWidth: "120px",
            height: "45px",
            borderRadius: "10px",
            fontFamily: "Quicksand",
            fontWeight: 600,
            backgroundColor: "#ccc",
            color: "#000",
            "&:hover": {
              backgroundColor: "#bbb",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            minWidth: "120px",
            height: "45px",
            borderRadius: "10px",
            fontFamily: "Quicksand",
            fontWeight: 600,
            backgroundColor: "#6DAF19",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#5a9a15",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
              color: "#666",
            },
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MilestoneFormDialog;
