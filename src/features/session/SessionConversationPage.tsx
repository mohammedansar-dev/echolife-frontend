import { useState } from "react";
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

  const [messages, setMessages] =
    useState<ConversationMessage[]>(initialMessages);

  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);

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
                <h1>Family memories conversation</h1>

                <Badge variant="success" dot>
                  Completed
                </Badge>
              </div>

              <p>Preserved family conversation</p>
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
                <strong>Family Memory Persona</strong>

                <span>Warm & caring</span>
              </div>
            </div>

            <div className="session-chat-status">
              <span />
              Conversation preserved
            </div>
          </div>

          {/* MESSAGES */}

          <div className="session-conversation-messages">
            <div className="session-date-divider">
              <span>Aug 22, 2026</span>
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
                    {item.sender === "user" ? "You" : "Family Persona"}
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
                  <div className="session-message-author">Family Persona</div>

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
              This is a preserved session. New messages are shown as a temporary
              preview.
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
                disabled={sending}
              />

              <button
                type="button"
                className="session-send-button"
                onClick={handleSend}
                disabled={!message.trim() || sending}
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

                <strong>Aug 22, 2026</strong>
              </div>

              <div>
                <span>
                  <Clock3 size={12} />
                  Duration
                </span>

                <strong>18 minutes</strong>
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
                <strong>Family Memory Persona</strong>

                <span>Warm & caring</span>
              </div>
            </div>

            <div className="session-side-active">
              <span />
              Approved memories enabled
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
