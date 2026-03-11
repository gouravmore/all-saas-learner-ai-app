import axios from "axios";
import config from "../../utils/urlConstants.json";
import { getLocalData } from "../../utils/constants";

const API_BASE_URL_CONTENT_SERVICE =
  process.env.REACT_APP_CONTENT_SERVICE_APP_HOST;

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

export const fetchAssessmentData = async (lang) => {
  try {
    const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
    const userId = localStorage.getItem("userId"); // From all-saas-app
    const tenantId = localStorage.getItem("tenantId"); // From all-saas-app

    const requestBody = {
      tags: ["ASER"],
      language: lang,
    };
    // Embedded mode: Include userId and tenantId in request body
    if (isEmbedded && userId && tenantId) {
      requestBody.userId = userId;
      requestBody.tenantId = tenantId;
    }

    const response = await axios.post(
      `${API_BASE_URL_CONTENT_SERVICE}/${config.URLS.GET_ASSESSMENT}`,
      requestBody,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching assessment:", error);
    throw error;
  }
};

export const fetchPaginatedContent = async (collectionId, limit, page = 1) => {
  try {
    const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
    const userId = localStorage.getItem("userId"); // From all-saas-app
    const tenantId = localStorage.getItem("tenantId"); // From all-saas-app

    // When embedded, include userId and tenantId in query params
    let url = `${API_BASE_URL_CONTENT_SERVICE}/${config.URLS.GET_PAGINATION}?page=${page}&limit=${limit}&collectionId=${collectionId}&multilingual=true`;
    if (isEmbedded && userId && tenantId) {
      url += `&userId=${userId}&tenantId=${tenantId}`;
    }

    const response = await axios.get(url, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching pagination data:", error);
    throw error; // Rethrow for handling in the calling function
  }
};
