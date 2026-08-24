import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Image,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { useState } from "react";

import "./OnboardingPage.css";

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

const categories = [
  "Family",
  "Travel",
  "Milestones",
  "Childhood",
  "Celebrations",
  "Personal",
];

function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>(1);

  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [familyDescription, setFamilyDescription] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Family",
    "Milestones",
  ]);

  const [privacy, setPrivacy] = useState(true);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const nextStep = () => {
    setStep((current) => Math.min(current + 1, 5) as OnboardingStep);
  };

  const previousStep = () => {
    setStep((current) => Math.max(current - 1, 1) as OnboardingStep);
  };

  const finishOnboarding = () => {
    window.location.href = "/app/dashboard";
  };

  const progress = `${step * 20}%`;

  return (
    <main className="onboarding-page">
      {/* =====================================================
          BRAND
      ===================================================== */}

      <header className="onboarding-brand">
        <div className="onboarding-brand-mark">E</div>

        <div>
          <strong>
            Echo<span>Life</span>
          </strong>

          <small>Digital memory space</small>
        </div>
      </header>

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div className="onboarding-progress">
        <div className="onboarding-progress-top">
          <span>Step {step} of 5</span>

          <span>{step === 5 ? "Complete" : "Setting up your space"}</span>
        </div>

        <div className="onboarding-progress-track">
          <div
            className="onboarding-progress-fill"
            style={{ width: progress }}
          />
        </div>
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <section className="onboarding-card">
        {/* =================================================
            STEP 1
        ================================================= */}

        {step === 1 && (
          <div className="onboarding-step">
            <div className="onboarding-step-icon">
              <Heart size={22} />
            </div>

            <span className="onboarding-eyebrow">WELCOME TO ECHOLIFE</span>

            <h1>Preserve what matters.</h1>

            <p className="onboarding-intro">
              EchoLife gives your family a private place to preserve memories,
              stories, milestones, and moments that matter.
            </p>

            <div className="onboarding-feature-grid">
              <div className="onboarding-feature">
                <div>
                  <Image size={16} />
                </div>

                <section>
                  <strong>Preserve memories</strong>

                  <p>Keep meaningful photos, videos, and stories together.</p>
                </section>
              </div>

              <div className="onboarding-feature">
                <div>
                  <Users size={16} />
                </div>

                <section>
                  <strong>Build your family space</strong>

                  <p>Create a private space for the people you care about.</p>
                </section>
              </div>

              <div className="onboarding-feature">
                <div>
                  <LockKeyhole size={16} />
                </div>

                <section>
                  <strong>Keep it private</strong>

                  <p>
                    Your memories remain inside your private EchoLife space.
                  </p>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            STEP 2
        ================================================= */}

        {step === 2 && (
          <div className="onboarding-step">
            <div className="onboarding-step-icon">
              <Users size={22} />
            </div>

            <span className="onboarding-eyebrow">YOUR PROFILE</span>

            <h1>Tell us about yourself.</h1>

            <p className="onboarding-intro">
              This information helps personalize your EchoLife experience.
            </p>

            <div className="onboarding-form">
              <div className="onboarding-field">
                <label htmlFor="onboarding-name">Your name</label>

                <input
                  id="onboarding-name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  maxLength={80}
                  onChange={(event) => setName(event.target.value)}
                  autoFocus
                />

                <small>
                  This is how your family will see you inside EchoLife.
                </small>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            STEP 3
        ================================================= */}

        {step === 3 && (
          <div className="onboarding-step">
            <div className="onboarding-step-icon">
              <Users size={22} />
            </div>

            <span className="onboarding-eyebrow">FAMILY SPACE</span>

            <h1>Create your family space.</h1>

            <p className="onboarding-intro">
              Give your private family space a name everyone will recognize.
            </p>

            <div className="onboarding-form">
              <div className="onboarding-field">
                <label htmlFor="family-name">Family name</label>

                <input
                  id="family-name"
                  type="text"
                  placeholder="e.g. The Hansi Family"
                  value={familyName}
                  maxLength={80}
                  onChange={(event) => setFamilyName(event.target.value)}
                  autoFocus
                />

                <small>Choose a name your family will recognize.</small>
              </div>

              <div className="onboarding-field">
                <label htmlFor="family-description">
                  Description
                  <span>Optional</span>
                </label>

                <textarea
                  id="family-description"
                  placeholder="A short description about your family space..."
                  value={familyDescription}
                  maxLength={300}
                  rows={4}
                  onChange={(event) => setFamilyDescription(event.target.value)}
                />

                <small className="onboarding-character-count">
                  {familyDescription.length}/300
                </small>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            STEP 4
        ================================================= */}

        {step === 4 && (
          <div className="onboarding-step">
            <div className="onboarding-step-icon">
              <Sparkles size={22} />
            </div>

            <span className="onboarding-eyebrow">MEMORY PREFERENCES</span>

            <h1>What do you want to preserve?</h1>

            <p className="onboarding-intro">
              Choose the types of memories that matter most to you. You can
              change these later.
            </p>

            <div className="onboarding-category-grid">
              {categories.map((category) => {
                const selected = selectedCategories.includes(category);

                return (
                  <button
                    type="button"
                    key={category}
                    className={`onboarding-category ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    <span className="onboarding-category-check">
                      {selected && <Check size={13} />}
                    </span>

                    <span>{category}</span>
                  </button>
                );
              })}
            </div>

            <div className="onboarding-selection-note">
              <Image size={15} />

              <span>
                You can add or change memory categories anytime from your Memory
                Vault.
              </span>
            </div>
          </div>
        )}

        {/* =================================================
            STEP 5
        ================================================= */}

        {step === 5 && (
          <div className="onboarding-step onboarding-complete">
            <div className="onboarding-complete-icon">
              <Check size={28} />
            </div>

            <span className="onboarding-eyebrow">YOUR SPACE IS READY</span>

            <h1>Welcome to EchoLife{name ? `, ${name}` : ""}.</h1>

            <p className="onboarding-intro">
              Your private memory space is ready. You can now begin preserving
              the moments that matter.
            </p>

            <div className="onboarding-summary">
              <div>
                <span>Family space</span>

                <strong>{familyName || "Your family"}</strong>
              </div>

              <div>
                <span>Categories</span>

                <strong>{selectedCategories.length} selected</strong>
              </div>

              <div>
                <span>Privacy</span>

                <strong>Private</strong>
              </div>
            </div>

            <div className="onboarding-privacy">
              <div>
                <ShieldCheck size={17} />
              </div>

              <section>
                <strong>Your memories stay private</strong>

                <p>
                  EchoLife is designed around a private family memory
                  experience.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* =================================================
            FOOTER ACTIONS
        ================================================= */}

        <div className="onboarding-actions">
          {step > 1 ? (
            <button
              type="button"
              className="onboarding-back-button"
              onClick={previousStep}
            >
              <ArrowLeft size={15} />
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 5 ? (
            <button
              type="button"
              className="onboarding-next-button"
              onClick={nextStep}
            >
              Continue
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              className="onboarding-next-button"
              onClick={finishOnboarding}
            >
              Go to dashboard
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="onboarding-footer">
        <LockKeyhole size={12} />

        <span>Your EchoLife space is private and secure.</span>
      </footer>
    </main>
  );
}

export default OnboardingPage;
