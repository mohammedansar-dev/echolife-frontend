import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

/* =========================================================
   LAYOUT
========================================================= */

import AppLayout from "./components/layout/AppLayout";

/* =========================================================
   AUTH
========================================================= */

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import MFASetupPage from "./features/auth/pages/MFASetupPage";
import MFAPage from "./features/auth/pages/MFAPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";

import ProtectedRoute from "./features/auth/ProtectedRoute";
import PublicRoute from "./features/auth/PublicRoute";
import { AuthProvider } from "./features/auth/AuthContext";

/* =========================================================
   DASHBOARD
========================================================= */

import DashboardPage from "./features/dashboard/DashboardPage";

/* =========================================================
   ONBOARDING
========================================================= */

import OnboardingPage from "./features/onboarding/pages/OnboardingPage";

/* =========================================================
   VAULT / MEMORIES
========================================================= */

import { MemoryProvider } from "./features/vault/MemoryContext";

import MemoryVaultPage from "./features/vault/pages/MemoryVaultPage";
import MemoryDetailsPage from "./features/vault/pages/MemoryDetailsPage";
import UploadMemoryPage from "./features/vault/pages/UploadMemoryPage";

import TimeCapsulePage from "./features/vault/pages/TimeCapsulesPage";
import { TimeCapsuleProvider } from "./features/vault/TimeCapsuleContext";

/* =========================================================
   FAMILY
========================================================= */

import { FamilyProvider } from "./features/family/FamilyContext";

import FamilyPage from "./features/family/pages/FamilyPage";
import FamilyMemberDetailsPage from "./features/family/pages/FamilyMemberDetailsPage";
import AddFamilyMemberPage from "./features/family/components/AddFamilyMemberPage";

/* =========================================================
   AI
========================================================= */

import AISessionPage from "./features/ai/pages/AISessionPage";
import AIReflectionPage from "./features/ai/AIReflectionPage";

/* =========================================================
   SESSIONS
========================================================= */

import SessionsPage from "./features/session/SessionsPage";
import SessionDetailsPage from "./features/session/SessionDetailsPage";
import SessionConversationPage from "./features/session/SessionConversationPage";

/* =========================================================
   PROMPTS
========================================================= */

/* =========================================================
   LEGACY
========================================================= */

import LegacyContactsPage from "./features/legacy/LegacyContactsPage";

/* =========================================================
   PROFILE / SETTINGS / SECURITY
========================================================= */

import ProfilePage from "./features/profile/ProfilePage";
import SettingsPage from "./features/settings/SettingsPage";
import SecurityPage from "./features/settings/SecurityPage";

/* =========================================================
   ACTIVITY
========================================================= */

import ActivityPage from "./features/activity/ActivityPage";

/* =========================================================
   PERSONA
========================================================= */

import { PersonaProvider } from "./features/persona/PersonaContext";

import PersonaPage from "./features/persona/PersonaPage";
import PersonaConfigurePage from "./features/persona/PersonaConfigurePage";
import PersonaConversationPage from "./features/persona/PersonaConversationPage";

/* =========================================================
   REPORTS / BILLING
========================================================= */

import ReportsPage from "./features/reports/ReportsPage";
import BillingPage from "./features/billing/BillingPage";

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FamilyProvider>
          <MemoryProvider>
            <TimeCapsuleProvider>
              <PersonaProvider>
                <Routes>
                  {/* =====================================================
                     PUBLIC ROUTES
                  ===================================================== */}

                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/mfa" element={<MFAPage />} />

                    <Route
                      path="/forgot-password"
                      element={<ForgotPasswordPage />}
                    />

                    <Route
                      path="/reset-password"
                      element={<ResetPasswordPage />}
                    />

                    <Route path="/onboarding" element={<OnboardingPage />} />
                  </Route>

                  {/* =====================================================
                     PROTECTED ROUTES
                  ===================================================== */}

                  <Route element={<ProtectedRoute />}>
                    {/* ===================================================
                       APPLICATION LAYOUT
                    =================================================== */}

                    <Route path="/app" element={<AppLayout />}>
                      {/* =================================================
                         DASHBOARD
                      ================================================= */}

                      <Route path="dashboard" element={<DashboardPage />} />

                      <Route path="mfa/setup" element={<MFASetupPage />} />

                      {/* =================================================
                         MEMORY VAULT
                      ================================================= */}

                      <Route path="vault" element={<MemoryVaultPage />} />

                      <Route
                        path="vault/upload"
                        element={<UploadMemoryPage />}
                      />

                      <Route
                        path="vault/:memoryId"
                        element={<MemoryDetailsPage />}
                      />

                      {/* =================================================
                         TIME CAPSULE
                      ================================================= */}

                      <Route
                        path="time-capsule"
                        element={<TimeCapsulePage />}
                      />

                      {/* =================================================
                         FAMILY
                      ================================================= */}

                      <Route path="family" element={<FamilyPage />} />

                      <Route
                        path="family/new"
                        element={<AddFamilyMemberPage />}
                      />

                      <Route
                        path="family/:memberId"
                        element={<FamilyMemberDetailsPage />}
                      />

                      {/* =================================================
                         PERSONA
                      ================================================= */}

                      <Route path="persona" element={<PersonaPage />} />

                      <Route
                        path="persona/configure"
                        element={<PersonaConfigurePage />}
                      />

                      <Route
                        path="persona/conversation/:sessionId"
                        element={<PersonaConversationPage />}
                      />

                      {/* =================================================
                         AI
                      ================================================= */}

                      <Route path="ai-session" element={<AISessionPage />} />

                      <Route
                        path="ai-reflection"
                        element={<AIReflectionPage />}
                      />

                      {/* =================================================
                         DAILY PROMPT
                      ================================================= */}

                      {/* =================================================
                         SESSIONS
                      ================================================= */}

                      <Route path="sessions" element={<SessionsPage />} />

                      <Route
                        path="sessions/:sessionId"
                        element={<SessionDetailsPage />}
                      />

                      <Route
                        path="sessions/:sessionId/conversation"
                        element={<SessionConversationPage />}
                      />

                      {/* =================================================
                         REPORTS
                      ================================================= */}

                      <Route path="reports" element={<ReportsPage />} />

                      {/* =================================================
                         LEGACY
                      ================================================= */}

                      <Route path="legacy" element={<LegacyContactsPage />} />

                      {/* =================================================
                         ACTIVITY
                      ================================================= */}

                      <Route path="activity" element={<ActivityPage />} />

                      {/* =================================================
                         SECURITY
                      ================================================= */}

                      <Route path="security" element={<SecurityPage />} />

                      {/* =================================================
                         BILLING
                      ================================================= */}

                      <Route path="billing" element={<BillingPage />} />

                      {/* =================================================
                         PROFILE
                      ================================================= */}

                      <Route path="profile" element={<ProfilePage />} />

                      {/* =================================================
                         SETTINGS
                      ================================================= */}

                      <Route path="settings" element={<SettingsPage />} />
                    </Route>
                  </Route>

                  {/* =====================================================
                     ROOT
                  ===================================================== */}

                  <Route
                    path="/"
                    element={<Navigate to="/app/dashboard" replace />}
                  />

                  {/* =====================================================
                     UNKNOWN ROUTE
                  ===================================================== */}

                  <Route
                    path="*"
                    element={<Navigate to="/app/dashboard" replace />}
                  />
                </Routes>
              </PersonaProvider>
            </TimeCapsuleProvider>
          </MemoryProvider>
        </FamilyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
