import {
  Activity,
  ArrowRight,
  Clock3,
  FileText,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";

import { useMemo, useState } from "react";

import "./ActivityPage.css";

type ActivityType =
  | "memory"
  | "conversation"
  | "persona"
  | "family"
  | "security";

interface ActivityItem {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  date: string;
}

const activities: ActivityItem[] = [
  {
    id: 1,
    type: "memory",
    title: "Memory added",
    description: "A new family memory was added to Memory Vault.",
    time: "Today, 6:42 PM",
    date: "Today",
  },
  {
    id: 2,
    type: "conversation",
    title: "Family conversation started",
    description: "A conversation was started from a preserved family memory.",
    time: "Today, 5:18 PM",
    date: "Today",
  },
  {
    id: 3,
    type: "persona",
    title: "AI Persona configured",
    description: "Your Family Memory Persona settings were updated.",
    time: "Today, 3:25 PM",
    date: "Today",
  },
  {
    id: 4,
    type: "family",
    title: "Family member added",
    description: "A new member was invited to your family space.",
    time: "Yesterday, 8:10 PM",
    date: "Yesterday",
  },
  {
    id: 5,
    type: "memory",
    title: "Memory updated",
    description: "A preserved family story was edited.",
    time: "Yesterday, 4:31 PM",
    date: "Yesterday",
  },
  {
    id: 6,
    type: "security",
    title: "Security settings reviewed",
    description: "Your account security settings were accessed.",
    time: "Aug 20, 2026",
    date: "Earlier",
  },
];

function ActivityPage() {
  const [filter, setFilter] = useState<"all" | ActivityType>("all");

  const filteredActivities = useMemo(() => {
    if (filter === "all") {
      return activities;
    }

    return activities.filter((item) => item.type === filter);
  }, [filter]);

  const getIcon = (type: ActivityType) => {
    switch (type) {
      case "memory":
        return <FileText size={15} />;

      case "conversation":
        return <MessageCircle size={15} />;

      case "persona":
        return <Sparkles size={15} />;

      case "family":
        return <UserPlus size={15} />;

      case "security":
        return <ShieldCheck size={15} />;

      default:
        return <Activity size={15} />;
    }
  };

  return (
    <main className="activity-page">
      {/* HEADER */}

      <header className="activity-header">
        <div>
          <span className="activity-eyebrow">
            <Activity size={11} />
            ACTIVITY
          </span>

          <h1>Family space activity</h1>

          <p>
            Keep track of important activity across your EchoLife family space.
          </p>
        </div>
      </header>

      {/* SUMMARY */}

      <section className="activity-summary">
        <div className="activity-summary-icon">
          <Heart size={17} />
        </div>

        <div>
          <span>RECENT ACTIVITY</span>

          <strong>Your family story is growing.</strong>

          <p>
            {activities.length} recent activities have been recorded in your
            family space.
          </p>
        </div>
      </section>

      {/* FILTER */}

      <section className="activity-toolbar">
        <div>
          <strong>Activity history</strong>

          <span>Review recent actions and updates.</span>
        </div>

        <div className="activity-filters">
          <button
            type="button"
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            type="button"
            className={filter === "memory" ? "active" : ""}
            onClick={() => setFilter("memory")}
          >
            Memories
          </button>

          <button
            type="button"
            className={filter === "conversation" ? "active" : ""}
            onClick={() => setFilter("conversation")}
          >
            Conversations
          </button>

          <button
            type="button"
            className={filter === "family" ? "active" : ""}
            onClick={() => setFilter("family")}
          >
            Family
          </button>

          <button
            type="button"
            className={filter === "security" ? "active" : ""}
            onClick={() => setFilter("security")}
          >
            Security
          </button>
        </div>
      </section>

      {/* ACTIVITY LIST */}

      <section className="activity-card">
        {filteredActivities.length === 0 ? (
          <div className="activity-empty">
            <Activity size={20} />

            <strong>No activity found</strong>

            <p>There is no activity matching the selected filter.</p>
          </div>
        ) : (
          <div className="activity-list">
            {filteredActivities.map((item, index) => (
              <article key={item.id} className="activity-item">
                <div className="activity-timeline">
                  <div className={`activity-icon ${item.type}`}>
                    {getIcon(item.type)}
                  </div>

                  {index !== filteredActivities.length - 1 && (
                    <span className="activity-line" />
                  )}
                </div>

                <div className="activity-content">
                  <div className="activity-title-row">
                    <div>
                      <h2>{item.title}</h2>

                      <p>{item.description}</p>
                    </div>

                    <span className="activity-time">
                      <Clock3 size={10} />
                      {item.time}
                    </span>
                  </div>

                  <button type="button" className="activity-details">
                    View details
                    <ArrowRight size={11} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* PRIVACY */}

      <section className="activity-privacy">
        <ShieldCheck size={15} />

        <div>
          <strong>Your activity is private.</strong>

          <p>
            Activity information is available only within your EchoLife family
            space.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ActivityPage;
