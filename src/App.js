import React, { useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material";
import { useNavigate } from "../node_modules/react-router-dom/dist/index";
import { StyledEngineProvider } from "@mui/material/styles";
import routes from "./routes";
import { AppContent } from "./views";
import theme from "./assets/styles/theme";
import "@tekdi/all-telemetry-sdk/index.js";
import axios from "axios";
import { initialize } from "./services/telementryService";
import { startEvent } from "./services/callTelemetryIntract";
import { getLocalData } from "./utils/constants";

const App = () => {
  const navigate = useNavigate();
  const ranonce = useRef(false);
  const telemetryInitRan = useRef(false);

  // Initialize Sunbird telemetry when user is already authenticated (embedded all-saas or returning standalone)
  useEffect(() => {
    const initTelemetryIfAuthenticated = async () => {
      if (telemetryInitRan.current) return;

      const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";
      const parentToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const tenantId = localStorage.getItem("tenantId");
      const apiToken = localStorage.getItem("apiToken");

      const hasAuth = isEmbedded ? parentToken && userId && tenantId : apiToken;

      if (!hasAuth) return;

      telemetryInitRan.current = true;

      const authToken = parentToken || apiToken || "";
      const uid =
        userId ||
        getLocalData("virtualId") ||
        localStorage.getItem("virtualId") ||
        apiToken ||
        "anonymous";
      const did =
        localStorage.getItem("deviceId") ||
        localStorage.getItem("did") ||
        "anonymous-device";

      await initialize({
        context: {
          mode: process.env.REACT_APP_MODE,
          authToken,
          did,
          uid,
          channel: process.env.REACT_APP_CHANNEL,
          env: process.env.REACT_APP_ENV,
          pdata: {
            id: process.env.REACT_APP_ID,
            ver: process.env.REACT_APP_VER,
            pid: process.env.REACT_APP_PID,
          },
          tags: [""],
          timeDiff: 0,
          host: process.env.REACT_APP_HOST,
          endpoint: process.env.REACT_APP_ENDPOINT,
          apislug: process.env.REACT_APP_APISLUG,
        },
        config: {},
        metadata: {},
      });

      if (!ranonce.current && !localStorage.getItem("contentSessionId")) {
        startEvent();
      }
      ranonce.current = true;
    };

    initTelemetryIfAuthenticated();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      window.telemetry &&
        window.telemetry.syncEvents &&
        window.telemetry.syncEvents();
    };

    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 400)
      ) {
        const errorMessage = error?.response?.data?.message
          ?.trim()
          ?.toLowerCase();
        if (
          errorMessage?.includes("unauthorized") ||
          errorMessage?.includes("token") ||
          errorMessage?.includes("logged")
        ) {
          if (
            localStorage.getItem("contentSessionId") &&
            process.env.REACT_APP_IS_APP_IFRAME === "true"
          ) {
            window.parent.postMessage(
              {
                message: "Logged out!",
              },
              window?.location?.ancestorOrigins?.[0] ||
                window.parent.location.origin
            );
            console.log("if logout!");
            localStorage.clear();
            sessionStorage.clear();
          } else {
            console.log("else logout!");
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AppContent routes={routes} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
