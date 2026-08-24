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

import "./SecurityPage.css";

interface Session {
  id: number;
  device: string;
  location: string;
  time: string;
  current?: boolean;
  icon: "laptop" | "phone";
}

const initialSessions: Session[] = [
  {
    id: 1,
    device: "Windows desktop",
    location: "Current device",
    time: "Active now",
    current: true,
    icon: "laptop",
  },
  {
    id: 2,
    device: "Mobile device",
    location: "Recently active",
    time: "2 hours ago",
    icon: "phone",
  },
];

function SecurityPage() {
  const [twoFactor, setTwoFactor] = useState(false);

  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handlePasswordAction = () => {
    setPasswordUpdated(true);

    window.setTimeout(() => {
      setPasswordUpdated(false);
    }, 1800);
  };

  const logoutSession = (id: number) => {
    setSessions((current) => current.filter((session) => session.id !== id));
  };

  const logoutAllOtherSessions = () => {
    setSessions((current) => current.filter((session) => session.current));

    setShowLogoutConfirm(false);
  };

  return (
    <main className="security-page">
      {/* HEADER */}

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

      {/* SECURITY STATUS */}

      <section className="security-status">
        <div className="security-status-icon">
          <ShieldCheck size={19} />
        </div>

        <div className="security-status-content">
          <span>ACCOUNT SECURITY</span>

          <strong>Your account is protected</strong>

          <p>
            Keep your password secure and review your active sessions regularly.
          </p>
        </div>

        <div className="security-status-badge">
          <Check size={10} />
          Protected
        </div>
      </section>

      {/* CONTENT */}

      <section className="security-layout">
        <div className="security-main">
          {/* PASSWORD */}

          <section className="security-card">
            <div className="security-card-heading">
              <div className="security-card-icon">
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

                <small>Last updated recently</small>
              </div>

              <button type="button" onClick={handlePasswordAction}>
                Change password
                <ChevronRight size={12} />
              </button>
            </div>
          </section>

          {/* TWO FACTOR */}

          <section className="security-card">
            <div className="security-card-heading">
              <div className="security-card-icon">
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
                  {twoFactor
                    ? "Additional verification is enabled."
                    : "Use a second step to protect your account."}
                </span>
              </div>

              <button
                type="button"
                className={`security-toggle ${twoFactor ? "on" : ""}`}
                onClick={() => setTwoFactor((current) => !current)}
                aria-label="Toggle two-factor authentication"
              >
                <span />
              </button>
            </div>

            {twoFactor && (
              <div className="security-enabled">
                <Check size={13} />

                <div>
                  <strong>Two-factor authentication enabled</strong>

                  <p>
                    Your account now requires an additional verification step.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* ACTIVE SESSIONS */}

          <section className="security-card">
            <div className="security-card-heading">
              <div className="security-card-icon">
                <Laptop size={15} />
              </div>

              <div>
                <span>ACTIVE SESSIONS</span>

                <h2>Where you're signed in</h2>

                <p>Review devices currently using your EchoLife account.</p>
              </div>
            </div>

            <div className="security-session-list">
              {sessions.length === 0 ? (
                <div className="security-empty">No active sessions found.</div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="security-session">
                    <div className="security-session-icon">
                      {session.icon === "laptop" ? (
                        <Laptop size={15} />
                      ) : (
                        <Smartphone size={15} />
                      )}
                    </div>

                    <div className="security-session-info">
                      <div className="security-session-title">
                        <strong>{session.device}</strong>

                        {session.current && <span>This device</span>}
                      </div>

                      <p>{session.location}</p>

                      <small>
                        <Clock3 size={9} />
                        {session.time}
                      </small>
                    </div>

                    {!session.current && (
                      <button
                        type="button"
                        onClick={() => logoutSession(session.id)}
                      >
                        <LogOut size={12} />
                        Sign out
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {sessions.some((session) => !session.current) && (
              <button
                type="button"
                className="security-logout-all"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Sign out of all other devices
              </button>
            )}
          </section>
        </div>

        {/* SIDEBAR */}

        <aside className="security-sidebar">
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
              {twoFactor ? (
                <Check size={11} />
              ) : (
                <span className="security-check-dot" />
              )}

              <div>
                <strong>Two-factor authentication</strong>

                <span>{twoFactor ? "Enabled" : "Not enabled"}</span>
              </div>
            </div>
          </div>

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

      {/* LOGOUT MODAL */}

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
              This will sign your EchoLife account out of every other active
              device. Your current device will remain signed in.
            </p>

            <div className="security-modal-actions">
              <button type="button" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>

              <button type="button" onClick={logoutAllOtherSessions}>
                Sign out devices
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default SecurityPage;
