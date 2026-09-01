import {
  ArrowLeft,
  CheckCircle2,
  CalendarDays,
  Clock3,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
  User,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import { getSession } from "../session/session.api";
import type { SessionRecord } from "../session/session.types";

import "./SessionDetailsPage.css";

function SessionDetailsPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();

  const [session, setSession] = useState<SessionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD SESSION FROM S3
     
     Confirmed backend endpoint:
     GET /api/v1/sessions/{sessionId}
     ========================================================= */

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID is missing.");
      setLoading(false);
      return;
    }

    let active = true;

    async function loadSession() {
      setLoading(true);
      setError("");

      try {
        const result = await getSession(sessionId);

        if (active) {
          setSession(result);
        }
      } catch (error) {
        console.error("Failed to load session:", error);

        if (active) {
          setError(
            error instanceof Error ? error.message : "Unable to load session.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, [sessionId]);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <main className="session-details-page">
        <div className="session-details-loading">
          <MessageCircle size={20} />
          <p>Loading session...</p>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error || !session) {
    return (
      <main className="session-details-page">
        <div className="session-details-error">
          <h1>Session unavailable</h1>

          <p>{error || "The requested session could not be found."}</p>

          <Button variant="primary" onClick={() => navigate("/app/sessions")}>
            Back to Sessions
          </Button>
        </div>
      </main>
    );
  }

  /* =========================================================
     DERIVED DATA
     ========================================================= */

  const createdDate = new Date(session.createdAt);

  const formattedDate = createdDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = createdDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  const statusLabel =
    session.status.charAt(0) + session.status.slice(1).toLowerCase();

  const statusVariant =
    session.status === "ACTIVE"
      ? "success"
      : session.status === "ENDED"
        ? "success"
        : "warning";

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
                <h1>Session {session.sessionId}</h1>

                <Badge variant={statusVariant} dot>
                  {statusLabel}
                </Badge>
              </div>

              <p>
                {session.mode} session using the{" "}
                {session.inputChannel.toLowerCase()} input channel.
              </p>
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
            <strong>{formattedDate}</strong>
          </div>
        </div>

        <div className="session-summary-item">
          <div className="session-summary-icon">
            <Clock3 size={16} />
          </div>

          <div>
            <span>Started</span>
            <strong>{formattedTime}</strong>
          </div>
        </div>

        <div className="session-summary-item">
          <div className="session-summary-icon">
            <MessageCircle size={16} />
          </div>

          <div>
            <span>Mode</span>
            <strong>{session.mode}</strong>
          </div>
        </div>

        <div className="session-summary-item">
          <div className="session-summary-icon">
            <Sparkles size={16} />
          </div>

          <div>
            <span>Output</span>
            <strong>{session.outputChannel}</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="session-details-layout">
        <section className="session-details-main">
          <Card
            title="Session overview"
            description="Details returned by the EchoLife Session Orchestrator."
          >
            <div className="session-overview">
              <div className="session-overview-hero">
                <div className="session-overview-avatar">
                  <Sparkles size={24} />
                </div>

                <div>
                  <h2>{session.mode} session</h2>

                  <p>
                    This session is associated with persona{" "}
                    <strong>{session.personaId}</strong>.
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
                    <strong>Session status</strong>

                    <span>
                      The backend currently reports this session as{" "}
                      {statusLabel}.
                    </span>
                  </div>
                </div>

                <div className="session-highlight">
                  <div className="session-highlight-icon">
                    <User size={15} />
                  </div>

                  <div>
                    <strong>Persona</strong>

                    <span>{session.personaId}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="Session configuration"
            description="Configuration captured when the session was created."
          >
            <div className="session-info-list">
              <div>
                <span>Input channel</span>
                <strong>{session.inputChannel}</strong>
              </div>

              <div>
                <span>Output channel</span>
                <strong>{session.outputChannel}</strong>
              </div>

              <div>
                <span>Client type</span>
                <strong>{session.clientType}</strong>
              </div>

              <div>
                <span>Policy version</span>
                <strong>{session.policyVersion}</strong>
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
            description="Details from the Session Orchestrator."
          >
            <div className="session-info-list">
              <div>
                <span>Session ID</span>
                <strong>{session.sessionId}</strong>
              </div>

              <div>
                <span>User ID</span>
                <strong>{session.userId}</strong>
              </div>

              <div>
                <span>Status</span>

                <Badge variant={statusVariant} dot>
                  {statusLabel}
                </Badge>
              </div>

              <div>
                <span>Created</span>
                <strong>{formattedDate}</strong>
              </div>

              <div>
                <span>Policy version</span>
                <strong>{session.policyVersion}</strong>
              </div>
            </div>
          </Card>

          <Card
            title="Persona used"
            description="The Persona associated with this session."
          >
            <div className="session-persona-card">
              <div className="session-persona-avatar">
                <Sparkles size={20} />
              </div>

              <div>
                <h3>{session.personaId}</h3>
                <p>{session.mode}</p>
              </div>
            </div>

            <div className="session-persona-status">
              <CheckCircle2 size={14} />
              <span>Session configuration loaded</span>
            </div>
          </Card>

          <div className="session-open-action">
            <Button
              variant="primary"
              size="large"
              icon={<MessageCircle size={16} />}
              onClick={() =>
                navigate(`/app/sessions/${session.sessionId}/conversation`)
              }
            >
              Open conversation
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default SessionDetailsPage;
