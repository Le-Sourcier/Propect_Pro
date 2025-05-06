import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layout components
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import ScrapingModule from "./pages/ScrapingModule";
import EnrichmentModule from "./pages/EnrichmentModule";
// import EmailCampaigns from "./pages/EmailCampaigns";
// import CampaignEditor from "./pages/email-campaigns/CampaignEditor";
// import CampaignAnalytics from "./pages/email-campaigns/CampaignAnalytics";
// import TemplateEditor from "./pages/email-campaigns/TemplateEditor";
// import ContactList from "./pages/email-campaigns/ContactList";
// import NewContactList from "./pages/email-campaigns/NewContactList";
import Settings from "./pages/settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Settings pages
import AccountSettings from "./pages/settings/AccountSettings";
import TeamSettings from "./pages/settings/TeamSettings";
import ApiKeySettings from "./pages/settings/ApiKeySettings";
import DatabaseSettings from "./pages/settings/DatabaseSettings";
import EmailSettings from "./pages/settings/EmailSettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import PrivacySettings from "./pages/settings/PrivacySettings";

// Auth
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />

              {/* Scraping routes */}
              <Route path="scraping">
                <Route
                  index
                  element={<Navigate to="/scraping/new" replace />}
                />
                <Route path=":tab" element={<ScrapingModule />} />
                <Route path="jobs/:jobId" element={<ScrapingModule />} />
              </Route>

              {/* Enrichment routes */}
              <Route path="enrichment">
                <Route
                  index
                  element={<Navigate to="/enrichment/upload" replace />}
                />
                <Route path=":tab" element={<EnrichmentModule />} />
                <Route path="jobs/:jobId" element={<EnrichmentModule />} />
              </Route>

              {/* Email campaign routes */}
              {/* <Route path="email-campaigns">
                <Route index element={<EmailCampaigns />} />
                <Route path="new" element={<CampaignEditor />} />
                <Route path=":campaignId/edit" element={<CampaignEditor />} />
                <Route
                  path=":campaignId/analytics"
                  element={<CampaignAnalytics />}
                />
                <Route path="templates/new" element={<TemplateEditor />} />
                <Route
                  path="templates/:templateId/edit"
                  element={<TemplateEditor />}
                />
                <Route path="contacts/new" element={<NewContactList />} />
                <Route path="contacts/:listId" element={<ContactList />} />
              </Route> */}

              {/* Settings routes */}
              <Route path="settings" element={<Settings />}>
                <Route index element={<Navigate to="account" replace />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="team" element={<TeamSettings />} />
                <Route path="api" element={<ApiKeySettings />} />
                <Route path="database" element={<DatabaseSettings />} />
                <Route path="email" element={<EmailSettings />} />
                <Route
                  path="notifications"
                  element={<NotificationSettings />}
                />
                <Route path="privacy" element={<PrivacySettings />} />
              </Route>
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
