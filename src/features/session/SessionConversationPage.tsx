import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Bot,
  CalendarDays,
  Clock3,
  MoreHorizontal,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

import {
  endSession,
  getSession,
  getSessionMessages,
  sendSessionMessage,
} from "./session.api";

import type { SessionMessage, SessionRecord } from "./session.types";

import "./SessionConversationPage.css";

function SessionConversationPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [session, setSession] = useState<SessionRecord | null>(null);

  const [messages, setMessages] = useState<SessionMessage[]>([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     LOAD SESSION + HISTORY
  ========================================================= */

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID is missing.");
      setLoading(false);
      return;
    }

    let active = true;

    async function loadConversation() {
      setLoading(true);
      setError("");

      try {
        const [sessionData, messageData] = await Promise.all([
          getSession(sessionId),
          getSessionMessages(sessionId),
        ]);

        if (!active) {
          return;
        }

        setSession(sessionData);
        setMessages(messageData);
      } catch (error) {
        console.error("Failed to load session conversation:", error);

        if (active) {
          setError("Unable to load this conversation.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadConversation();

    return () => {
      active = false;
    };
  }, [sessionId]);

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const handleSend = async () => {
    const trimmed = message.trim();

    if (!sessionId || !trimmed || sending) {
      return;
    }

    if (session?.status !== "ACTIVE") {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await sendSessionMessage(sessionId, {
        message: trimmed,
      });

      setMessage("");

      /*
       * If backend returns the created assistant/user message,
       * append it to the UI.
       *
       * Otherwise reload history from the backend.
       */

      if ("role" in response && "content" in response) {
        setMessages((current) => [...current, response]);
      } else if (response.message) {
        setMessages((current) => [...current, response.message!]);
      } else if (response.data) {
        setMessages((current) => [...current, response.data!]);
      } else {
        const refreshedMessages = await getSessionMessages(sessionId);

        setMessages(refreshedMessages);
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      setError("Unable to send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  /* =========================================================
     END SESSION
  ========================================================= */

  const handleEndSession = async () => {
    if (!sessionId || ending) {
      return;
    }

    setEnding(true);
    setError("");

    try {
      const updatedSession = await endSession(sessionId);

      setSession((current) =>
        current
          ? {
              ...current,
              ...updatedSession,
              status: "ENDED",
            }
          : current,
      );
    } catch (error) {
      console.error("Failed to end session:", error);

      setError("Unable to end the session. Please try again.");
    } finally {
      setEnding(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="session-conversation-page">
        <div className="session-conversation-loading">
          <h2>Loading conversation...</h2>
          <p>Preparing your session.</p>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (!session || (error && !session)) {
    return (
      <main className="session-conversation-page">
        <div className="session-conversation-loading">
          <h2>Unable to load conversation</h2>

          <p>{error || "Session could not be found."}</p>

          <Button variant="outline" onClick={() => navigate("/app/sessions")}>
            Back to Sessions
          </Button>
        </div>
      </main>
    );
  }

  const sessionDate = new Date(session.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const personaLabel = session.personaId;

  const modeLabel = session.mode.replaceAll("_", " ");

  return (
    <main className="session-conversation-page">
      <header className="session-conversation-header">
        <div className="session-conversation-heading">
          <button
            type="button"
            className="session-conversation-back"
            onClick={() => navigate(`/app/sessions/${sessionId}`)}
          >
            <ArrowLeft size={15} />
            <span>Back to session</span>
          </button>

          <div className="session-conversation-title">
            <div className="session-conversation-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <div className="session-title-line">
                <h1>{personaLabel}</h1>

                <Badge
                  variant={session.status === "ACTIVE" ? "success" : "neutral"}
                  dot
                >
                  {session.status}
                </Badge>
              </div>

              <p>
                {modeLabel} · {session.outputChannel}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="session-conversation-more"
          aria-label="More options"
        >
          <MoreHorizontal size={17} />
        </button>
      </header>

      <div className="session-conversation-layout">
        <section className="session-conversation-card">
          <div className="session-conversation-card-header">
            <div className="session-chat-persona">
              <div className="session-chat-avatar">
                <Bot size={17} />
              </div>

              <div>
                <strong>{personaLabel}</strong>
                <span>Session {session.sessionId}</span>
              </div>
            </div>

            <div className="session-chat-status">
              <span />

              {session.status === "ACTIVE"
                ? "Conversation active"
                : "Conversation ended"}
            </div>
          </div>

          <div className="session-conversation-messages">
            <div className="session-date-divider">
              <span>{sessionDate}</span>
            </div>

            {messages.map((item) => {
              const isUser = item.role === "USER";

              return (
                <div
                  key={item.id}
                  className={`session-message ${
                    isUser ? "session-message-user" : "session-message-persona"
                  }`}
                >
                  {!isUser && (
                    <div className="session-message-avatar persona">
                      <Bot size={14} />
                    </div>
                  )}

                  <div className="session-message-body">
                    <div className="session-message-author">
                      {isUser ? "You" : personaLabel}
                    </div>

                    <div className="session-message-bubble">{item.content}</div>

                    <span className="session-message-time">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleTimeString("en-IN", {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>

                  {isUser && (
                    <div className="session-message-avatar user">
                      <User size={14} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mx-4 mb-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="session-conversation-composer">
            <div className="session-readonly-note">
              Session: {session.sessionId}
            </div>

            <div className="session-composer-row">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Continue this conversation..."
                disabled={sending || session.status !== "ACTIVE"}
              />

              <button
                type="button"
                className="session-send-button"
                onClick={() => void handleSend()}
                disabled={
                  !message.trim() || sending || session.status !== "ACTIVE"
                }
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>

            {session.status === "ACTIVE" && (
              <button
                type="button"
                onClick={() => void handleEndSession()}
                disabled={ending}
                className="mt-3 text-xs text-slate-500 hover:text-red-600"
              >
                {ending ? "Ending session..." : "End session"}
              </button>
            )}
          </div>
        </section>

        <aside className="session-conversation-sidebar">
          <div className="session-side-card">
            <div className="session-side-title">
              <h2>Session details</h2>
              <p>Information about this conversation.</p>
            </div>

            <div className="session-side-list">
              <div>
                <span>
                  <CalendarDays size={12} />
                  Date
                </span>

                <strong>{sessionDate}</strong>
              </div>

              <div>
                <span>
                  <Clock3 size={12} />
                  Status
                </span>

                <strong>{session.status}</strong>
              </div>

              <div>
                <span>
                  <MessageIcon />
                  Messages
                </span>

                <strong>{messages.length}</strong>
              </div>
            </div>
          </div>

          <div className="session-side-card">
            <div className="session-side-title">
              <h2>Persona</h2>
              <p>Persona used in this session.</p>
            </div>

            <div className="session-side-persona">
              <div className="session-side-persona-icon">
                <Sparkles size={18} />
              </div>

              <div>
                <strong>{personaLabel}</strong>

                <span>Mode: {modeLabel}</span>
              </div>
            </div>

            <div className="session-side-active">
              <span />

              {session.status === "ACTIVE"
                ? "Session is active"
                : "Session is no longer active"}
            </div>
          </div>

          <div className="session-side-actions">
            <Button
              variant="outline"
              size="medium"
              onClick={() => navigate(`/app/sessions/${sessionId}`)}
            >
              <ArrowLeft size={14} />
              Session details
            </Button>

            <Button
              variant="outline"
              size="medium"
              onClick={() => navigate("/app/sessions")}
            >
              All sessions
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function MessageIcon() {
  return <Send size={12} />;
}

export default SessionConversationPage;
