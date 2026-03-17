import axios from "axios";
import { getLocalData } from "../../utils/constants";
import config from "../../utils/urlConstants.json";
import { getVirtualId } from "../userservice/userService";

const API_BASE_URL_ORCHESTRATION =
  process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST;

const API_LEARNER_AI_APP_HOST = process.env.REACT_APP_LEARNER_AI_APP_HOST;

const getHeaders = () => {
  const token = localStorage.getItem("apiToken");
  const parentToken = localStorage.getItem("token"); // From all-saas-app
  const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";

  // When embedded, use parent token if apiToken not available
  // This allows the app to work when embedded without requiring JOSE token
  const authToken = token || (isEmbedded ? parentToken : null);

  return {
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      "Content-Type": "application/json",
    },
  };
};

export const getLessonProgressByID = async (lang) => {
  try {
    const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
    const userId = localStorage.getItem("userId"); // From all-saas-app
    const tenantId = localStorage.getItem("tenantId"); // From all-saas-app

    // When embedded, include userId and tenantId in query params
    let url = `${API_BASE_URL_ORCHESTRATION}/${config.URLS.GET_LESSON_PROGRESS_BY_ID}?language=${lang}`;
    if (isEmbedded && userId && tenantId) {
      url += `&userId=${userId}&tenantId=${tenantId}`;
    }

    const response = await axios.get(url, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching lesson progress by ID:", error);
    throw error;
  }
};

export const fetchUserPoints = async () => {
  try {
    const sessionId = getLocalData("sessionId");
    const lang = getLocalData("lang");
    const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
    const userId = localStorage.getItem("userId"); // From all-saas-app
    const tenantId = localStorage.getItem("tenantId"); // From all-saas-app

    // When embedded, include userId and tenantId in query params
    let url = `${API_BASE_URL_ORCHESTRATION}/${
      config.URLS.GET_POINTER
    }/${encodeURIComponent(sessionId)}?language=${lang}`;
    if (isEmbedded && userId && tenantId) {
      url += `&userId=${userId}&tenantId=${tenantId}`;
    }

    const response = await axios.get(url, getHeaders());
    return response?.data?.result?.totalLanguagePoints || 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
};

export const addPointer = async (points, milestone) => {
  const sessionId = getLocalData("sessionId");
  const lang = getLocalData("lang");
  const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
  const userId = localStorage.getItem("userId"); // From all-saas-app
  const tenantId = localStorage.getItem("tenantId"); // From all-saas-app

  try {
    const requestBody = {
      sessionId: sessionId,
      points: points,
      language: lang,
      milestone: milestone,
    };
    // Embedded mode: Include userId and tenantId in request body
    if (isEmbedded && userId && tenantId) {
      requestBody.userId = userId;
      requestBody.tenantId = tenantId;
    }
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.ADD_POINTER}`,
      requestBody,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
};

export const addCorrectPracticeWords = async () => {
  const correctPracticeWords = getLocalData("correctPracticeWords");
  const token = localStorage.getItem("apiToken");
  const parentToken = localStorage.getItem("token"); // From all-saas-app
  const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
  const userId = localStorage.getItem("userId"); // From all-saas-app
  const tenantId = localStorage.getItem("tenantId"); // From all-saas-app

  if (!correctPracticeWords || correctPracticeWords.length === 0) {
    console.warn("No correct practice words to send.");
    return;
  }

  // When embedded, use parent token if apiToken not available
  const authToken = token || (isEmbedded ? parentToken : null);
  if (!authToken) {
    console.warn("addCorrectPracticeWords: No token available");
    return;
  }

  try {
    const requestBody = { correctPracticeWords };
    // Embedded mode: Include userId and tenantId in request body
    if (isEmbedded && userId && tenantId) {
      requestBody.userId = userId;
      requestBody.tenantId = tenantId;
    }

    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/api/towre/addCorrectWord`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending correctPracticeWords:", error);
    throw error;
  }
};

export const updateCorrectPracticeWords = async (updates) => {
  const token = localStorage.getItem("apiToken");
  const parentToken = localStorage.getItem("token"); // From all-saas-app
  const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
  const userId = localStorage.getItem("userId"); // From all-saas-app
  const tenantId = localStorage.getItem("tenantId"); // From all-saas-app

  if (!updates || updates.length === 0) {
    console.warn("No correct practice words to send.");
    return;
  }

  // When embedded, use parent token if apiToken not available
  const authToken = token || (isEmbedded ? parentToken : null);
  if (!authToken) {
    console.warn("updateCorrectPracticeWords: No token available");
    return;
  }

  try {
    const requestBody = { updates };
    // Embedded mode: Include userId and tenantId in request body
    if (isEmbedded && userId && tenantId) {
      requestBody.userId = userId;
      requestBody.tenantId = tenantId;
    }

    const response = await axios.put(
      `${API_LEARNER_AI_APP_HOST}/api/towre/updateCorrectWords`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending correctPracticeWords:", error);
    throw error;
  }
};

export const getCorrectPracticeWords = async (understood) => {
  const token = localStorage.getItem("apiToken");
  const parentToken = localStorage.getItem("token"); // From all-saas-app
  const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
  const userId = localStorage.getItem("userId"); // From all-saas-app
  const tenantId = localStorage.getItem("tenantId"); // From all-saas-app
  const lang = getLocalData("lang");

  // When embedded, use parent token if apiToken not available
  const authToken = token || (isEmbedded ? parentToken : null);

  // When embedded, include userId and tenantId in query params
  let apiUrl = `${API_LEARNER_AI_APP_HOST}/api/towre/getCorrectWords?practiced=true&learned=true&understood=${understood}&language=${lang}`;
  if (isEmbedded && userId && tenantId) {
    apiUrl += `&userId=${userId}&tenantId=${tenantId}`;
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching correctPracticeWords:", error);
    throw error;
  }
};

export const createLearnerProgress = async (
  subSessionId,
  milestoneLevel,
  totalSyllableCount,
  ansSelectionStatus
) => {
  const sessionId = getLocalData("sessionId");
  const language = getLocalData("lang");
  const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
  const userId = localStorage.getItem("userId"); // From all-saas-app
  const tenantId = localStorage.getItem("tenantId"); // From all-saas-app

  try {
    const requestBody = {
      sessionId: sessionId,
      subSessionId: subSessionId,
      milestoneLevel: milestoneLevel,
      language: language,
      ansSelectionStatus: ansSelectionStatus,
    };
    if (totalSyllableCount !== undefined) {
      requestBody.totalSyllableCount = totalSyllableCount;
    }
    // Embedded mode: Include userId and tenantId in request body
    if (isEmbedded && userId && tenantId) {
      requestBody.userId = userId;
      requestBody.tenantId = tenantId;
    }
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.CREATE_LEARNER_PROGRESS}`,
      requestBody,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error creating learner progress:", error);
    throw error;
  }
};

export const addLesson = async ({
  sessionId,
  milestone = "practice",
  lesson = "0",
  progress = 0,
  language,
  milestoneLevel,
  subMilestoneLevel,
}) => {
  // Validate required fields
  if (!sessionId) {
    console.error("addLesson: sessionId is required");
    throw new Error("sessionId is required");
  }
  if (!language) {
    console.error("addLesson: language is required");
    throw new Error("language is required");
  }
  if (!milestoneLevel) {
    console.error("addLesson: milestoneLevel is required");
    throw new Error("milestoneLevel is required");
  }

  // Ensure progress is between 0 and 100
  const cappedProgress = Math.max(0, Math.min(100, Math.round(progress)));
  if (progress !== cappedProgress) {
    console.warn(
      `addLesson: Progress ${progress} was capped to ${cappedProgress}`
    );
  }

  const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
  const userId = localStorage.getItem("userId"); // From all-saas-app
  const tenantId = localStorage.getItem("tenantId"); // From all-saas-app

  try {
    const requestBody = {
      sessionId: sessionId,
      milestone: milestone,
      lesson: lesson,
      progress: cappedProgress,
      language: language,
      milestoneLevel: milestoneLevel,
      subMilestoneLevel: subMilestoneLevel,
    };
    // Embedded mode: Include userId and tenantId in request body
    if (isEmbedded && userId && tenantId) {
      requestBody.userId = userId;
      requestBody.tenantId = tenantId;
    }
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.ADD_LESSON}`,
      requestBody,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error adding lesson:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("apiToken");

    if (!token) return;

    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.GET_LOGOUT}`,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding lesson:", error);
    throw error;
  }
};
