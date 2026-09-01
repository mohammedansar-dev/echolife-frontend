import {
  Brain,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Settings2,
  Sparkles,
} from "lucide-react";
import { startSession } from "../session/session.api";
import { useNavigate } from "react-router-dom";

import { useMemory } from "../vault/MemoryContext";

import { usePersona } from "./PersonaContext";

import "./PersonaPage.css";
import { useState } from "react";

function PersonaPage() {
  const navigate = useNavigate();

  const [startingSession, setStartingSession] = useState(false);
  const { configuration, messages, hydrated, loading } = usePersona();

  const handleStartConversation = async () => {
    if (startingSession) {
      return;
    }

    try {
      setStartingSession(true);

      const session = await startSession({
        personaId: "family-persona",
        mode: "STORY",
        inputChannel: "TEXT",
        outputChannel: "TEXT",
        clientType: "WEB",
      });

      navigate(`/app/persona/conversation/${session.sessionId}`);
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setStartingSession(false);
    }
  };
  const { memories } = useMemory();

  if (!hydrated || loading) {
    return (
      <main className="persona-page">
        <div className="persona-loading">
          <div className="persona-loader" />

          <h2>Loading your Persona</h2>

          <p>Preparing your private AI experience.</p>
        </div>
      </main>
    );
  }

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!configuration) {
    return (
      <main className="persona-page">
        <header className="persona-header">
          <div className="persona-header-left">
            <div className="persona-main-icon">
              <Brain size={24} />
            </div>

            <div>
              <span className="persona-label">PERSONAL AI</span>

              <h1>Your Persona</h1>

              <p>
                Create a personal AI experience connected to the memories you
                choose.
              </p>
            </div>
          </div>
        </header>

        <section className="persona-empty-card">
          <div className="persona-empty-orb">
            <Sparkles size={28} />
          </div>

          <span className="persona-empty-label">ECHOLIFE PERSONA</span>

          <h2>Create your personal Persona</h2>

          <p>
            Give your Persona a name, choose how it communicates, and connect
            memories from your private Memory Vault.
          </p>

          <button
            type="button"
            onClick={() => navigate("/app/persona/configure")}
          >
            <Sparkles size={16} />
            Create Persona
          </button>
        </section>
      </main>
    );
  }

  const connectedMemories = memories.filter((memory) =>
    configuration.selectedMemoryIds.includes(memory.id),
  );

  return (
    <main className="persona-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="persona-header">
        <div className="persona-header-left">
          <div className="persona-main-icon active">
            <Brain size={24} />
          </div>

          <div>
            <span className="persona-label">PERSONAL AI</span>

            <h1>{configuration.name}</h1>

            <p>Your private Persona is ready for conversation.</p>
          </div>
        </div>

        <button
          type="button"
          className="persona-settings-button"
          onClick={() => navigate("/app/persona/configure")}
        >
          <Settings2 size={16} />
          Configure
        </button>
      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="persona-hero-card">
        <div className="persona-hero-glow" />

        <div className="persona-avatar">
          <Brain size={29} />
        </div>

        <div className="persona-hero-content">
          <div className="persona-active-badge">
            <CheckCircle2 size={13} />
            Active Persona
          </div>

          <h2>{configuration.name}</h2>

          <p>
            A private AI experience shaped by your selected memories and
            communication preferences.
          </p>

          <div className="persona-hero-meta">
            <span>
              Tone
              <strong>{configuration.tone}</strong>
            </span>

            <span>
              Memories
              <strong>{configuration.selectedMemoryIds.length}</strong>
            </span>

            <span>
              Messages
              <strong>{messages.length}</strong>
            </span>
          </div>
        </div>

        <button
          type="button"
          className="persona-hero-action"
          onClick={handleStartConversation}
          disabled={startingSession}
        >
          <MessageCircle size={17} />
          {startingSession ? "Starting..." : "Start conversation"}
        </button>
      </section>

      {/* =================================================
          GRID
      ================================================= */}

      <section className="persona-content-grid">
        {/* MEMORY CARD */}

        <article className="persona-panel">
          <div className="persona-panel-header">
            <div>
              <span>MEMORY CONNECTION</span>

              <h2>Connected memories</h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/app/persona/configure")}
            >
              Manage
            </button>
          </div>

          <p className="persona-panel-description">
            These memories are available to your Persona when generating
            responses.
          </p>

          {connectedMemories.length === 0 ? (
            <div className="persona-no-memory">
              <Brain size={20} />

              <div>
                <strong>No memories connected</strong>

                <p>Select memories from your Memory Vault.</p>
              </div>
            </div>
          ) : (
            <div className="persona-memory-list">
              {connectedMemories.map((memory) => (
                <div key={memory.id} className="persona-memory-item">
                  <div className="persona-memory-item-icon">
                    <Brain size={16} />
                  </div>

                  <div>
                    <strong>{memory.title}</strong>

                    <span>
                      {memory.category}
                      {" · "}
                      {memory.type}
                    </span>
                  </div>

                  <CheckCircle2 size={16} />
                </div>
              ))}
            </div>
          )}
        </article>

        {/* CONFIGURATION CARD */}

        <article className="persona-panel">
          <div className="persona-panel-header">
            <div>
              <span>CONFIGURATION</span>

              <h2>Persona settings</h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/app/persona/configure")}
            >
              Edit
            </button>
          </div>

          <div className="persona-settings-list">
            <div>
              <span>Persona name</span>

              <strong>{configuration.name}</strong>
            </div>

            <div>
              <span>Communication tone</span>

              <strong>{configuration.tone}</strong>
            </div>

            <div>
              <span>Connected memories</span>

              <strong>{configuration.selectedMemoryIds.length}</strong>
            </div>
          </div>
        </article>
      </section>

      {/* =================================================
          CONVERSATION CTA
      ================================================= */}

      <section className="persona-conversation-cta">
        <div className="persona-cta-icon">
          <MessageCircle size={21} />
        </div>

        <div>
          <span>PRIVATE CONVERSATION</span>

          <h2>Continue with {configuration.name}</h2>

          <p>Start a thoughtful conversation using your selected memories.</p>
        </div>

        <button
          type="button"
          onClick={handleStartConversation}
          disabled={startingSession}
        >
          {startingSession ? "Starting..." : "Open conversation"}
          <ChevronRight size={16} />
        </button>
      </section>
    </main>
  );
}

export default PersonaPage;
