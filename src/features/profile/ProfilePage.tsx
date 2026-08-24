import {
  Camera,
  Check,
  LockKeyhole,
  Mail,
  Save,
  UserRound,
} from "lucide-react";

import { FormEvent, useState } from "react";

import "./ProfilePage.css";

function ProfilePage() {
  const [name, setName] = useState("Ansar");

  const [email, setEmail] = useState("ansar@example.com");

  const [bio, setBio] = useState(
    "Preserving meaningful family memories with EchoLife.",
  );

  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <main className="profile-page">
      <header className="profile-header">
        <div>
          <span className="profile-eyebrow">
            <UserRound size={11} />
            PROFILE
          </span>

          <h1>Your profile</h1>

          <p>
            Manage the personal information associated with your EchoLife
            account.
          </p>
        </div>
      </header>

      <section className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              <UserRound size={30} />
            </div>

            <button
              type="button"
              className="profile-camera"
              aria-label="Change profile photo"
            >
              <Camera size={12} />
            </button>
          </div>

          <h2>{name || "Your name"}</h2>

          <p>{email}</p>

          <span className="profile-member">EchoLife member</span>

          <div className="profile-sidebar-divider" />

          <div className="profile-sidebar-item">
            <Check size={13} />
            Account active
          </div>

          <div className="profile-sidebar-item">
            <LockKeyhole size={13} />
            Private profile
          </div>
        </aside>

        <div className="profile-content">
          <section className="profile-card">
            <div className="profile-card-heading">
              <div>
                <span>PERSONAL INFORMATION</span>
                <h2>Basic details</h2>
              </div>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form-grid">
                <label>
                  Full name
                  <div className="profile-input">
                    <UserRound size={13} />

                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your full name"
                      maxLength={80}
                    />
                  </div>
                </label>

                <label>
                  Email address
                  <div className="profile-input">
                    <Mail size={13} />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </label>
              </div>

              <label>
                About you
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Tell your family a little about yourself..."
                  maxLength={300}
                />
                <span className="profile-character-count">
                  {bio.length}/300
                </span>
              </label>

              <div className="profile-form-footer">
                <div className="profile-private-note">
                  <LockKeyhole size={11} />
                  Your profile information is private.
                </div>

                <button type="submit" className="profile-save">
                  {saved ? (
                    <>
                      <Check size={13} />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <section className="profile-card">
            <div className="profile-card-heading">
              <div>
                <span>ACCOUNT</span>
                <h2>Account information</h2>
              </div>
            </div>

            <div className="profile-account-row">
              <div>
                <span>Account status</span>
                <strong>Active</strong>
              </div>

              <span className="profile-active-badge">Active</span>
            </div>

            <div className="profile-account-row">
              <div>
                <span>Profile visibility</span>
                <strong>Private</strong>
              </div>

              <LockKeyhole size={14} />
            </div>

            <div className="profile-account-row">
              <div>
                <span>Family membership</span>
                <strong>Family space</strong>
              </div>

              <UserRound size={14} />
            </div>
          </section>

          <section className="profile-info-card">
            <div className="profile-info-icon">
              <LockKeyhole size={14} />
            </div>

            <div>
              <strong>Your information stays private</strong>

              <p>
                EchoLife keeps your profile information within your private
                family space.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
