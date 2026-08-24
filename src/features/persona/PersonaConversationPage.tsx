import {
  ArrowLeft,
  Bot,
  Brain,
  MessageCircle,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import { usePersona } from "./PersonaContext";

import "./PersonaConversationPage.css";

function PersonaConversationPage() {
  const navigate = useNavigate();

  const {
    configuration,
    messages,
    hydrated,
    sending,
    error,
    sendMessage,
    clearMessages,
    clearError,
  } = usePersona();

  const [input, setInput] = useState("");

  const [showClearDialog, setShowClearDialog] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* =======================================================
     SCROLL
  ======================================================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  /* =======================================================
     SEND
  ======================================================= */

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const text = input.trim();

    if (!text || sending) {
      return;
    }

    try {
      await sendMessage(text);

      setInput("");
    } catch {
      // Error displayed by context.
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!hydrated) {
    return (
      <main className="persona-chat-page">
        <div className="persona-chat-loading">
          <div className="persona-chat-loader" />

          <h2>Loading conversation</h2>

          <p>Preparing your private Persona.</p>
        </div>
      </main>
    );
  }

  /* =======================================================
     NO PERSONA
  ======================================================= */

  if (!configuration) {
    return (
      <main className="persona-chat-page">
        <section className="persona-chat-empty-page">
          <div className="persona-chat-empty-icon">
            <Brain size={28} />
          </div>

          <span>PERSONA</span>

          <h1>Configure your Persona first</h1>

          <p>Create your Persona before starting a conversation.</p>

          <button
            type="button"
            onClick={() => navigate("/app/persona/configure")}
          >
            Configure Persona
          </button>
        </section>
      </main>
    );
  }

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <main className="persona-chat-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="persona-chat-page-header">
        <div>
          <button
            type="button"
            className="persona-chat-back"
            onClick={() => navigate("/app/persona")}
          >
            <ArrowLeft size={15} />
            Persona
          </button>

          <div className="persona-chat-title">
            <div className="persona-chat-title-icon">
              <Brain size={21} />
            </div>

            <div>
              <span>PRIVATE CONVERSATION</span>

              <h1>{configuration.name}</h1>

              <p>
                {configuration.tone} tone
                {" · "}
                {configuration.selectedMemoryIds.length} connected memories
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="persona-chat-clear"
          disabled={messages.length === 0}
          onClick={() => setShowClearDialog(true)}
        >
          <Trash2 size={14} />
          Clear
        </button>
      </header>

      {/* ERROR */}

      {error && (
        <div className="persona-chat-error">
          <span>{error}</span>

          <button type="button" onClick={clearError}>
            Dismiss
          </button>
        </div>
      )}

      {/* =================================================
          CHAT
      ================================================= */}

      <section className="persona-chat-container">
        <div className="persona-chat-topbar">
          <div className="persona-chat-mini-avatar">
            <Brain size={17} />
          </div>

          <div>
            <strong>{configuration.name}</strong>

            <span>Personal AI companion</span>
          </div>

          <div className="persona-online">
            <span />
            Ready
          </div>
        </div>

        <div className="persona-messages">
          {messages.length === 0 ? (
            <div className="persona-welcome">
              <div className="persona-welcome-icon">
                <MessageCircle size={24} />
              </div>

              <h2>Start a meaningful conversation</h2>

              <p>
                Talk about your memories, reflect on your experiences, or simply
                have a conversation with your Persona.
              </p>

              <div className="persona-suggestions">
                <button
                  type="button"
                  onClick={() =>
                    handleSuggestion("Help me reflect on one of my memories.")
                  }
                >
                  Reflect on a memory
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSuggestion(
                      "Tell me something meaningful to think about today.",
                    )
                  }
                >
                  Daily reflection
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSuggestion("I want to talk about my family.")
                  }
                >
                  Talk about family
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const user = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`persona-message ${
                      user
                        ? "persona-message-user"
                        : "persona-message-assistant"
                    }`}
                  >
                    <div
                      className={`persona-message-avatar ${
                        user ? "user" : "assistant"
                      }`}
                    >
                      {user ? <UserRound size={14} /> : <Bot size={14} />}
                    </div>

                    <div className="persona-message-body">
                      <div className="persona-message-meta">
                        <strong>{user ? "You" : configuration.name}</strong>

                        <span>
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="persona-message-bubble">
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {sending && (
            <div className="persona-message persona-message-assistant">
              <div className="persona-message-avatar assistant">
                <Bot size={14} />
              </div>

              <div className="persona-message-body">
                <div className="persona-message-meta">
                  <strong>{configuration.name}</strong>
                </div>

                <div className="persona-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* =================================================
            INPUT
        ================================================= */}

        <div className="persona-input-section">
          <form className="persona-input-form" onSubmit={handleSubmit}>
            <textarea
              value={input}
              disabled={sending}
              maxLength={2000}
              rows={1}
              placeholder={`Message ${configuration.name}...`}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();

                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />

            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
            >
              {sending ? (
                <span className="persona-send-loader" />
              ) : (
                <Send size={17} />
              )}
            </button>
          </form>

          <div className="persona-input-footer">
            <span>Enter to send</span>

            <span>Shift + Enter for new line</span>

            <span>{input.length}/2000</span>
          </div>
        </div>
      </section>

      {/* =================================================
          CLEAR DIALOG
      ================================================= */}

      {showClearDialog && (
        <div
          className="persona-dialog-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowClearDialog(false);
            }
          }}
        >
          <div className="persona-dialog">
            <div className="persona-dialog-icon">
              <Trash2 size={20} />
            </div>

            <span>CONVERSATION</span>

            <h2>Clear conversation?</h2>

            <p>
              This will remove the messages currently displayed in this Persona
              session.
            </p>

            <div className="persona-dialog-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setShowClearDialog(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="danger"
                onClick={() => {
                  clearMessages();

                  setShowClearDialog(false);
                }}
              >
                <Trash2 size={14} />
                Clear conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default PersonaConversationPage;
