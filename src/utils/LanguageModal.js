import React, { useState, useMemo, useEffect } from "react";
import MotherTongue from "./../assets/motherTongue.svg";
import { getLocalData, setLocalData } from "./constants";

// Language code to full language object mapping
const languageMap = {
  en: { lang: "English", text: "en", icon: "🇺🇸" },
  ta: { lang: "Tamil", text: "tn", icon: "அ" }, // Map ta to tn for storage
  tn: { lang: "Tamil", text: "tn", icon: "அ" },
  kn: { lang: "Kannada", text: "ka", icon: "ಅ" }, // Map kn to ka for storage
  ka: { lang: "Kannada", text: "ka", icon: "ಅ" },
  te: { lang: "Telugu", text: "te", icon: "అ" },
  gu: { lang: "Gujarati", text: "gu", icon: "ક" },
  hi: { lang: "Hindi", text: "hi", icon: "क" },
  or: { lang: "Odia", text: "or", icon: "କ" },
};

// Default language codes (fallback if env variable is not set)
const defaultLanguageCodes = ["ka", "tn", "te", "hi"];

// Get languages from environment variable or use defaults
const getNativeLanguages = () => {
  try {
    const envLanguages = process.env.REACT_APP_NATIVE_LANGUAGES;
    if (envLanguages) {
      const parsed = JSON.parse(envLanguages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Map language codes to full language objects
        const mappedLanguages = parsed
          .map((code) => {
            // Handle both string codes and existing object format
            if (typeof code === "string") {
              return languageMap[code.toLowerCase()];
            } else if (code && code.text) {
              // Already in object format, return as is
              return code;
            }
            return null;
          })
          .filter(Boolean); // Remove any null/undefined entries

        if (mappedLanguages.length > 0) {
          return mappedLanguages;
        }
      }
    }
  } catch (error) {
    console.warn(
      "Failed to parse REACT_APP_NATIVE_LANGUAGES, using defaults:",
      error
    );
  }
  // Fallback to default language codes mapped to objects
  return defaultLanguageCodes.map((code) => languageMap[code]).filter(Boolean);
};

// Get default native language from environment variable
const getDefaultNativeLanguage = (availableLanguages) => {
  try {
    const envDefaultLang = process.env.REACT_APP_DEFAULT_NATIVE_LANGUAGE;
    if (envDefaultLang) {
      const defaultCode = envDefaultLang.toLowerCase().trim();
      // Map the code to storage code (e.g., "kn" -> "ka", "ta" -> "tn")
      const mappedLang = languageMap[defaultCode];
      if (mappedLang) {
        const storageCode = mappedLang.text;
        // Check if this language is in the available languages list
        const isAvailable = availableLanguages.some(
          (lang) => lang.text === storageCode
        );
        if (isAvailable) {
          return storageCode;
        } else {
          console.warn(
            `Default native language "${defaultCode}" (storage: "${storageCode}") is not in the available languages list. Using first available language instead.`
          );
        }
      } else {
        console.warn(
          `Invalid default native language code: "${defaultCode}". Using first available language instead.`
        );
      }
    }
  } catch (error) {
    console.warn(
      "Failed to parse REACT_APP_DEFAULT_NATIVE_LANGUAGE, using first available language:",
      error
    );
  }
  // Fallback to first language in the list
  return availableLanguages[0]?.text || "ka";
};

const LanguageModalNew = ({ show, word, onClose }) => {
  // Get languages from env variable or defaults
  const availableLanguages = useMemo(() => getNativeLanguages(), []);

  // Get default native language from env variable or use first available
  const defaultLang = useMemo(() => {
    return getDefaultNativeLanguage(availableLanguages);
  }, [availableLanguages]);

  // Set default selected language from config or first language in the list
  const [selectedLang, setSelectedLang] = useState(defaultLang);

  // Update selected language if availableLanguages or default changes
  useEffect(() => {
    const newDefault = getDefaultNativeLanguage(availableLanguages);
    if (availableLanguages.length > 0) {
      // If current selection is not available, use default
      const isCurrentAvailable = availableLanguages.some(
        (l) => l.text === selectedLang
      );
      if (!isCurrentAvailable) {
        setSelectedLang(newDefault);
      } else if (defaultLang !== newDefault) {
        // If default changed and current is still valid, optionally update to new default
        // For now, we keep the current selection if it's valid
      }
    }
  }, [availableLanguages, defaultLang, selectedLang]);

  if (!show) return null;

  const handleConfirm = () => {
    setLocalData("nativeLang", selectedLang);
    setLocalData("nativeLangEnable", true);
    console.log("Selected language:", selectedLang);
    onClose();
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <img src={MotherTongue} alt="icon" style={styles.avatar} />
          <h2 style={styles.title}>Choose your help language</h2>
        </div>

        <div style={styles.langGrid}>
          {availableLanguages.map((entry, index) => {
            const isSelected = selectedLang === entry.text;
            return (
              <div
                key={index}
                style={{
                  ...styles.card,
                  backgroundColor: isSelected ? "#F37021" : "#fff",
                  color: isSelected ? "#fff" : "#333F61",
                  borderColor: isSelected ? "#F37021" : "#e0e0e0",
                  position: "relative",
                }}
                onClick={() => setSelectedLang(entry.text)}
              >
                <div
                  style={{
                    ...styles.cardIcon,
                    color: isSelected ? "#fff" : "#333F61",
                    // Apply Sree Krushnadevaraya font only for Telugu
                    fontFamily:
                      entry.text === "te"
                        ? "Sree Krushnadevaraya, Quicksand"
                        : "Quicksand",
                    // Slightly increase size for Sree Krushnadevaraya
                    fontSize:
                      entry.text === "te" ? "42px" : styles.cardIcon.fontSize,
                  }}
                >
                  {entry.icon}
                </div>
                <div
                  style={{
                    ...styles.cardText,
                    color: isSelected ? "#fff" : "#333F61",
                    // Apply Sree Krushnadevaraya font only for Telugu
                    fontFamily:
                      entry.text === "te"
                        ? "Sree Krushnadevaraya, Quicksand"
                        : "Quicksand",
                    // Slightly increase size for Sree Krushnadevaraya
                    fontSize:
                      entry.text === "te" ? "22px" : styles.cardText.fontSize,
                  }}
                >
                  {entry.lang}
                </div>
                <div style={isSelected ? styles.tickMark : styles.noTickMark}>
                  {isSelected && "✔"}
                </div>
              </div>
            );
          })}
        </div>

        <button style={styles.confirmBtn} onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 80,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "600px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "35px",
    justifyContent: "center",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
  },
  title: {
    fontSize: "36px",
    margin: 0,
    fontWeight: "600",
    fontFamily: "Quicksand",
    color: "#333F61",
  },
  langGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    marginBottom: "20px",
  },
  card: {
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
    padding: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontWeight: "600",
    fontFamily: "Quicksand",
  },
  cardIcon: {
    fontSize: "36px",
    marginBottom: "5px",
    fontWeight: "600",
    fontFamily: "Quicksand",
  },
  cardText: {
    fontSize: "20px",
    fontWeight: "600",
    fontFamily: "Quicksand",
  },
  tickMark: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#fff",
    color: "#F37021",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noTickMark: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#fff",
    border: "1.5px solid #999999",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtn: {
    background: "linear-gradient(to right, #00c6ff, #0072ff)",
    color: "#fff",
    padding: "12px 72px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    fontFamily: "Quicksand",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default LanguageModalNew;
