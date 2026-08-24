import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MessageCircle,
  Plus,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import "./SessionsPage.css";

interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  messages: number;
  status: "completed" | "active";
}

const sessions: Session[] = [
  {
    id: "session-1",
    title: "Family memories conversation",
    description: "A conversation about meaningful family memories and stories.",
    date: "Aug 22, 2026",
    duration: "18 min",
    messages: 24,
    status: "completed",
  },
  {
    id: "session-2",
    title: "Childhood memories",
    description: "Exploring stories and moments from childhood.",
    date: "Aug 19, 2026",
    duration: "12 min",
    messages: 17,
    status: "completed",
  },
  {
    id: "session-3",
    title: "Family traditions",
    description: "A conversation about traditions and important family values.",
    date: "Aug 15, 2026",
    duration: "21 min",
    messages: 31,
    status: "completed",
  },
];

function SessionsPage() {
  const navigate = useNavigate();

  return (
    <main className="sessions-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

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

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="sessions-summary">
        <div className="sessions-summary-card">
          <div className="sessions-summary-icon">
            <MessageCircle size={17} />
          </div>

          <div>
            <span>Total sessions</span>

            <strong>12</strong>
          </div>
        </div>

        <div className="sessions-summary-card">
          <div className="sessions-summary-icon">
            <Clock3 size={17} />
          </div>

          <div>
            <span>Conversation time</span>

            <strong>3h 42m</strong>
          </div>
        </div>

        <div className="sessions-summary-card">
          <div className="sessions-summary-icon">
            <Sparkles size={17} />
          </div>

          <div>
            <span>Persona sessions</span>

            <strong>8</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          SESSION LIST
      ===================================================== */}

      <section className="sessions-section">
        <div className="sessions-section-heading">
          <div>
            <h2>Recent sessions</h2>

            <p>Your latest family conversations.</p>
          </div>
        </div>

        <div className="sessions-list">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="session-card"
              onClick={() => navigate(`/app/sessions/${session.id}`)}
            >
              <div className="session-card-content">
                <div className="session-card-icon">
                  <MessageCircle size={19} />
                </div>

                <div className="session-card-main">
                  <div className="session-card-title-row">
                    <h3>{session.title}</h3>

                    <Badge
                      variant={
                        session.status === "active" ? "success" : "neutral"
                      }
                    >
                      {session.status === "active" ? "Active" : "Completed"}
                    </Badge>
                  </div>

                  <p>{session.description}</p>

                  <div className="session-card-meta">
                    <span>
                      <CalendarDays size={12} />
                      {session.date}
                    </span>

                    <span>
                      <Clock3 size={12} />
                      {session.duration}
                    </span>

                    <span>
                      <MessageCircle size={12} />
                      {session.messages} messages
                    </span>
                  </div>
                </div>

                <div className="session-card-arrow">
                  <ArrowRight size={17} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

export default SessionsPage;
