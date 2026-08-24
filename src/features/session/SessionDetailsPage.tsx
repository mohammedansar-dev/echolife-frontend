import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import "./SessionDetailsPage.css";

function SessionDetailsPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const isFamilyMemorySession = sessionId === "session-1";

  const sessionTitle = isFamilyMemorySession
    ? "Family memories conversation"
    : "Family conversation";

  const sessionDescription = isFamilyMemorySession
    ? "A conversation about meaningful family memories and stories."
    : "A preserved EchoLife family conversation.";

  return (
    <main className="session-details-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="session-details-header">
        <div>
          <button
            type="button"
            className="session-details-back"
            onClick={() => navigate("/app/sessions")}
          >
            <ArrowLeft size={15} />
            <span>Back to Sessions</span>
          </button>

          <div className="session-details-heading">
            <div className="session-details-icon">
              <MessageCircle size={21} />
            </div>

            <div>
              <div className="session-details-title-row">
                <h1>{sessionTitle}</h1>

                <Badge variant="success" dot>
                  Completed
                </Badge>
              </div>

              <p>{sessionDescription}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="session-more-button"
          aria-label="More options"
        >
          <MoreHorizontal size={17} />
        </button>
      </header>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="session-details-summary">
        <div className="session-summary-item">
          <div className="session-summary-icon">
            <CalendarDays size={16} />
          </div>

          <div>
            <span>Date</span>

            <strong>Aug 22, 2026</strong>
          </div>
        </div>

        <div className="session-summary-item">
          <div className="session-summary-icon">
            <Clock3 size={16} />
          </div>

          <div>
            <span>Duration</span>

            <strong>18 minutes</strong>
          </div>
        </div>

        <div className="session-summary-item">
          <div className="session-summary-icon">
            <MessageCircle size={16} />
          </div>

          <div>
            <span>Messages</span>

            <strong>24 messages</strong>
          </div>
        </div>

        <div className="session-summary-item">
          <div className="session-summary-icon">
            <Sparkles size={16} />
          </div>

          <div>
            <span>Persona</span>

            <strong>Family Memory</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="session-details-layout">
        {/* ===================================================
            MAIN CARD
        =================================================== */}

        <section className="session-details-main">
          <Card
            title="Conversation overview"
            description="A summary of this preserved family conversation."
          >
            <div className="session-overview">
              <div className="session-overview-hero">
                <div className="session-overview-avatar">
                  <Sparkles size={24} />
                </div>

                <div>
                  <h2>Family memories</h2>

                  <p>
                    This session explored meaningful memories, family stories,
                    and moments worth preserving.
                  </p>
                </div>
              </div>

              <div className="session-overview-divider" />

              <div className="session-highlights">
                <div className="session-highlight">
                  <div className="session-highlight-icon">
                    <CheckCircle2 size={15} />
                  </div>

                  <div>
                    <strong>Preserved conversation</strong>

                    <span>
                      This session is safely stored in your EchoLife account.
                    </span>
                  </div>
                </div>

                <div className="session-highlight">
                  <div className="session-highlight-icon">
                    <User size={15} />
                  </div>

                  <div>
                    <strong>Family Persona</strong>

                    <span>
                      The conversation used your configured family Persona.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* RECENT MESSAGES */}

          <Card
            title="Conversation preview"
            description="A preview of the messages from this session."
            action={
              <button
                type="button"
                className="session-preview-link"
                onClick={() =>
                  navigate(`/app/sessions/${sessionId}/conversation`)
                }
              >
                View full conversation
                <ArrowRight size={13} />
              </button>
            }
          >
            <div className="session-message-preview">
              <div className="session-preview-message">
                <div className="session-preview-avatar persona">
                  <Sparkles size={13} />
                </div>

                <div>
                  <span>Family Persona</span>

                  <p>
                    What is one family memory that you would always want to keep
                    close?
                  </p>
                </div>
              </div>

              <div className="session-preview-message user">
                <div className="session-preview-avatar user">
                  <User size={13} />
                </div>

                <div>
                  <span>You</span>

                  <p>
                    I always remember the evenings when our whole family would
                    sit together.
                  </p>
                </div>
              </div>

              <div className="session-preview-message">
                <div className="session-preview-avatar persona">
                  <Sparkles size={13} />
                </div>

                <div>
                  <span>Family Persona</span>

                  <p>
                    Those simple moments often become the memories we value
                    most.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="session-details-sidebar">
          <Card
            title="Session information"
            description="Details about this conversation."
          >
            <div className="session-info-list">
              <div>
                <span>Session ID</span>

                <strong>{sessionId}</strong>
              </div>

              <div>
                <span>Status</span>

                <Badge variant="success" dot>
                  Completed
                </Badge>
              </div>

              <div>
                <span>Started</span>

                <strong>8:42 PM</strong>
              </div>

              <div>
                <span>Duration</span>

                <strong>18 minutes</strong>
              </div>
            </div>
          </Card>

          {/* PERSONA CARD */}

          <Card
            title="Persona used"
            description="The Persona that participated in this conversation."
          >
            <div className="session-persona-card">
              <div className="session-persona-avatar">
                <Sparkles size={20} />
              </div>

              <div>
                <h3>Family Memory Persona</h3>

                <p>Warm & caring</p>
              </div>
            </div>

            <div className="session-persona-status">
              <CheckCircle2 size={14} />

              <span>Approved memories enabled</span>
            </div>
          </Card>

          {/* ACTION */}

          <div className="session-open-action">
            <Button
              variant="primary"
              size="large"
              icon={<MessageCircle size={16} />}
              onClick={() =>
                navigate(`/app/sessions/${sessionId}/conversation`)
              }
            >
              Open conversation
            </Button>

            <p>Continue viewing this preserved conversation.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default SessionDetailsPage;
