import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MessageCircle,
  Plus,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import { getSessions } from "./session.api";
import type { SessionListItem } from "./session.types";

import "./SessionsPage.css";

function SessionsPage() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSessions() {
      setLoading(true);
      setError("");

      try {
        const data = await getSessions();

        if (active) {
          setSessions(data);
        }
      } catch (error) {
        console.error("Failed to load sessions:", error);

        if (active) {
          setError("Unable to load your sessions. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSessions();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="sessions-page">
      <header className="sessions-header">
        <div className="sessions-heading">
          <div className="sessions-heading-icon">
            <MessageCircle size={22} />
          </div>

          <div>
            <h1>Sessions</h1>

            <p>
              Revisit your previous conversations and continue meaningful family
              stories.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={15} />}
          onClick={() => navigate("/app/persona/conversation")}
        >
          New conversation
        </Button>
      </header>

      <section className="sessions-summary">
        <div className="sessions-summary-card">
          <div className="sessions-summary-icon">
            <MessageCircle size={17} />
          </div>

          <div>
            <span>Total sessions</span>
            <strong>{sessions.length}</strong>
          </div>
        </div>

        <div className="sessions-summary-card">
          <div className="sessions-summary-icon">
            <Clock3 size={17} />
          </div>

          <div>
            <span>Conversation time</span>
            <strong>—</strong>
          </div>
        </div>

        <div className="sessions-summary-card">
          <div className="sessions-summary-icon">
            <Sparkles size={17} />
          </div>

          <div>
            <span>Persona sessions</span>
            <strong>{sessions.length}</strong>
          </div>
        </div>
      </section>

      <section className="sessions-section">
        <div className="sessions-section-heading">
          <div>
            <h2>Recent sessions</h2>
            <p>Your latest family conversations.</p>
          </div>
        </div>

        {loading && (
          <div className="sessions-list">
            <Card className="session-card">
              <div className="session-card-content">
                <div className="session-card-main">
                  <p>Loading sessions...</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {!loading && error && (
          <div className="sessions-list">
            <Card className="session-card">
              <div className="session-card-content">
                <div className="session-card-main">
                  <h3>Unable to load sessions</h3>
                  <p>{error}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div className="sessions-list">
            <Card className="session-card">
              <div className="session-card-content">
                <div className="session-card-main">
                  <h3>No sessions yet</h3>
                  <p>Start a new conversation to create your first session.</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {!loading && !error && sessions.length > 0 && (
          <div className="sessions-list">
            {sessions.map((session) => {
              const createdDate = new Date(session.createdAt);

              return (
                <Card
                  key={session.sessionId}
                  className="session-card"
                  onClick={() => navigate(`/app/sessions/${session.sessionId}`)}
                >
                  <div className="session-card-content">
                    <div className="session-card-icon">
                      <MessageCircle size={19} />
                    </div>

                    <div className="session-card-main">
                      <div className="session-card-title-row">
                        <h3>{session.mode.replaceAll("_", " ")} session</h3>

                        <Badge
                          variant={
                            session.status === "ACTIVE" ? "success" : "neutral"
                          }
                        >
                          {session.status}
                        </Badge>
                      </div>

                      <p>Persona: {session.personaId}</p>

                      <div className="session-card-meta">
                        <span>
                          <CalendarDays size={12} />
                          {createdDate.toLocaleDateString("en-IN")}
                        </span>

                        <span>
                          <Clock3 size={12} />
                          {session.inputChannel}
                        </span>

                        <span>
                          <MessageCircle size={12} />
                          {session.outputChannel}
                        </span>
                      </div>
                    </div>

                    <div className="session-card-arrow">
                      <ArrowRight size={17} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default SessionsPage;
