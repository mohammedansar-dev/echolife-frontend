import {
  ArrowRight,
  Brain,
  MessageCircle,
  Plus,
  Settings2,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { usePersona } from "../PersonaContext";

import "./PersonaConversationPage.css";

export default function PersonaConversationsPage() {
  const navigate = useNavigate();

  const {
    configuration,
    messages,
  } = usePersona();

  if (!configuration) {
    return (
      <section className="persona-conversations-empty">
        <div className="persona-conversation-empty-icon">
          <Brain size={28} />
        </div>

        <span>CONVERSATIONS</span>

        <h2>Configure your Persona first</h2>

        <p>
          Create your Persona identity and select the
          memories it should use before starting a
          private conversation.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/app/persona/configure")
          }
        >
          Configure Persona
          <ArrowRight size={15} />
        </button>
      </section>
    );
  }

  const memoryCount =
    configuration.selectedMemoryIds?.length ?? 0;

  return (
    <section className="persona-conversations-page">

      {/* HEADER */}

      <header className="persona-conversations-heading">
        <div>
          <span className="persona-section-eyebrow">
            PRIVATE CONVERSATIONS
          </span>

          <h2>
            Talk with {configuration.name}
          </h2>

          <p>
            Start a private conversation using your
            configured Persona and connected memories.
          </p>
        </div>

        <button
          type="button"
          className="persona-start-button"
          onClick={() =>
            navigate("/app/persona/conversation")
          }
        >
          <MessageCircle size={15} />
          Start conversation
        </button>
      </header>

      {/* HERO */}

      <section className="persona-conversation-hero">
        <div className="persona-conversation-orb">
          <Brain size={27} />
        </div>

        <div className="persona-conversation-hero-copy">
          <span>READY TO CHAT</span>

          <h3>
            A conversation shaped by your memories
          </h3>

          <p>
            {memoryCount}{" "}
            {memoryCount === 1
              ? "memory is"
              : "memories are"}{" "}
            connected to this Persona with a{" "}
            {configuration.tone.toLowerCase()} tone.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/app/persona/conversation")
          }
          aria-label="Start conversation"
        >
          <ArrowRight size={18} />
        </button>
      </section>

      {/* WORKSPACE */}

      <section className="persona-conversation-workspace">

        <div className="persona-conversation-workspace-header">
          <div>
            <span>CONVERSATION SPACE</span>

            <h3>Your private conversation</h3>

            <p>
              Your current Persona configuration will be
              used for the conversation experience.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/app/persona/configure")
            }
          >
            <Settings2 size={14} />
            Settings
          </button>
        </div>

        <div className="persona-chat-empty">
          <div className="persona-chat-empty-visual">
            <div className="persona-chat-avatar">
              <Brain size={22} />
            </div>

            <div className="persona-chat-bubbles">
              <span />
              <span />
              <span />
            </div>
          </div>

          <Sparkles size={17} />

          <strong>
            {messages.length
              ? `${messages.length} messages in the current conversation`
              : "No conversation started yet"}
          </strong>

          <p>
            Begin whenever you are ready. Your Persona
            will use the configuration you selected.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/app/persona/conversation")
            }
          >
            <Plus size={14} />
            {messages.length
              ? "Continue conversation"
              : "Start conversation"}
          </button>
        </div>
      </section>
    </section>
  );
}