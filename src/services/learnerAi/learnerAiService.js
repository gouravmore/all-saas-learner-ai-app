import axios from "axios";
import config from "../../utils/urlConstants.json";
import { getLocalData } from "../../utils/constants";
import { getVirtualId } from "../userservice/userService";

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

export const getContent = async (
  criteria,
  lang,
  limit,
  options,
  level = {}
) => {
  try {
    let url = `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${criteria}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`;

    if (
      options.mechanismId &&
      ![2, 3].includes(level) &&
      !options.mechanismId.startsWith("Fluency") &&
      options.mechanismId !== "PhrasesInAction"
    )
      url += `&mechanics_id=${options.mechanismId}`;
    if (options.competency) url += `&level_competency=${options.competency}`;
    if (options.tags && (lang === "en" || lang === "kn" || lang === "te"))
      url += `&tags=${options.tags}`;
    if (options.storyMode) url += `&story_mode=${options.storyMode}`;
    if (options.CEFR_level) url += `&CEFR_level=${options.CEFR_level}`;
    if (options.multilingual) url += `&multilingual=${options.multilingual}`;

    const response = await axios.get(url, getHeaders());

    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

export const getContentNew = async (
  criteria,
  lang,
  limit,
  options = {},
  level
) => {
  try {
    // M3 should not use recommendation API
    const isM3 = level === 3 || level === "3" || String(level) === "3";
    if (isM3) {
      // getContentNew (recommendation API) called for M3 - this should not happen
    }

    let url = `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT_NEW}`;
    const data = {
      language: lang,
      content_type: criteria,
    };
    const response = await axios.post(url, data, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

export const getFetchMilestoneDetails = async (lang) => {
  if (localStorage.getItem("apiToken")) {
    try {
      const response = await axios.get(
        `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}?language=${lang}`,
        getHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching milestone details:", error);
      throw error;
    }
  }
};

export const fetchGetSetResult = async (
  subSessionId,
  currentContentType,
  currentCollectionId,
  totalSyllableCount
) => {
  const session_id = getLocalData("sessionId");
  const lang = getLocalData("lang");

  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
      {
        sub_session_id: subSessionId,
        contentType: currentContentType,
        session_id: session_id,
        collectionId: currentCollectionId,
        totalSyllableCount: totalSyllableCount,
        language: lang,
        is_B_enable: true,
      },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error in getSetResult:", error);
    throw error;
  }
};

export const getSetResultPractice = async ({
  subSessionId,
  currentContentType,
  sessionId,
  totalSyllableCount,
  mechanism,
}) => {
  try {
    const maxLevel = getLocalData("max_level");

    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
      {
        sub_session_id: subSessionId,
        contentType: currentContentType || "Paragraph",
        session_id: sessionId,
        totalSyllableCount: totalSyllableCount,
        language: getLocalData("lang"),
        max_level: parseInt(maxLevel || process.env.REACT_APP_MAX_LEVEL, 10),
        is_mechanics: mechanism && mechanism?.id ? true : false,
      },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching set result:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

export const updateLearnerProfile = async (lang, requestBody) => {
  for (let key in requestBody) {
    if (typeof requestBody[key] === "string") {
      requestBody[key] = requestBody[key]
        .replace(/<script.*?>.*?<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .trim();
    }
  }

  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.UPDATE_LEARNER_PROFILE}/${lang}`,
      requestBody,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating learner profile:", error);
    throw error;
  }
};

export const addTowreRecord = async (
  audioPath,
  towreResult,
  language = "en"
) => {
  const sessionId = getLocalData("sessionId");

  const payload = {
    audio_file_path: `${audioPath}`,
    session_id: sessionId,
    language: language,
    towre_result: towreResult,
  };

  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/api/towre/addRecord`,
      payload,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error adding TOWRE record:", error);
    throw error;
  }
};

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const setMilestoneScore = async (
  language,
  milestoneLevel,
  sessionId,
  subSessionId
) => {
  try {
    // Construct URL - ensure no double slashes
    const baseUrl = API_LEARNER_AI_APP_HOST?.replace(/\/$/, "") || "";
    const path = config.URLS.SET_MILESTONE_SCORE?.replace(/^\//, "") || "";
    const url = `${baseUrl}/${path}`;

    const response = await axios.post(
      url,
      {
        language: language,
        milestone_level: milestoneLevel,
        session_id: sessionId,
        sub_session_id: subSessionId,
      },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error setting milestone score:", error);
    throw error;
  }
};
