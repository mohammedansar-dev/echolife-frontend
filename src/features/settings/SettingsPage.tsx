import {
  Bell,
  Check,
  ChevronRight,
  Eye,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import { useState } from "react";

import "./SettingsPage.css";

type Section = "account" | "password" | "preferences";

function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("account");

  const [name, setName] = useState("Ansar");

  const [email, setEmail] = useState("ansar@example.com");

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);

  const [reflectionReminders, setReflectionReminders] = useState(true);

  const [saved, setSaved] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [deleteText, setDeleteText] = useState("");

  const showSaved = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  const saveAccount = () => {
    showSaved();
  };

  const savePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    showSaved();
  };

  const savePreferences = () => {
    showSaved();
  };

  const deleteAccount = () => {
    if (deleteText !== "DELETE") {
      return;
    }

    setShowDeleteConfirm(false);
    setDeleteText("");
  };

  return (
    <main className="settings-page">
      {/* HEADER */}

      <header className="settings-header">
        <div>
          <span className="settings-eyebrow">
            <LockKeyhole size={11} />
            SETTINGS
          </span>

          <h1>Settings</h1>

          <p>Manage your EchoLife account and privacy preferences.</p>
        </div>

        {saved && (
          <div className="settings-saved">
            <Check size={12} />
            Changes saved
          </div>
        )}
      </header>

      {/* LAYOUT */}

      <section className="settings-layout">
        {/* NAVIGATION */}

        <aside className="settings-navigation">
          <div className="settings-nav-label">ACCOUNT</div>

          <button
            type="button"
            className={activeSection === "account" ? "active" : ""}
            onClick={() => setActiveSection("account")}
          >
            <UserRound size={14} />

            <span>
              <strong>Account details</strong>
              <small>Basic account information</small>
            </span>

            <ChevronRight size={13} />
          </button>

          <button
            type="button"
            className={activeSection === "password" ? "active" : ""}
            onClick={() => setActiveSection("password")}
          >
            <KeyRound size={14} />

            <span>
              <strong>Password</strong>
              <small>Update your password</small>
            </span>

            <ChevronRight size={13} />
          </button>

          <div className="settings-nav-label">PREFERENCES</div>

          <button
            type="button"
            className={activeSection === "preferences" ? "active" : ""}
            onClick={() => setActiveSection("preferences")}
          >
            <Bell size={14} />

            <span>
              <strong>Notifications</strong>
              <small>Manage your alerts</small>
            </span>

            <ChevronRight size={13} />
          </button>

          <div className="settings-security-note">
            <ShieldCheck size={14} />

            <div>
              <strong>Your space is protected</strong>

              <p>Privacy controls are always available in EchoLife.</p>
            </div>
          </div>
        </aside>

        {/* CONTENT */}

        <div className="settings-content">
          {/* ACCOUNT */}

          {activeSection === "account" && (
            <>
              <section className="settings-card">
                <div className="settings-card-heading">
                  <div>
                    <span>ACCOUNT DETAILS</span>

                    <h2>Basic information</h2>

                    <p>Update the information associated with your account.</p>
                  </div>
                </div>

                <div className="settings-form">
                  <label>
                    Full name
                    <div className="settings-input">
                      <UserRound size={13} />

                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={80}
                      />
                    </div>
                  </label>

                  <label>
                    Email address
                    <div className="settings-input">
                      <Mail size={13} />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                  </label>

                  <div className="settings-email-status">
                    <Check size={12} />

                    <div>
                      <strong>Email verified</strong>

                      <span>Your email address has been verified.</span>
                    </div>
                  </div>

                  <div className="settings-form-footer">
                    <span>Changes apply to your EchoLife profile.</span>

                    <button type="button" onClick={saveAccount}>
                      <Check size={12} />
                      Save changes
                    </button>
                  </div>
                </div>
              </section>

              <section className="settings-card">
                <div className="settings-card-heading">
                  <div>
                    <span>ACCOUNT STATUS</span>

                    <h2>Account information</h2>
                  </div>
                </div>

                <div className="settings-info-row">
                  <div>
                    <span>Account status</span>

                    <strong>Active</strong>
                  </div>

                  <span className="settings-active-badge">Active</span>
                </div>

                <div className="settings-info-row">
                  <div>
                    <span>Privacy</span>

                    <strong>Private</strong>
                  </div>

                  <LockKeyhole size={14} />
                </div>
              </section>
            </>
          )}

          {/* PASSWORD */}

          {activeSection === "password" && (
            <>
              <section className="settings-card">
                <div className="settings-card-heading">
                  <div>
                    <span>SECURITY</span>

                    <h2>Change password</h2>

                    <p>
                      Choose a strong password that you do not use elsewhere.
                    </p>
                  </div>

                  <div className="settings-heading-icon">
                    <KeyRound size={15} />
                  </div>
                </div>

                <div className="settings-form">
                  <label>
                    Current password
                    <div className="settings-input">
                      <KeyRound size={13} />

                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        placeholder="Enter current password"
                      />
                    </div>
                  </label>

                  <label>
                    New password
                    <div className="settings-input">
                      <KeyRound size={13} />

                      <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                  </label>

                  <label>
                    Confirm new password
                    <div className="settings-input">
                      <KeyRound size={13} />

                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Confirm new password"
                      />
                    </div>
                  </label>

                  {newPassword &&
                    confirmPassword &&
                    newPassword !== confirmPassword && (
                      <div className="settings-error">
                        Passwords do not match.
                      </div>
                    )}

                  <div className="settings-form-footer">
                    <span>
                      Password changes will require your current password.
                    </span>

                    <button
                      type="button"
                      disabled={
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword ||
                        newPassword !== confirmPassword
                      }
                      onClick={savePassword}
                    >
                      <Check size={12} />
                      Update password
                    </button>
                  </div>
                </div>
              </section>

              <section className="settings-info-card">
                <ShieldCheck size={15} />

                <div>
                  <strong>Keep your account secure</strong>

                  <p>
                    Never share your password with anyone. EchoLife will never
                    ask you to provide it by email.
                  </p>
                </div>
              </section>
            </>
          )}

          {/* PREFERENCES */}

          {activeSection === "preferences" && (
            <section className="settings-card">
              <div className="settings-card-heading">
                <div>
                  <span>NOTIFICATIONS</span>

                  <h2>Notification preferences</h2>

                  <p>
                    Choose which EchoLife updates you would like to receive.
                  </p>
                </div>
              </div>

              <div className="settings-toggle-row">
                <div className="settings-toggle-icon">
                  <Mail size={14} />
                </div>

                <div>
                  <strong>Email notifications</strong>

                  <span>Receive important account updates by email.</span>
                </div>

                <button
                  type="button"
                  className={`settings-toggle ${
                    emailNotifications ? "on" : ""
                  }`}
                  onClick={() => setEmailNotifications((current) => !current)}
                  aria-label="Toggle email notifications"
                >
                  <span />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div className="settings-toggle-icon">
                  <Bell size={14} />
                </div>

                <div>
                  <strong>Reflection reminders</strong>

                  <span>Receive reminders for your daily reflection.</span>
                </div>

                <button
                  type="button"
                  className={`settings-toggle ${
                    reflectionReminders ? "on" : ""
                  }`}
                  onClick={() => setReflectionReminders((current) => !current)}
                  aria-label="Toggle reflection reminders"
                >
                  <span />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div className="settings-toggle-icon">
                  <Eye size={14} />
                </div>

                <div>
                  <strong>Private activity</strong>

                  <span>
                    Keep your activity visible only within your EchoLife space.
                  </span>
                </div>

                <div className="settings-always-on">Always on</div>
              </div>

              <div className="settings-form-footer">
                <span>
                  Notification preferences are saved for this account.
                </span>

                <button type="button" onClick={savePreferences}>
                  <Check size={12} />
                  Save preferences
                </button>
              </div>
            </section>
          )}

          {/* DANGER ZONE */}

          <section className="settings-danger-card">
            <div className="settings-danger-heading">
              <div className="settings-danger-icon">
                <Trash2 size={14} />
              </div>

              <div>
                <span>DANGER ZONE</span>

                <h2>Delete account</h2>

                <p>
                  Permanently remove your EchoLife account and associated
                  information.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="settings-delete-button"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete account
            </button>
          </section>
        </div>
      </section>

      {/* DELETE MODAL */}

      {showDeleteConfirm && (
        <div
          className="settings-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowDeleteConfirm(false);
              setDeleteText("");
            }
          }}
        >
          <div className="settings-delete-modal">
            <div className="settings-delete-modal-icon">
              <Trash2 size={19} />
            </div>

            <h2>Delete your account?</h2>

            <p>
              This action cannot be undone. Your EchoLife account and its
              associated information will be permanently removed.
            </p>

            <label>
              Type <strong>DELETE</strong> to continue.
              <input
                value={deleteText}
                onChange={(event) => setDeleteText(event.target.value)}
                placeholder="DELETE"
                autoFocus
              />
            </label>

            <div className="settings-delete-modal-actions">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteText("");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteText !== "DELETE"}
                onClick={deleteAccount}
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default SettingsPage;
