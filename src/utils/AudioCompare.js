import React, { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import { Box, CircularProgress } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";
import playButton from "../../src/assets/listen.png";
import pauseButton from "../../src/assets/pause.png";
import PropTypes from "prop-types";

const AudioRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [showLoader, setShowLoader] = useState(false);
  const [audioSource, setAudioSource] = useState(
    localStorage.getItem("audioSource") || "mic"
  ); // "mic" | "system"

  // Enable this selector only when explicitly turned on (e.g. for teacher/demo mode)
  const enableSourceSelector =
    process.env.REACT_APP_ENABLE_AUDIO_SOURCE_SELECTOR === "true";

  console.log("pageName", props.pageName);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
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
    try {
      if (!navigator.mediaDevices) {
        throw new Error(
          "navigator.mediaDevices is not available. Use HTTPS or localhost."
        );
      }

      const selectedSource = enableSourceSelector ? audioSource : "mic";

      const stream =
        selectedSource === "system"
          ? await getSystemAudioStream()
          : await getMicStream();

      if (props.setEnableNext) {
        props.setEnableNext(false);
      }
      setStatus("recording");
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

      props.handleStartRecording?.();
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
    setShowLoader(true);
    const timeoutId = setTimeout(() => {
      setShowLoader(false);
      setStatus("inactive");
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {
          const blob = recorderRef.current.getBlob();
          if (blob) {
            setAudioBlob(blob);
            saveBlob(blob);
          } else {
            console.error("Failed to retrieve audio blob.");
          }
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          }
          setIsRecording(false);
          props.setEnableNext?.(true);

          props.handleStopRecording?.();
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const saveBlob = (blob) => {
    const url = window.URL.createObjectURL(blob);
    props?.setRecordedAudio(url);
  };

  const getPulseAnimationStyle = (color) => ({
    position: "absolute",
    width: "90px",
    height: "90px",
    backgroundColor: color,
    borderRadius: "50%",
    animation: "pulse 1.2s linear infinite",
    "@keyframes pulse": {
      "0%": {
        transform: "scale(0.6)",
        opacity: 0,
      },
      "50%": {
        opacity: 1,
      },
      "100%": {
        transform: "scale(1.4)",
        opacity: 0,
      },
    },
  });

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
                  sx={{
                    cursor: "pointer",
                    ...((props.pageName === "m7" ||
                      props.pageName === "m8") && {
                      width: "90px",
                      height: "90px",
                      borderRadius: "50%",
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }),
                  }}
                  onClick={stopRecording}
                >
                  <Box
                    sx={
                      props.pageName === "m7" ||
                      (props.pageName === "m8" && props.buttonAnimation)
                        ? getPulseAnimationStyle("#FF4B4B33")
                        : {}
                    }
                  />
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <StopButton
                      height={
                        props.pageName == "m7" || props.pageName === "m8"
                          ? 45
                          : 70
                      }
                      width={
                        props.pageName == "m7" || props.pageName === "m8"
                          ? 45
                          : 70
                      }
                    />
                  </Box>
                </Box>
                {showLoader ? (
                  <div className="loader"></div>
                ) : (
                  <Box style={{ marginTop: "10px", marginBottom: "50px" }}>
                    {props.pageName !== "m8" && <RecordVoiceVisualizer />}
                  </Box>
                )}
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: !props.showOnlyListen ? "flex" : "",
                  margin: "0 auto",
                  justifyContent: "center",
                  alignItems: "center",
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
                {props.enableAfterLoad &&
                  props?.originalText &&
                  (!props.dontShowListen ||
                    props.recordedAudio ||
                    !props.pageName === "m8") && (
                    <>
                      {!props.isShowCase && !(props.pageName === "m8") && (
                        <Box>
                          {!props.pauseAudio ? (
                            <div
                              onClick={() => {
                                props.playAudio(true);
                              }}
                            >
                              <Box sx={{ cursor: "pointer" }}>
                                <ListenButton
                                  height={
                                    props.pageName == "m7" ||
                                    props.pageName === "m8"
                                      ? 45
                                      : 70
                                  }
                                  width={
                                    props.pageName == "m7" ||
                                    props.pageName === "m8"
                                      ? 45
                                      : 70
                                  }
                                />
                              </Box>
                            </div>
                          ) : (
                            <Box
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                props.playAudio(false);
                              }}
                            >
                              <StopButton
                                height={
                                  props.pageName == "m7" ||
                                  props.pageName === "m8"
                                    ? 45
                                    : 70
                                }
                                width={
                                  props.pageName == "m7" ||
                                  props.pageName === "m8"
                                    ? 45
                                    : 70
                                }
                              />
                            </Box>
                          )}
                        </Box>
                      )}
                      <Box
                        sx={{
                          marginLeft: props.isShowCase ? "" : "30px",
                          cursor: "pointer",
                        }}
                      >
                        {props.recordedAudio ? (
                          <img
                            onClick={() =>
                              props.playRecordedAudio(
                                !props.isStudentAudioPlaying
                              )
                            }
                            style={{
                              height:
                                props.pageName == "m7" ||
                                props.pageName === "m8"
                                  ? 45
                                  : 70,
                            }}
                            src={
                              props.isStudentAudioPlaying
                                ? pauseButton
                                : playButton
                            }
                            alt={props.isStudentAudioPlaying ? "Pause" : "Play"}
                          />
                        ) : (
                          <Box></Box>
                        )}
                      </Box>
                    </>
                  )}

                <div>
                  {props.enableAfterLoad ? (
                    props?.originalText &&
                    !props.showOnlyListen && (
                      <Box
                        marginLeft={props.recordedAudio ? "32px" : "0px"}
                        sx={{ cursor: "pointer" }}
                        onClick={startRecording}
                      >
                        {!props.recordedAudio ? (
                          <Box
                            sx={{
                              ...((props.pageName == "m7" ||
                                props.pageName === "m8") && {
                                width: "90px",
                                height: "90px",
                                borderRadius: "50%",
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }),
                            }}
                          >
                            <Box
                              sx={
                                props.pageName == "m7" ||
                                (props.pageName === "m8" &&
                                  props.buttonAnimation)
                                  ? getPulseAnimationStyle("#58CC0233")
                                  : {}
                              }
                            />
                            <Box
                              sx={{
                                position: "relative",
                                zIndex: 1,
                              }}
                            >
                              <SpeakButton
                                height={
                                  props.pageName == "m7" ||
                                  props.pageName === "m8"
                                    ? 45
                                    : 70
                                }
                                width={
                                  props.pageName == "m7" ||
                                  props.pageName === "m8"
                                    ? 45
                                    : 70
                                }
                              />
                            </Box>
                          </Box>
                        ) : (
                          <RetryIcon
                            height={
                              props.pageName == "m7" || props.pageName === "m8"
                                ? 45
                                : 70
                            }
                            width={
                              props.pageName == "m7" || props.pageName === "m8"
                                ? 45
                                : 70
                            }
                          />
                        )}
                      </Box>
                    )
                  ) : (
                    <Box sx={{ display: "flex" }}>
                      <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
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

AudioRecorder.propTypes = {
  enableAfterLoad: PropTypes.bool,
  showOnlyListen: PropTypes.bool,
  recordedAudio: PropTypes.string,
  originalText: PropTypes.string,
};

export default AudioRecorder;
