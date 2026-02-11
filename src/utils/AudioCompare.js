import React, { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import { Box } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";

const AudioRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const systemStreamRef = useRef(null);
  const currentSourceRef = useRef("mic");
  const [audioSource, setAudioSource] = useState(
    localStorage.getItem("audioSource") || "mic"
  ); // "mic" | "system"

  // Enable this selector only when explicitly turned on (e.g. for teacher/demo mode)
  const enableSourceSelector =
    process.env.REACT_APP_ENABLE_AUDIO_SOURCE_SELECTOR === "true";

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (systemStreamRef.current) {
        systemStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getMicStream = async () => {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  };

  const getSystemAudioStream = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      throw new Error(
        "System/Tab audio capture not supported in this browser. Please use a desktop Chrome/Edge browser."
      );
    }

    const raw = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    // We only need audio; stop video tracks immediately.
    raw.getVideoTracks().forEach((t) => t.stop());

    const audioTracks = raw.getAudioTracks();
    if (!audioTracks.length) {
      raw.getTracks().forEach((t) => t.stop());
      throw new Error(
        "No system audio captured. When selecting the tab/window, please enable 'Share audio'."
      );
    }

    return new MediaStream(audioTracks);
  };

  const handleSourceChange = (value) => {
    setAudioSource(value);
    try {
      localStorage.setItem("audioSource", value);
    } catch (e) {
      // fail silently if localStorage is unavailable
      console.error("Unable to persist audioSource:", e);
    }
  };

  const startRecording = async () => {
    const micStartTime = new Date().getTime();
    const duration = {
      ...JSON.parse(localStorage.getItem("duration")),
      micStartTime: micStartTime,
    };
    localStorage.setItem("duration", JSON.stringify(duration));
    try {
      if (!navigator.mediaDevices) {
        throw new Error(
          "navigator.mediaDevices is not available. Use HTTPS or localhost."
        );
      }

      const selectedSource = enableSourceSelector ? audioSource : "mic";
      currentSourceRef.current = selectedSource;

      let stream;
      if (selectedSource === "system") {
        const existing = systemStreamRef.current;
        const hasLiveTrack =
          existing &&
          existing.getAudioTracks().some((t) => t.readyState === "live");

        if (hasLiveTrack) {
          stream = existing;
        } else {
          const newStream = await getSystemAudioStream();
          systemStreamRef.current = newStream;
          stream = newStream;
        }
      } else {
        stream = await getMicStream();
      }

      setStatus("recording");
      if (props.setEnableNext) {
        props.setEnableNext(false);
      }

      mediaStreamRef.current = stream;

      // Use RecordRTC with specific configurations to match the blob structure
      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav", // Ensuring the same MIME type as AudioRecorderCompair
        recorderType: RecordRTC.StereoAudioRecorder, // Use StereoAudioRecorder for better compatibility
        numberOfAudioChannels: 1, // Match the same number of audio channels
        desiredSampRate: 16000, // Adjust the sample rate if necessary to match
        disableLogs: true,
      });

      recorderRef.current.startRecording();

      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
      if (props.setOpenMessageDialog) {
        props.setOpenMessageDialog({
          message:
            err?.message ||
            "Unable to start recording. Please check microphone or system audio permissions.",
          isError: true,
        });
      }
    }
  };

  const stopRecording = () => {
    const micStopTime = new Date().getTime();
    const duration = {
      ...JSON.parse(localStorage.getItem("duration")),
      micStopTime: micStopTime,
    };
    localStorage.setItem("duration", JSON.stringify(duration));
    setStatus("inactive");
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();

        if (blob) {
          setAudioBlob(blob);
          saveBlob(blob); // Persist the blob
        } else {
          console.error("Failed to retrieve audio blob.");
        }

        // Stop the media stream for mic recordings.
        // For system audio we keep the stream alive to avoid repeated browser prompts.
        if (mediaStreamRef.current && currentSourceRef.current === "mic") {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        setIsRecording(false);
      });
    }
    if (props.setEnableNext) {
      props.setEnableNext(true);
    }
  };

  const saveBlob = (blob) => {
    const url = window.URL.createObjectURL(blob);
    props?.setRecordedAudio(url);
  };

  return (
    <div>
      <div>
        {(() => {
          if (status === "recording") {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <Box
                  sx={{ cursor: "pointer", height: "38px" }}
                  onClick={stopRecording}
                >
                  <StopButton />
                </Box>
                <Box style={{ marginTop: "50px", marginBottom: "50px" }}>
                  <RecordVoiceVisualizer />
                </Box>
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
                className="game-action-button"
              >
                {enableSourceSelector && (
                  <Box
                    sx={{
                      mr: 2,
                      display: "flex",
                      gap: 1,
                      backgroundColor: "#FFFFFF",
                      borderRadius: "999px",
                      padding: "4px",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Box
                      onClick={() => handleSourceChange("mic")}
                      sx={{
                        cursor: "pointer",
                        px: 2,
                        py: 0.5,
                        borderRadius: "999px",
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: "Quicksand, sans-serif",
                        backgroundColor:
                          audioSource === "mic" ? "#22c55e" : "transparent",
                        color: audioSource === "mic" ? "#FFFFFF" : "#333333",
                        transition: "all 0.15s ease-out",
                        "&:hover": {
                          backgroundColor:
                            audioSource === "mic" ? "#16a34a" : "#f3f4f6",
                        },
                      }}
                    >
                      Mic
                    </Box>
                    <Box
                      onClick={() => handleSourceChange("system")}
                      sx={{
                        cursor: "pointer",
                        px: 2,
                        py: 0.5,
                        borderRadius: "999px",
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: "Quicksand, sans-serif",
                        backgroundColor:
                          audioSource === "system" ? "#22c55e" : "transparent",
                        color: audioSource === "system" ? "#FFFFFF" : "#333333",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s ease-out",
                        "&:hover": {
                          backgroundColor:
                            audioSource === "system" ? "#16a34a" : "#f3f4f6",
                        },
                      }}
                    >
                      System audio
                    </Box>
                  </Box>
                )}
                {props?.originalText &&
                  (!props.dontShowListen || props.recordedAudio) && (
                    <>
                      {!props.pauseAudio ? (
                        <div
                          onClick={() => {
                            props.playAudio(true);
                          }}
                        >
                          <Box sx={{ cursor: "pointer" }}>
                            <ListenButton />
                          </Box>
                        </div>
                      ) : (
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            props.playAudio(false);
                          }}
                        >
                          <StopButton />
                        </Box>
                      )}
                    </>
                  )}

                <div>
                  {props?.originalText && !props.showOnlyListen && (
                    <Box
                      marginLeft={
                        !props.dontShowListen || props.recordedAudio
                          ? "32px"
                          : "0px"
                      }
                      sx={{ cursor: "pointer" }}
                      onClick={startRecording}
                    >
                      {!props.recordedAudio ? <SpeakButton /> : <RetryIcon />}
                    </Box>
                  )}
                </div>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default AudioRecorder;
