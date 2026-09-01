import {
  Check,
  ChevronRight,
  Clock3,
  KeyRound,
  Laptop,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

import "./SecurityPage.css";

function SecurityPage() {
  const navigate = useNavigate();

  const { user, isLoading } = useAuth();

  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  /*
   * IMPORTANT:
   *
   * MFA status MUST come from backend/auth state.
   *
   * Do NOT create:
   *
   * const [twoFactor, setTwoFactor] = useState(false);
   *
   * because MFA state belongs to the backend.
   */
  const twoFactorEnabled = Boolean(user?.mfaVerified);

  /* =======================================================
     PASSWORD
  ======================================================= */

  const handlePasswordAction = () => {
    /*
     * Keep your existing password flow.
     *
     * If you already have a change-password route,
     * navigate to that route here.
     */

    navigate("/app/change-password");
  };

  /* =======================================================
     MFA
  ======================================================= */

  const handleMfaSetup = () => {
    /*
     * IMPORTANT:
     *
     * Do NOT generate the QR code here.
     *
     * Your MFA setup page/backend is responsible for:
     *
     * 1. Generating the MFA secret
     * 2. Generating the QR code
     * 3. Verifying the OTP
     * 4. Persisting MFA status
     * 5. Refreshing the authenticated user
     *
     * Security page only navigates there.
     */

    navigate("/app/mfa/setup");
  };

  /* =======================================================
     ACTIVE SESSIONS
  ======================================================= */

  const handleSessions = () => {
    /*
     * Sessions must come from the backend.
     *
     * Do NOT maintain:
     *
     * const [sessions, setSessions] = useState(...)
     *
     * here.
     *
     * Open the existing sessions page where the real
     * backend session data is loaded.
     */

    navigate("/app/sessions");
  };

  /* =======================================================
     RECENT ACTIVITY
  ======================================================= */

  const handleActivity = () => {
    navigate("/app/security/activity");
  };

  /* =======================================================
     RECOVERY
  ======================================================= */

  const handleRecovery = () => {
    navigate("/app/security/recovery");
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <main className="security-page">
        <div className="security-loading">
          <div className="security-loading-spinner" />

          <p>Loading security settings...</p>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="security-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="security-header">
        <div>
          <span className="security-eyebrow">
            <ShieldCheck size={11} />
            SECURITY
          </span>

          <h1>Keep your account protected.</h1>

          <p>
            Manage your password, verification, and active sessions from one
            place.
          </p>
        </div>

        {passwordUpdated && (
          <div className="security-saved">
            <Check size={12} />
            Security settings updated
          </div>
        )}
      </header>

      {/* =================================================
          SECURITY STATUS
      ================================================= */}

      <section className="security-status">
        <div className="security-status-icon">
          <ShieldCheck size={19} />
        </div>

        <div className="security-status-content">
          <span>ACCOUNT SECURITY</span>

          <strong>
            {twoFactorEnabled
              ? "Your account is protected"
              : "Complete your account protection"}
          </strong>

          <p>
            {twoFactorEnabled
              ? "Your account security settings are up to date."
              : "Enable two-factor authentication for stronger protection."}
          </p>
        </div>

        <div
          className={`security-status-badge ${
            twoFactorEnabled ? "protected" : "attention"
          }`}
        >
          {twoFactorEnabled ? (
            <>
              <Check size={10} />
              Protected
            </>
          ) : (
            <>
              <span />
              Action needed
            </>
          )}
        </div>
      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="security-layout">
        {/* =================================================
            MAIN
        ================================================= */}

        <div className="security-main">
          {/* =================================================
              PASSWORD
          ================================================= */}

          <section className="security-card">
            <div className="security-card-heading">
              <div className="security-card-icon blue">
                <KeyRound size={15} />
              </div>

              <div>
                <span>PASSWORD</span>

                <h2>Account password</h2>

                <p>Your password protects access to your EchoLife account.</p>
              </div>
            </div>

            <div className="security-password-row">
              <div>
                <span>Password</span>

                <strong>••••••••••••••••</strong>

                <small>Your password is securely protected.</small>
              </div>

              <button type="button" onClick={handlePasswordAction}>
                Change password
                <ChevronRight size={12} />
              </button>
            </div>
          </section>

          {/* =================================================
              TWO FACTOR
          ================================================= */}

          <section className="security-card">
            <div className="security-card-heading">
              <div className="security-card-icon green">
                <Smartphone size={15} />
              </div>

              <div>
                <span>TWO-FACTOR AUTHENTICATION</span>

                <h2>Extra account protection</h2>

                <p>
                  Add another verification step when signing in to your account.
                </p>
              </div>
            </div>

            <div className="security-toggle-row">
              <div className="security-toggle-info">
                <strong>Two-factor authentication</strong>

                <span>
                  {twoFactorEnabled
                    ? "Additional verification is enabled."
                    : "Use a second step to protect your account."}
                </span>
              </div>

              {!twoFactorEnabled ? (
                <button
                  type="button"
                  className="security-mfa-button"
                  onClick={handleMfaSetup}
                >
                  <ShieldCheck size={14} />

                  <span>Set up MFA</span>

                  <ChevronRight size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  className="security-mfa-enabled"
                  onClick={handleMfaSetup}
                >
                  <Check size={12} />
                  Enabled
                  <ChevronRight size={12} />
                </button>
              )}
            </div>

            {twoFactorEnabled && (
              <div className="security-enabled">
                <Check size={13} />

                <div>
                  <strong>Two-factor authentication enabled</strong>

                  <p>
                    Your account requires an additional verification step when
                    signing in.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* =================================================
              ACTIVE SESSIONS
          ================================================= */}

          <section className="security-card">
            <div className="security-card-heading">
              <div className="security-card-icon purple">
                <Laptop size={15} />
              </div>

              <div>
                <span>ACTIVE SESSIONS</span>

                <h2>Where you're signed in</h2>

                <p>Review devices currently using your EchoLife account.</p>
              </div>
            </div>

            <button
              type="button"
              className="security-session-navigation"
              onClick={handleSessions}
            >
              <div className="security-session-nav-icon">
                <Laptop size={16} />
              </div>

              <div>
                <strong>Manage active sessions</strong>

                <span>View and sign out devices from your account.</span>
              </div>

              <ChevronRight size={17} />
            </button>
          </section>

          {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

          <section className="security-card">
            <div className="security-card-heading">
              <div className="security-card-icon orange">
                <Clock3 size={15} />
              </div>

              <div>
                <span>RECENT ACTIVITY</span>

                <h2>Security activity</h2>

                <p>Review recent security events on your account.</p>
              </div>
            </div>

            <button
              type="button"
              className="security-simple-navigation"
              onClick={handleActivity}
            >
              Review recent activity
              <ChevronRight size={14} />
            </button>
          </section>

          {/* =================================================
              RECOVERY
          ================================================= */}

          <section className="security-card">
            <div className="security-card-heading">
              <div className="security-card-icon red">
                <LockKeyhole size={15} />
              </div>

              <div>
                <span>RECOVERY OPTIONS</span>

                <h2>Account recovery</h2>

                <p>Manage backup and account recovery options.</p>
              </div>
            </div>

            <button
              type="button"
              className="security-simple-navigation"
              onClick={handleRecovery}
            >
              Manage recovery options
              <ChevronRight size={14} />
            </button>
          </section>
        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <aside className="security-sidebar">
          {/* SECURITY CHECK */}

          <div className="security-side-card">
            <div className="security-side-heading">
              <LockKeyhole size={14} />

              <div>
                <span>SECURITY CHECK</span>

                <strong>Account protection</strong>
              </div>
            </div>

            <div className="security-check">
              <Check size={11} />

              <div>
                <strong>Password protection</strong>

                <span>Enabled</span>
              </div>
            </div>

            <div className="security-check">
              <Check size={11} />

              <div>
                <strong>Private family space</strong>

                <span>Enabled</span>
              </div>
            </div>

            <div className="security-check">
              {twoFactorEnabled ? (
                <Check size={11} />
              ) : (
                <span className="security-check-dot" />
              )}

              <div>
                <strong>Two-factor authentication</strong>

                <span>{twoFactorEnabled ? "Enabled" : "Not enabled"}</span>
              </div>
            </div>
          </div>

          {/* SECURITY TIP */}

          <div className="security-side-card security-tip">
            <div className="security-tip-icon">
              <ShieldCheck size={14} />
            </div>

            <div>
              <strong>Security tip</strong>

              <p>
                Use a unique password and sign out of devices you no longer use.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* =================================================
          LOGOUT CONFIRMATION
      ================================================= */}

      {showLogoutConfirm && (
        <div
          className="security-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowLogoutConfirm(false);
            }
          }}
        >
          <div className="security-modal">
            <div className="security-modal-icon">
              <LogOut size={18} />
            </div>

            <h2>Sign out other devices?</h2>

            <p>
              This action should be connected to the backend session-management
              endpoint.
            </p>

            <div className="security-modal-actions">
              <button type="button" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>

              <button type="button" onClick={() => setShowLogoutConfirm(false)}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default SecurityPage;
