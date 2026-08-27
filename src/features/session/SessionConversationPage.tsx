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

import { getSession } from "./session.api";
import type { SessionRecord } from "./session.types";

import "./SessionConversationPage.css";

interface ConversationMessage {
  id: number;
  sender: "persona" | "user";
  text: string;
  time: string;
}

const initialMessages: ConversationMessage[] = [
  {
    id: 1,
    sender: "persona",
    text: "What is one family memory that you would always want to keep close?",
    time: "8:42 PM",
  },
  {
    id: 2,
    sender: "user",
    text: "I always remember the evenings when our whole family would sit together.",
    time: "8:43 PM",
  },
  {
    id: 3,
    sender: "persona",
    text: "Those simple moments often become the memories we value most. What do you remember most about those evenings?",
    time: "8:43 PM",
  },
  {
    id: 4,
    sender: "user",
    text: "Everyone would talk about their day, and we would spend time together without worrying about anything else.",
    time: "8:45 PM",
  },
];

function SessionConversationPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [session, setSession] = useState<SessionRecord | null>(null);

  const [sessionLoading, setSessionLoading] = useState(true);

  const [sessionError, setSessionError] = useState<string | null>(null);

  const [messages, setMessages] =
    useState<ConversationMessage[]>(initialMessages);

  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);

  /* =========================================================
     LOAD REAL S2 SESSION
  ========================================================= */

  useEffect(() => {
    if (!sessionId) {
      setSessionError("Session ID is missing.");
      setSessionLoading(false);
      return;
    }

    let active = true;

    async function loadSession() {
      setSessionLoading(true);
      setSessionError(null);

      try {
        const result = await getSession(sessionId);

        if (active) {
          setSession(result);
        }
      } catch (error) {
        console.error("Failed to load session:", error);

        if (active) {
          setSessionError(
            error instanceof Error ? error.message : "Unable to load session.",
          );
        }
      } finally {
        if (active) {
          setSessionLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, [sessionId]);
  /* =========================================================
     SEND MESSAGE
     
     S2 currently does not expose a message endpoint.
     Therefore this keeps the existing temporary frontend
     conversation behavior for now.
  ========================================================= */

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    const newMessage: ConversationMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
      time: "Now",
    };

    setMessages((current) => [...current, newMessage]);

    setMessage("");

    setSending(true);

    window.setTimeout(() => {
      const response: ConversationMessage = {
        id: Date.now() + 1,
        sender: "persona",
        text: "Thank you for sharing that memory. Your preserved family stories help keep these meaningful moments connected.",
        time: "Now",
      };

      setMessages((current) => [...current, response]);

      setSending(false);
    }, 700);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (sessionLoading) {
    return (
      <main className="session-conversation-page">
        <div className="session-conversation-loading">
          <h2>Loading session...</h2>

          <p>Preparing your conversation.</p>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (sessionError || !session) {
    return (
      <main className="session-conversation-page">
        <div className="session-conversation-loading">
          <h2>Unable to load session</h2>

          <p>{sessionError || "Session could not be found."}</p>

          <Button variant="outline" onClick={() => navigate("/app/persona")}>
            Back to Persona
          </Button>
        </div>
      </main>
    );
  }

  /* =========================================================
     DERIVED SESSION DATA
  ========================================================= */

  const sessionStatus = session.status;

  const statusLabel =
    sessionStatus === "ACTIVE"
      ? "Active"
      : sessionStatus === "ENDED"
        ? "Ended"
        : "Expired";

  const statusVariant = sessionStatus === "ACTIVE" ? "success" : "neutral";

  const sessionDate = new Date(session.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const personaLabel =
    session.personaId === "family-persona"
      ? "Family Memory Persona"
      : session.personaId;

  const modeLabel = session.mode.replaceAll("_", " ");

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="session-conversation-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

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

                <Badge variant={statusVariant} dot>
                  {statusLabel}
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

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="session-conversation-layout">
        {/* ===================================================
            CHAT
        =================================================== */}

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

              {sessionStatus === "ACTIVE"
                ? "Conversation active"
                : "Conversation ended"}
            </div>
          </div>

          {/* MESSAGES */}

          <div className="session-conversation-messages">
            <div className="session-date-divider">
              <span>{sessionDate}</span>
            </div>

            {messages.map((item) => (
              <div
                key={item.id}
                className={`session-message ${
                  item.sender === "user"
                    ? "session-message-user"
                    : "session-message-persona"
                }`}
              >
                {item.sender === "persona" && (
                  <div className="session-message-avatar persona">
                    <Bot size={14} />
                  </div>
                )}

                <div className="session-message-body">
                  <div className="session-message-author">
                    {item.sender === "user" ? "You" : personaLabel}
                  </div>

                  <div className="session-message-bubble">{item.text}</div>

                  <span className="session-message-time">{item.time}</span>
                </div>

                {item.sender === "user" && (
                  <div className="session-message-avatar user">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="session-message session-message-persona">
                <div className="session-message-avatar persona">
                  <Bot size={14} />
                </div>

                <div className="session-message-body">
                  <div className="session-message-author">{personaLabel}</div>

                  <div className="session-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* COMPOSER */}

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
                  if (event.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Continue this conversation..."
                disabled={sending || sessionStatus !== "ACTIVE"}
              />

              <button
                type="button"
                className="session-send-button"
                onClick={handleSend}
                disabled={
                  !message.trim() || sending || sessionStatus !== "ACTIVE"
                }
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="session-conversation-sidebar">
          {/* SESSION DETAILS */}

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

                <strong>{statusLabel}</strong>
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

          {/* PERSONA */}

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

          {/* ACTIONS */}

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
