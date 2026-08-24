import {
  CalendarDays,
  Camera,
  Check,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import { useState } from "react";

import "./ProfilePage.css";

function ProfilePage() {
  const [name, setName] = useState("Ansar");
  const [email, setEmail] = useState("ansar@example.com");
  const [about, setAbout] = useState(
    "Preserving meaningful memories and family stories with EchoLife.",
  );

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setEditing(false);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2200);
  };

  return (
    <main className="profile-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="profile-page-header">
        <div>
          <span>YOUR PROFILE</span>

          <h1>Profile</h1>

          <p>Manage your personal information and EchoLife profile.</p>
        </div>

        {saved && (
          <div className="profile-saved">
            <Check size={14} />
            Profile saved
          </div>
        )}
      </header>

      {/* =====================================================
          PROFILE CARD
      ===================================================== */}

      <section className="profile-card">
        <div className="profile-card-top">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {name.charAt(0).toUpperCase() || "A"}
            </div>

            {editing && (
              <button
                type="button"
                className="profile-avatar-edit"
                aria-label="Change profile picture"
              >
                <Camera size={13} />
              </button>
            )}
          </div>

          <div className="profile-identity">
            <span className="profile-role">FAMILY ADMINISTRATOR</span>

            <h2>{name || "Your name"}</h2>

            <p>{email}</p>
          </div>

          <button
            type="button"
            className="profile-edit-button"
            onClick={() => {
              setEditing((current) => !current);
              setSaved(false);
            }}
          >
            <Pencil size={14} />

            {editing ? "Cancel" : "Edit profile"}
          </button>
        </div>

        {/* =================================================
            PROFILE STATS
        ================================================= */}

        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-icon blue">
              <UserRound size={15} />
            </div>

            <div>
              <span>Member since</span>
              <strong>August 2026</strong>
            </div>
          </div>

          <div className="profile-stat">
            <div className="profile-stat-icon purple">
              <Users size={15} />
            </div>

            <div>
              <span>Family role</span>
              <strong>Administrator</strong>
            </div>
          </div>

          <div className="profile-stat">
            <div className="profile-stat-icon green">
              <ShieldCheck size={15} />
            </div>

            <div>
              <span>Account status</span>
              <strong>Protected</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="profile-layout">
        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <div className="profile-content-card">
          <div className="profile-section-header">
            <div>
              <span>PERSONAL INFORMATION</span>

              <h2>About you</h2>

              <p>Keep your profile information up to date.</p>
            </div>

            <UserRound size={17} />
          </div>

          <div className="profile-form">
            <div className="profile-form-grid">
              <div className="profile-field">
                <label htmlFor="profile-name">Full name</label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  disabled={!editing}
                  maxLength={80}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="profile-field">
                <label htmlFor="profile-email">Email address</label>

                <div className="profile-input-icon">
                  <Mail size={13} />

                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    disabled={!editing}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="profile-about">About</label>

              <textarea
                id="profile-about"
                value={about}
                disabled={!editing}
                maxLength={300}
                rows={4}
                onChange={(event) => setAbout(event.target.value)}
              />

              {editing && <small>{about.length}/300</small>}
            </div>

            {editing && (
              <div className="profile-form-actions">
                <button
                  type="button"
                  className="profile-save-button"
                  onClick={handleSave}
                >
                  <Check size={14} />
                  Save profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            ECHOLIFE PROFILE
        ================================================= */}

        <aside className="profile-side-card">
          <div className="profile-section-header">
            <div>
              <span>ECHOLIFE</span>

              <h2>Your space</h2>
            </div>

            <ShieldCheck size={17} />
          </div>

          <div className="profile-space-list">
            <div className="profile-space-item">
              <div className="profile-space-icon blue">
                <UserRound size={14} />
              </div>

              <div>
                <span>Memories</span>
                <strong>31</strong>
              </div>
            </div>

            <div className="profile-space-item">
              <div className="profile-space-icon purple">
                <Users size={14} />
              </div>

              <div>
                <span>Family members</span>
                <strong>4</strong>
              </div>
            </div>

            <div className="profile-space-item">
              <div className="profile-space-icon green">
                <CalendarDays size={14} />
              </div>

              <div>
                <span>Time capsules</span>
                <strong>2</strong>
              </div>
            </div>
          </div>

          <div className="profile-private-note">
            <ShieldCheck size={15} />

            <div>
              <strong>Private profile</strong>

              <p>
                Your profile information belongs to your private EchoLife space.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* =====================================================
          ACCOUNT INFORMATION
      ===================================================== */}

      <section className="profile-account-card">
        <div>
          <span>ACCOUNT</span>

          <h2>Account information</h2>
        </div>

        <div className="profile-account-row">
          <div className="profile-account-item">
            <Mail size={14} />

            <div>
              <span>Email</span>
              <strong>{email}</strong>
            </div>
          </div>

          <div className="profile-account-item">
            <CalendarDays size={14} />

            <div>
              <span>Created</span>
              <strong>August 2026</strong>
            </div>
          </div>

          <div className="profile-account-item">
            <ShieldCheck size={14} />

            <div>
              <span>Security</span>
              <strong>Protected</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
