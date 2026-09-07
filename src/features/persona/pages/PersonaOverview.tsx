import {
  ArrowRight,
  Brain,
  Clock3,
  MessageCircle,
  Settings2,
  Sparkles,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useMemory } from "../../vault/MemoryContext";
import { usePersona } from "../PersonaContext";

import "./PersonaOverview.css";

export default function PersonaOverview() {
  const { configuration } = usePersona();

  const { memories } = useMemory();

  const connectedIds =
    configuration?.selectedMemoryIds ?? [];

  const connectedMemories = memories.filter(
    (memory) =>
      connectedIds.includes(memory.id),
  );

  const capsuleCount = memories.filter(
    (memory) => memory.isTimeCapsule,
  ).length;

  const personaName =
    configuration?.name?.trim() ||
    "Your Persona";

  const hasPersona =
    Boolean(configuration?.name?.trim());

  const memoryTypeCounts = memories.reduce(
    (result, memory) => {
      result[memory.type] =
        (result[memory.type] || 0) + 1;

      return result;
    },
    {} as Record<string, number>,
  );

  if (!configuration) {
    return (
      <section className="persona-overview">
        <div className="persona-overview-empty">
          <div className="persona-overview-empty-icon">
            <Sparkles size={30} />
          </div>

          <span className="persona-overview-eyebrow">
            AI PERSONA
          </span>

          <h2>
            Create your Persona
          </h2>

          <p>
            Give your Persona an identity, personality and
            access to the memories that matter.
          </p>

          <div className="persona-overview-empty-actions">
            <Link
              to="/app/persona/configure"
              className="primary"
            >
              <Sparkles size={16} />
              Create Persona
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/app/persona/memories"
              className="secondary"
            >
              <Brain size={15} />
              Memory Vault
            </Link>
          </div>

          <div className="persona-overview-feature-grid">
            <Link
              to="/app/persona/memories"
              className="persona-overview-feature"
            >
              <Brain size={18} />

              <strong>
                Memory Vault
              </strong>

              <span>
                Manage the memories your Persona can use.
              </span>

              <ArrowRight size={14} />
            </Link>

            <Link
              to="/app/persona/memories/upload"
              className="persona-overview-feature"
            >
              <Upload size={18} />

              <strong>
                Upload Memory
              </strong>

              <span>
                Add photos, videos, audio or documents.
              </span>

              <ArrowRight size={14} />
            </Link>

            <Link
              to="/app/persona/time-capsules"
              className="persona-overview-feature"
            >
              <Clock3 size={18} />

              <strong>
                Time Capsules
              </strong>

              <span>
                Preserve something for a future date.
              </span>

              <ArrowRight size={14} />
            </Link>

            <Link
              to="/app/persona/conversations"
              className="persona-overview-feature"
            >
              <MessageCircle size={18} />

              <strong>
                Conversations
              </strong>

              <span>
                Talk privately with your Persona.
              </span>

              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="persona-overview">
      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="persona-overview-summary">
        <div>
          <span>
            PERSONA AT A GLANCE
          </span>

          <h2>
            Meet {personaName}
          </h2>

          <p>
            Your Persona currently uses a{" "}
            <strong>
              {configuration.tone.toLowerCase()}
            </strong>{" "}
            communication style.
          </p>
        </div>

        <Link
          to="/app/persona/configure"
          className="persona-summary-button"
        >
          <Settings2 size={15} />
          Edit configuration
        </Link>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="persona-stat-grid">
        <Link
          to="/app/persona/memories"
          className="persona-stat-card"
        >
          <div className="persona-stat-icon blue">
            <Brain size={18} />
          </div>

          <div>
            <strong>
              {connectedMemories.length}
            </strong>

            <span>
              Connected memories
            </span>
          </div>

          <ArrowRight size={15} />
        </Link>

        <Link
          to="/app/persona/memories"
          className="persona-stat-card"
        >
          <div className="persona-stat-icon purple">
            <Sparkles size={18} />
          </div>

          <div>
            <strong>
              {memories.length}
            </strong>

            <span>
              Available memories
            </span>
          </div>

          <ArrowRight size={15} />
        </Link>

        <Link
          to="/app/persona/time-capsules"
          className="persona-stat-card"
        >
          <div className="persona-stat-icon amber">
            <Clock3 size={18} />
          </div>

          <div>
            <strong>
              {capsuleCount}
            </strong>

            <span>
              Time capsules
            </span>
          </div>

          <ArrowRight size={15} />
        </Link>

        <Link
          to="/app/persona/conversations"
          className="persona-stat-card"
        >
          <div className="persona-stat-icon green">
            <MessageCircle size={18} />
          </div>

          <div>
            <strong>
              Private
            </strong>

            <span>
              Conversation space
            </span>
          </div>

          <ArrowRight size={15} />
        </Link>
      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="persona-overview-grid">
        {/* PERSONA */}

        <article className="persona-overview-card">
          <div className="persona-card-heading">
            <div className="persona-card-heading-icon blue">
              <Settings2 size={17} />
            </div>

            <div>
              <span>
                IDENTITY
              </span>

              <h3>
                Your Persona
              </h3>
            </div>
          </div>

          <div className="persona-personality-preview">
            <div className="persona-mini-avatar">
              <Sparkles size={21} />
            </div>

            <div>
              <strong>
                {personaName}
              </strong>

              <span>
                {configuration.tone} communication
              </span>
            </div>
          </div>

          <p>
            Your Persona responds using the identity,
            personality and communication style selected
            in your configuration.
          </p>

          <Link
            to="/app/persona/configure"
            className="persona-card-button"
          >
            Configure Persona
            <ArrowRight size={14} />
          </Link>
        </article>

        {/* MEMORY VAULT */}

        <article className="persona-overview-card">
          <div className="persona-card-heading">
            <div className="persona-card-heading-icon purple">
              <Brain size={17} />
            </div>

            <div>
              <span>
                MEMORY
              </span>

              <h3>
                Memory Vault
              </h3>
            </div>
          </div>

          <div className="persona-memory-main">
            <strong>
              {connectedMemories.length}
            </strong>

            <span>
              memories connected to this Persona
            </span>
          </div>

          <div className="persona-type-list">
            {Object.entries(
              memoryTypeCounts,
            ).map(([type, count]) => (
              <div key={type}>
                <span>
                  {type.charAt(0).toUpperCase() +
                    type.slice(1)}
                </span>

                <strong>
                  {count}
                </strong>
              </div>
            ))}
          </div>

          <Link
            to="/app/persona/memories"
            className="persona-card-button"
          >
            Open Memory Vault
            <ArrowRight size={14} />
          </Link>
        </article>

        {/* UPLOAD */}

        <article className="persona-overview-card persona-upload-card">
          <div className="persona-card-heading">
            <div className="persona-card-heading-icon cyan">
              <Upload size={17} />
            </div>

            <div>
              <span>
                ADD MEMORY
              </span>

              <h3>
                Upload Memory
              </h3>
            </div>
          </div>

          <div className="persona-upload-preview">
            <Upload size={20} />

            <div>
              <strong>
                Add something meaningful
              </strong>

              <span>
                Photos, videos, audio and documents can
                become part of your Persona's memory space.
              </span>
            </div>
          </div>

          <Link
            to="/app/persona/memories/upload"
            className="persona-card-button"
          >
            Upload Memory
            <ArrowRight size={14} />
          </Link>
        </article>

        {/* TIME CAPSULE */}

        <article className="persona-overview-card">
          <div className="persona-card-heading">
            <div className="persona-card-heading-icon amber">
              <Clock3 size={17} />
            </div>

            <div>
              <span>
                FUTURE MEMORIES
              </span>

              <h3>
                Time Capsules
              </h3>
            </div>
          </div>

          <div className="persona-capsule-summary">
            <div className="persona-capsule-number">
              {capsuleCount}
            </div>

            <div>
              <strong>
                Memories waiting for the future
              </strong>

              <span>
                Create messages that unlock on a date
                you choose.
              </span>
            </div>
          </div>

          <Link
            to="/app/persona/time-capsules"
            className="persona-card-button"
          >
            Open Time Capsules
            <ArrowRight size={14} />
          </Link>
        </article>

        {/* CONVERSATIONS */}

        <article className="persona-overview-card persona-conversation-card">
          <div className="persona-card-heading">
            <div className="persona-card-heading-icon green">
              <MessageCircle size={17} />
            </div>

            <div>
              <span>
                PERSONA EXPERIENCE
              </span>

              <h3>
                Conversations
              </h3>
            </div>
          </div>

          <div className="persona-conversation-preview">
            <div className="persona-conversation-avatar">
              <MessageCircle size={19} />
            </div>

            <div className="persona-chat-lines">
              <span />
              <span />
              <span />
            </div>
          </div>

          <p>
            Start a private conversation using your Persona
            and its connected memories.
          </p>

          <Link
            to="/app/persona/conversations"
            className="persona-card-button"
          >
            Open Conversations
            <ArrowRight size={14} />
          </Link>
        </article>
      </div>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="persona-quick-actions">
        <div className="persona-quick-heading">
          <span>
            QUICK ACTIONS
          </span>

          <h3>
            Continue building your Persona
          </h3>
        </div>

        <div className="persona-quick-grid">
          <Link
            to="/app/persona/memories/upload"
            className="persona-quick-action"
          >
            <Upload size={17} />

            <span>
              <strong>
                Upload memory
              </strong>

              Add a photo, video, audio or document.
            </span>

            <ArrowRight size={14} />
          </Link>

          <Link
            to="/app/persona/memories"
            className="persona-quick-action"
          >
            <Brain size={17} />

            <span>
              <strong>
                Manage Memory Vault
              </strong>

              Choose which memories your Persona can access.
            </span>

            <ArrowRight size={14} />
          </Link>

          <Link
            to="/app/persona/conversations"
            className="persona-quick-action"
          >
            <MessageCircle size={17} />

            <span>
              <strong>
                Start conversation
              </strong>

              Talk privately with your Persona.
            </span>

            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </section>
  );
}