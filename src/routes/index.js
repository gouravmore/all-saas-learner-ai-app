/* Route declarations for the app */

import { jwtDecode } from "jwt-decode";
import * as reviews from "../views";

const routData = [
  {
    id: "route-001",
    path: "/",
    component: reviews.DiscoverStart,
    requiresAuth: true,
  },
  {
    id: "route-002",
    path: "/discover",
    component: reviews.Discover,
    requiresAuth: true,
  },
  {
    id: "route-003",
    path: "/discover-start",
    component: reviews.DiscoverStart,
    requiresAuth: true,
  },
  {
    id: "route-004",
    path: "/discover-end",
    component: reviews.DiscoverEnd,
    requiresAuth: true,
  },
  {
    id: "route-005",
    path: "/practice",
    component: reviews.PracticePage,
    requiresAuth: true,
  },

  {
    id: "route-006",
    path: "/assesment",
    component: reviews.Assesment,
    requiresAuth: true,
  },
  {
    id: "route-007",
    path: "/assesment-end",
    component: reviews.AssesmentEnd,
    requiresAuth: true,
  },

  {
    id: "route-008",
    path: "/level-page",
    component: reviews.HomePage,
    requiresAuth: true,
  },
  {
    id: "route-009",
    path: "/_practice",
    component: reviews.PracticeRedirectPage,
    requiresAuth: true,
  },
  {
    id: "route-010",
    path: "/login",
    component: reviews.LoginPage,
    requiresAuth: false,
  },
  {
    id: "route-011",
    path: "/letter-hunt",
    component: reviews.LetterHunt,
    requiresAuth: true,
  },
  {
    id: "route-012",
    path: "/towre-flow",
    component: reviews.TowreFlowPage,
    requiresAuth: true,
  },
  {
    id: "route-016",
    path: "/Reset",
    component: reviews.MilestoneFormPage,
    requiresAuth: true,
  },
  // ============================================
  // DEMO ROUTE - Letter Hunt Game Standalone Demo
  // TODO: Remove this route after demo is complete
  // Accessible at: /letter-hunt-demo or /letter-hunt-demo/:level
  // Note: More specific route (with :level) must come first
  // ============================================
  {
    id: "route-013-demo-level",
    path: "/letter-hunt-demo/:level",
    component: reviews.LetterHuntDemo,
    requiresAuth: false, // Set to false for easy demo access
  },
  {
    id: "route-013-demo",
    path: "/letter-hunt-demo",
    component: reviews.LetterHuntDemo,
    requiresAuth: false, // Set to false for easy demo access
  },
  // ============================================
  // DEMO ROUTE - Letter Launcher Game Standalone Demo
  // TODO: Remove this route after demo is complete
  // Accessible at: /letter-launcher-demo or /letter-launcher-demo/:level
  // Note: More specific route (with :level) must come first
  // ============================================
  {
    id: "route-014-demo-level",
    path: "/letter-launcher-demo/:level",
    component: reviews.LetterLauncherDemo,
    requiresAuth: false, // Set to false for easy demo access
  },
  {
    id: "route-014-demo",
    path: "/letter-launcher-demo",
    component: reviews.LetterLauncherDemo,
    requiresAuth: false, // Set to false for easy demo access
  },
  // ============================================
  // DEMO ROUTE - Memory Challenge Game Standalone Demo
  // TODO: Remove this route after demo is complete
  // Accessible at: /memory-demo or /memory-demo/:level
  // Note: More specific route (with :level) must come first
  // ============================================
  {
    id: "route-015-demo-level",
    path: "/memory-demo/:level",
    component: reviews.MemoryDemo,
    requiresAuth: false, // Set to false for easy demo access
  },
  {
    id: "route-015-demo",
    path: "/memory-demo",
    component: reviews.MemoryDemo,
    requiresAuth: false, // Set to false for easy demo access
  },
];
// add login route for test rig
const TOKEN = localStorage.getItem("apiToken");
// let virtualId;
// if (TOKEN) {
//   const tokenDetails = jwtDecode(TOKEN);
//   virtualId = JSON.stringify(tokenDetails?.virtual_id);
// }else{
//   virtualId = null;
// }
const isLogin = process.env.REACT_APP_IS_IN_APP_AUTHORISATION === "true";

if (isLogin && !TOKEN) {
  routData.push({
    id: "route-000",
    path: "*",
    component: reviews.LoginPage,
    requiresAuth: false,
  });
} else {
  routData.push({
    id: "route-000",
    path: "*",
    component: reviews.DiscoverStart,
    requiresAuth: false,
  });
}

export default routData;
