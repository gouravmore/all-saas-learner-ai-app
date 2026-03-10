import axios from "axios";
import { getLocalData } from "../../utils/constants";
import config from "../../utils/urlConstants.json";
import { getVirtualId } from "../userservice/userService";

const API_BASE_URL_ORCHESTRATION =
  process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST;

const API_LEARNER_AI_APP_HOST = process.env.REACT_APP_LEARNER_AI_APP_HOST;

const getHeaders = () => {
  const token = localStorage.getItem("apiToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getLessonProgressByID = async (lang) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.GET_LESSON_PROGRESS_BY_ID}?language=${lang}`,
      getHeaders()
    );
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

    const response = await axios.get(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.GET_POINTER}/${sessionId}?language=${lang}`,
      getHeaders()
    );
    return response?.data?.result?.totalLanguagePoints || 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
};

export const addPointer = async (points, milestone) => {
  const sessionId = getLocalData("sessionId");
  const lang = getLocalData("lang");

  try {
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.ADD_POINTER}`,
      {
        sessionId: sessionId,
        points: points,
        language: lang,
        milestone: milestone,
      },
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

  if (!correctPracticeWords || correctPracticeWords.length === 0) {
    console.warn("No correct practice words to send.");
    return;
  }

  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/api/towre/addCorrectWord`,
      { correctPracticeWords },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

  if (!updates || updates.length === 0) {
    console.warn("No correct practice words to send.");
    return;
  }

  try {
    const response = await axios.put(
      `${API_LEARNER_AI_APP_HOST}/api/towre/updateCorrectWords`,
      { updates },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
  const lang = getLocalData("lang");

  const apiUrl = `${API_LEARNER_AI_APP_HOST}/api/towre/getCorrectWords?practiced=true&learned=true&understood=${understood}&language=${lang}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
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

  try {
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.ADD_LESSON}`,
      {
        sessionId: sessionId,
        milestone: milestone,
        lesson: lesson,
        progress: cappedProgress,
        language: language,
        milestoneLevel: milestoneLevel,
        subMilestoneLevel: subMilestoneLevel,
      },
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
