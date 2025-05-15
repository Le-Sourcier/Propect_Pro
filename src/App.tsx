import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Auth & routes protection
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CookiesRule from "./pages/CookiesRule";
import Loader from "./components/ui/components/Loader";

// Lazy-loaded pages
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AccounVerification = lazy(() => import("./pages/VerifyMail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ScrapingModule = lazy(() => import("./pages/ScrapingModule"));
const EnrichmentModule = lazy(() => import("./pages/EnrichmentModule"));
const Settings = lazy(() => import("./pages/settings"));
const AccountSettings = lazy(() => import("./pages/settings/AccountSettings"));
const NotificationSettings = lazy(
  () => import("./pages/settings/NotificationSettings")
);
const PrivacySettings = lazy(() => import("./pages/settings/PrivacySettings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/signin" replace />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-mail" element={<AccounVerification />} />
              {/* Protected dashboard */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />

                <Route path="scraping">
                  <Route
                    index
                    element={<Navigate to="/scraping/new" replace />}
                  />
                  <Route path=":tab" element={<ScrapingModule />} />
                  <Route path="jobs/:jobId" element={<ScrapingModule />} />
                </Route>

                <Route path="enrichment">
                  <Route
                    index
                    element={<Navigate to="/enrichment/upload" replace />}
                  />
                  <Route path=":tab" element={<EnrichmentModule />} />
                  <Route path="jobs/:jobId" element={<EnrichmentModule />} />
                </Route>

                <Route path="settings" element={<Settings />}>
                  <Route index element={<Navigate to="account" replace />} />
                  <Route path="account" element={<AccountSettings />} />
                  <Route
                    path="notifications"
                    element={<NotificationSettings />}
                  />
                  <Route path="privacy" element={<PrivacySettings />} />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <CookiesRule />
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// // Layout components
// import DashboardLayout from "./layouts/DashboardLayout";

// // Pages
// import Dashboard from "./pages/Dashboard";
// import ScrapingModule from "./pages/ScrapingModule";
// import EnrichmentModule from "./pages/EnrichmentModule";
// import Settings from "./pages/settings";
// import NotFound from "./pages/NotFound";

// // Settings pages
// import AccountSettings from "./pages/settings/AccountSettings";
// import NotificationSettings from "./pages/settings/NotificationSettings";
// import PrivacySettings from "./pages/settings/PrivacySettings";

// // Auth
// import { AuthProvider } from "./contexts/AuthContext";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
// import CookiesRule from "./pages/CookiesRule";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import { Suspense } from "react";

// const queryClient = new QueryClient();

// function App() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <QueryClientProvider client={queryClient}>
//         <AuthProvider>
//           <Router>
//             <Toaster position="top-right" />
//             <Routes>
//               {/* Public routes */}
//               <Route path="/" element={<Navigate to="/signin" replace />} />
//               <Route path="/signin" element={<SignIn />} />
//               <Route path="/signup" element={<SignUp />} />
//               <Route path="/forgot-password" element={<ForgotPassword />} />
//               <Route path="/reset-password" element={<ResetPassword />} />
//               <Route path="/" element={<Navigate to="/signin" replace />} />
//               <Route path="/signin" element={<SignIn />} />
//               <Route path="/signup" element={<SignUp />} />
//               <Route path="/forgot-password" element={<ForgotPassword />} />
//               <Route path="/reset-password" element={<ResetPassword />} />
//               {/* Protected routes */}
//               <Route
//                 path="/"
//                 element={
//                   <ProtectedRoute>
//                     <DashboardLayout />
//                   </ProtectedRoute>
//                 }
//               >
//                 <Route index element={<Dashboard />} />

//                 {/* Scraping routes */}
//                 <Route path="scraping">
//                   <Route
//                     index
//                     element={<Navigate to="/scraping/new" replace />}
//                   />
//                   <Route path=":tab" element={<ScrapingModule />} />
//                   <Route path="jobs/:jobId" element={<ScrapingModule />} />
//                 </Route>

//                 {/* Enrichment routes */}
//                 <Route path="enrichment">
//                   <Route
//                     index
//                     element={<Navigate to="/enrichment/upload" replace />}
//                   />
//                   <Route path=":tab" element={<EnrichmentModule />} />
//                   <Route path="jobs/:jobId" element={<EnrichmentModule />} />
//                 </Route>

//                 {/* Settings routes */}
//                 <Route path="settings" element={<Settings />}>
//                   <Route index element={<Navigate to="account" replace />} />
//                   <Route path="account" element={<AccountSettings />} />
//                   <Route
//                     path="notifications"
//                     element={<NotificationSettings />}
//                   />
//                   <Route path="privacy" element={<PrivacySettings />} />
//                 </Route>
//               </Route>
//               {/* 404 route */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </Router>
//           <CookiesRule />
//         </AuthProvider>
//       </QueryClientProvider>{" "}
//     </Suspense>
//   );
// }

// export default App;
