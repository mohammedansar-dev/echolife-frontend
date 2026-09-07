import {
  ArrowRight,
  Brain,
  Clock3,
  MessageCircle,
  Settings2,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { usePersona } from "./PersonaContext";

import "./PersonaPage.css";

export default function PersonaPage() {
  const location = useLocation();

  const { configuration } = usePersona();

  const isPersonaHome =
    location.pathname === "/app/persona" ||
    location.pathname === "/app/persona/";

  const personaName =
    configuration?.name?.trim() || "Your Persona";

  const hasPersona = Boolean(
    configuration?.name?.trim(),
  );

  const connectedMemoryCount =
    configuration?.selectedMemoryIds?.length ?? 0;

  return (
    <div className="persona-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="persona-page-header">
        <div className="persona-page-header-main">
          <div className="persona-page-icon">
            <Sparkles size={21} strokeWidth={2} />
          </div>

          <div className="persona-page-heading">
            <span className="persona-page-eyebrow">
              AI PERSONA
            </span>

            <h1>AI Persona</h1>

            <p>
              Create, shape and experience a Persona built
              around your memories and preferences.
            </p>
          </div>
        </div>

        <div className="persona-page-header-actions">
          <Link
            to="/app/persona/memories"
            className="persona-page-secondary-button"
          >
            <Brain size={16} />
            Memory Vault
          </Link>

          <Link
            to="/app/persona/configure"
            className="persona-page-primary-button"
          >
            <Settings2 size={16} />
            {hasPersona
              ? "Configure Persona"
              : "Create Persona"}
          </Link>
        </div>
      </header>

      {/* =====================================================
          PERSONA INTERNAL NAVIGATION

          These are NOT sidebar items.
          They belong only inside AI Persona.
      ===================================================== */}

      <nav
        className="persona-page-nav"
        aria-label="Persona navigation"
      >
        <Link
          to="/app/persona"
          className={
            isPersonaHome
              ? "persona-page-nav-link active"
              : "persona-page-nav-link"
          }
        >
          <UserRound size={15} />
          Overview
        </Link>

        <Link
          to="/app/persona/configure"
          className={
            location.pathname.startsWith(
              "/app/persona/configure",
            )
              ? "persona-page-nav-link active"
              : "persona-page-nav-link"
          }
        >
          <Settings2 size={15} />
          Persona
        </Link>

        <Link
          to="/app/persona/memories"
          className={
            location.pathname.startsWith(
              "/app/persona/memories",
            )
              ? "persona-page-nav-link active"
              : "persona-page-nav-link"
          }
        >
          <Brain size={15} />
          Memory Vault
        </Link>

        <Link
          to="/app/persona/memories/upload"
          className={
            location.pathname.startsWith(
              "/app/persona/memories/upload",
            )
              ? "persona-page-nav-link active"
              : "persona-page-nav-link"
          }
        >
          <Upload size={15} />
          Upload Memory
        </Link>

        <Link
          to="/app/persona/time-capsules"
          className={
            location.pathname.startsWith(
              "/app/persona/time-capsules",
            )
              ? "persona-page-nav-link active"
              : "persona-page-nav-link"
          }
        >
          <Clock3 size={15} />
          Time Capsules
        </Link>

        <Link
          to="/app/persona/conversations"
          className={
            location.pathname.startsWith(
              "/app/persona/conversations",
            )
              ? "persona-page-nav-link active"
              : "persona-page-nav-link"
          }
        >
          <MessageCircle size={15} />
          Conversations
        </Link>
      </nav>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      {isPersonaHome ? (
        <main className="persona-page-content">
          <section className="persona-hero-card">
            <div className="persona-hero-background" />

            <div className="persona-hero-content">
              <div className="persona-hero-avatar">
                <Sparkles size={28} />
              </div>

              <div className="persona-hero-copy">
                <div className="persona-hero-status">
                  <span className="persona-status-dot" />

                  {hasPersona
                    ? "Persona ready"
                    : "Setup required"}
                </div>

                <h2>
                  {hasPersona
                    ? `Meet ${personaName}`
                    : "Create your Persona"}
                </h2>

                <p>
                  {hasPersona
                    ? "Your Persona is ready to be shaped with memories, personality and conversations."
                    : "Give your Persona an identity, personality and access to the memories that matter."}
                </p>

                <div className="persona-hero-actions">
                  <Link
                    to={
                      hasPersona
                        ? "/app/persona/conversations"
                        : "/app/persona/configure"
                    }
                    className="persona-hero-primary"
                  >
                    <MessageCircle size={16} />

                    {hasPersona
                      ? "Start Conversation"
                      : "Create Persona"}

                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    to="/app/persona/configure"
                    className="persona-hero-secondary"
                  >
                    <Settings2 size={15} />
                    Configure
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              QUICK PERSONA STATUS
          ================================================= */}

          <section className="persona-status-grid">
            <Link
              to="/app/persona/configure"
              className="persona-status-card"
            >
              <div className="persona-status-card-icon blue">
                <UserRound size={17} />
              </div>

              <div>
                <span>Identity</span>

                <strong>
                  {hasPersona
                    ? "Configured"
                    : "Not configured"}
                </strong>
              </div>

              <ArrowRight
                size={16}
                className="status-arrow"
              />
            </Link>

            <Link
              to="/app/persona/configure"
              className="persona-status-card"
            >
              <div className="persona-status-card-icon purple">
                <Sparkles size={17} />
              </div>

              <div>
                <span>Communication</span>

                <strong>
                  {configuration?.tone || "Warm"}
                </strong>
              </div>

              <ArrowRight
                size={16}
                className="status-arrow"
              />
            </Link>

            <Link
              to="/app/persona/memories"
              className="persona-status-card"
            >
              <div className="persona-status-card-icon green">
                <Brain size={17} />
              </div>

              <div>
                <span>Connected memories</span>

                <strong>
                  {connectedMemoryCount}
                </strong>
              </div>

              <ArrowRight
                size={16}
                className="status-arrow"
              />
            </Link>
          </section>

          {/* =================================================
              PERSONA WORKSPACE
          ================================================= */}

          <section className="persona-workspace-grid">
            <div className="persona-workspace-main">
              <div className="persona-section-heading-row">
                <div>
                  <span className="persona-section-eyebrow">
                    PERSONA WORKSPACE
                  </span>

                  <h2>
                    Everything your Persona needs
                  </h2>

                  <p>
                    Configure your Persona, manage memories,
                    preserve important moments and start
                    conversations.
                  </p>
                </div>

                <Link
                  to="/app/persona/configure"
                  className="persona-small-link"
                >
                  Configure
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="persona-workspace-cards">
                {/* PERSONA */}

                <Link
                  to="/app/persona/configure"
                  className="persona-workspace-card"
                >
                  <div className="persona-workspace-card-top">
                    <div className="persona-workspace-icon blue">
                      <Settings2 size={19} />
                    </div>

                    <ArrowRight
                      size={16}
                      className="workspace-card-arrow"
                    />
                  </div>

                  <span className="persona-workspace-label">
                    IDENTITY
                  </span>

                  <h3>
                    Persona
                  </h3>

                  <p>
                    Define the identity, relationship,
                    personality and communication style of
                    your Persona.
                  </p>

                  <span className="persona-card-action">
                    {hasPersona
                      ? "Edit Persona"
                      : "Create Persona"}

                    <ArrowRight size={14} />
                  </span>
                </Link>

                {/* MEMORY VAULT */}

                <Link
                  to="/app/persona/memories"
                  className="persona-workspace-card"
                >
                  <div className="persona-workspace-card-top">
                    <div className="persona-workspace-icon purple">
                      <Brain size={19} />
                    </div>

                    <span className="persona-card-count">
                      {connectedMemoryCount}
                    </span>
                  </div>

                  <span className="persona-workspace-label">
                    MEMORY
                  </span>

                  <h3>
                    Memory Vault
                  </h3>

                  <p>
                    Manage the memories your Persona can
                    access during conversations.
                  </p>

                  <span className="persona-card-action">
                    Open Vault
                    <ArrowRight size={14} />
                  </span>
                </Link>

                {/* UPLOAD MEMORY */}

                <Link
                  to="/app/persona/memories/upload"
                  className="persona-workspace-card"
                >
                  <div className="persona-workspace-card-top">
                    <div className="persona-workspace-icon cyan">
                      <Upload size={19} />
                    </div>

                    <ArrowRight
                      size={16}
                      className="workspace-card-arrow"
                    />
                  </div>

                  <span className="persona-workspace-label">
                    ADD MEMORY
                  </span>

                  <h3>
                    Upload Memory
                  </h3>

                  <p>
                    Add photos, videos, audio or documents
                    to your Memory Vault.
                  </p>

                  <span className="persona-card-action">
                    Upload Memory
                    <ArrowRight size={14} />
                  </span>
                </Link>

                {/* TIME CAPSULES */}

                <Link
                  to="/app/persona/time-capsules"
                  className="persona-workspace-card"
                >
                  <div className="persona-workspace-card-top">
                    <div className="persona-workspace-icon orange">
                      <Clock3 size={19} />
                    </div>

                    <ArrowRight
                      size={16}
                      className="workspace-card-arrow"
                    />
                  </div>

                  <span className="persona-workspace-label">
                    FUTURE MEMORIES
                  </span>

                  <h3>
                    Time Capsules
                  </h3>

                  <p>
                    Preserve meaningful memories and unlock
                    them on a future date.
                  </p>

                  <span className="persona-card-action">
                    Manage Capsules
                    <ArrowRight size={14} />
                  </span>
                </Link>

                {/* CONVERSATIONS */}

                <Link
                  to="/app/persona/conversations"
                  className="persona-workspace-card persona-workspace-card-wide"
                >
                  <div className="persona-workspace-card-top">
                    <div className="persona-workspace-icon green">
                      <MessageCircle size={19} />
                    </div>

                    <ArrowRight
                      size={16}
                      className="workspace-card-arrow"
                    />
                  </div>

                  <span className="persona-workspace-label">
                    PERSONA EXPERIENCE
                  </span>

                  <h3>
                    Conversations
                  </h3>

                  <p>
                    Start a private conversation using your
                    Persona's identity and connected memories.
                  </p>

                  <span className="persona-card-action">
                    Open Conversations
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
            </div>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="persona-workspace-sidebar">
              <div className="persona-preview-card">
                <div className="persona-preview-header">
                  <div>
                    <span>
                      LIVE PREVIEW
                    </span>

                    <h3>
                      Your Persona
                    </h3>
                  </div>

                  <div className="persona-preview-sparkle">
                    <Sparkles size={15} />
                  </div>
                </div>

                <div className="persona-preview-profile">
                  <div className="persona-preview-avatar">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <strong>
                      {personaName}
                    </strong>

                    <span>
                      {configuration?.relationship ||
                        "Your AI Persona"}
                    </span>
                  </div>
                </div>

                <div className="persona-preview-divider" />

                <div className="persona-preview-row">
                  <span>
                    Communication
                  </span>

                  <strong>
                    {configuration?.tone || "Warm"}
                  </strong>
                </div>

                <div className="persona-preview-row">
                  <span>
                    Response style
                  </span>

                  <strong>
                    {configuration?.responseStyle ||
                      "Natural"}
                  </strong>
                </div>

                <div className="persona-preview-row">
                  <span>
                    Memory access
                  </span>

                  <strong>
                    {connectedMemoryCount} connected
                  </strong>
                </div>

                <Link
                  to="/app/persona/configure"
                  className="persona-preview-button"
                >
                  <Settings2 size={14} />
                  Configure Persona
                </Link>
              </div>

              <div className="persona-start-card">
                <div className="persona-start-icon">
                  <Sparkles size={17} />
                </div>

                <div>
                  <span className="persona-start-label">
                    BUILD GRADUALLY
                  </span>

                  <h3>
                    Start with the essentials
                  </h3>

                  <p>
                    Create your Persona first, then add
                    memories, Time Capsules and conversations
                    whenever you're ready.
                  </p>
                </div>
              </div>
            </aside>
          </section>
        </main>
      ) : (
        <div className="persona-child-route">
          <Outlet />
        </div>
      )}
    </div>
  );
}