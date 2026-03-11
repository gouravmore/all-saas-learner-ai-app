import React, { useEffect, Fragment } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../views/Snackbar/CustomSnackbar";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = (props) => {
  let virtualId;
  const TOKEN = localStorage.getItem("apiToken");
  // if (TOKEN) {
  //   const tokenDetails = jwtDecode(TOKEN);
  //   virtualId = JSON.stringify(tokenDetails?.virtual_id);
  // }

  // Check if embedded in iframe
  const isEmbedded = process.env.REACT_APP_IS_APP_IFRAME === "true";

  // Check for parent app's authentication (from all-saas-app)
  const parentToken = localStorage.getItem("token"); // From all-saas-app
  const userId = localStorage.getItem("userId"); // From all-saas-app
  const tenantId = localStorage.getItem("tenantId"); // From all-saas-app

  // When embedded, check for parent app's authentication
  const hasAuth = isEmbedded
    ? parentToken && userId && tenantId // Parent app auth
    : TOKEN; // Standalone app auth

  const navigate = useNavigate();
  useEffect(() => {
    if (!hasAuth && props.requiresAuth) {
      if (isEmbedded) {
        // When embedded, don't show login - parent should handle auth
        console.warn("No authentication found in embedded mode");
        // Optionally send message to parent
        if (window.parent) {
          try {
            window.parent.postMessage(
              { message: "Authentication required" },
              window?.location?.ancestorOrigins?.[0] ||
                window.parent.location.origin
            );
          } catch (error) {
            console.error("Error sending postMessage:", error);
          }
        }
      } else {
        navigate("/login");
      }
    }
  }, [hasAuth, props.requiresAuth, isEmbedded, navigate]);

  return <>{props.children}</>;
};
const AppContent = ({ routes }) => {
  // const navigate = useNavigate();
  // const location = useLocation();

  return (
    <Fragment>
      <CustomizedSnackbars />
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={
              <PrivateRoute requiresAuth={route.requiresAuth}>
                <route.component />
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </Fragment>
  );
};

export default AppContent;
