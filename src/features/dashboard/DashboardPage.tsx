import {
  Activity,
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Mic,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useMemory } from "../vault/MemoryContext";

import "./DashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { memories } = useMemory();

  const displayName = user?.displayName?.trim() || "User";

  const firstName = displayName.split(" ")[0];

  /* ============================================================
     MEMORY STATISTICS
  ============================================================ */

  const totalMemories = memories.length;

  const photos = memories.filter((memory) => memory.type === "photo").length;

  const videos = memories.filter((memory) => memory.type === "video").length;

  const audio = memories.filter((memory) => memory.type === "audio").length;

  const documents = memories.filter(
    (memory) => memory.type === "document",
  ).length;

  /* ============================================================
     RECENT MEMORIES
  ============================================================ */

  const recentMemories = memories.slice(0, 4);

  /* ============================================================
     STORAGE
  ============================================================ */

  const totalBytes = memories.reduce((total, memory) => {
    return total + parseMemorySize(memory.size);
  }, 0);

  const storageUsedGB = totalBytes / (1024 * 1024 * 1024);

  const storageLimitGB = 100;

  const storagePercentage = Math.min(
    100,
    (storageUsedGB / storageLimitGB) * 100,
  );

  /* ============================================================
     HELPERS
  ============================================================ */

  function parseMemorySize(size: string): number {
    if (!size) return 0;

    const value = Number.parseFloat(size);

    if (Number.isNaN(value)) return 0;

    const normalized = size.toLowerCase();

    if (normalized.includes("tb")) {
      return value * 1024 * 1024 * 1024 * 1024;
    }

    if (normalized.includes("gb")) {
      return value * 1024 * 1024 * 1024;
    }

    if (normalized.includes("mb")) {
      return value * 1024 * 1024;
    }

    if (normalized.includes("kb")) {
      return value * 1024;
    }

    return value;
  }

  function formatStorage(): string {
    if (storageUsedGB < 0.01) {
      return "0 GB";
    }

    return `${storageUsedGB.toFixed(2)} GB`;
  }

  function getMemoryIcon(type: string) {
    switch (type) {
      case "photo":
        return <ImageIcon size={19} />;

      case "video":
        return <Video size={19} />;

      case "audio":
        return <Mic size={19} />;

      case "document":
        return <FileText size={19} />;

      default:
        return <FolderOpen size={19} />;
    }
  }

  function getMemoryTypeLabel(type: string) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  function formatDate(date: string) {
    if (!date) return "No date";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  /* ============================================================
     QUICK ACTIONS
  ============================================================ */

  const quickActions = [
    {
      title: "Add Memory",
      description: "Save a special moment",
      icon: <Plus size={18} />,
      onClick: () => navigate("/app/vault/upload"),
    },
    {
      title: "Upload Files",
      description: "Photos, videos & more",
      icon: <Upload size={18} />,
      onClick: () => navigate("/app/vault/upload"),
    },
    {
      title: "Memory Vault",
      description: "View and organize your memories",
      icon: <FolderOpen size={18} />,
      onClick: () => navigate("/app/vault"),
    },
    {
      title: "AI Session",
      description: "Reflect with EchoLife AI",
      icon: <Sparkles size={18} />,
      onClick: () => navigate("/app/ai-sessions"),
    },
  ];

  return (
    <div className="dashboard-page">
      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <section className="dashboard-heading">
        <div className="dashboard-heading-content">
          <p className="dashboard-eyebrow">YOUR ECHOLIFE SPACE</p>

          <h1 className="dashboard-title">
            Good morning, {firstName}! <span>👋</span>
          </h1>

          <p className="dashboard-subtitle">
            Your memories, organized and cherished with AI.
          </p>
        </div>
      </section>

      {/* ========================================================
          HERO + QUICK ACTIONS
      ======================================================== */}

      <section className="dashboard-top-grid">
        {/* Hero */}

        <div className="dashboard-hero">
          <div className="dashboard-hero-content">
            <div className="dashboard-hero-icon">
              <Sparkles size={21} />
            </div>

            <h2 className="dashboard-hero-title">
              Welcome to your memory space
            </h2>

            <p className="dashboard-hero-text">
              Store, search, and relive your precious moments — all in one
              private place.
            </p>

            <button
              type="button"
              className="dashboard-hero-button"
              onClick={() => navigate("/app/vault/upload")}
            >
              <Plus size={16} />
              Add Memory
            </button>
          </div>

          <div className="dashboard-hero-art" aria-hidden="true">
            <div className="dashboard-hero-circle" />

            <div className="dashboard-art-card dashboard-art-card-one">
              <ImageIcon size={20} />
            </div>

            <div className="dashboard-art-card dashboard-art-card-two">
              <Camera size={18} />
            </div>

            <div className="dashboard-art-card dashboard-art-card-three">
              <Video size={18} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}

        <div className="quick-actions-panel">
          <div className="quick-actions-header">
            <div>
              <h2>Quick Actions</h2>

              <p>Jump into your EchoLife space</p>
            </div>
          </div>

          <div className="quick-actions">
            {quickActions.map((action) => (
              <button
                type="button"
                key={action.title}
                className="quick-action"
                onClick={action.onClick}
              >
                <span className="quick-action-icon">{action.icon}</span>

                <span className="quick-action-text">
                  <span className="quick-action-title">{action.title}</span>

                  <span className="quick-action-description">
                    {action.description}
                  </span>
                </span>

                <ArrowRight size={14} className="quick-action-arrow" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          STATISTICS
      ======================================================== */}

      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FolderOpen size={18} />
          </div>

          <div className="stat-content">
            <p className="stat-value">{totalMemories}</p>
            <p className="stat-label">Total Memories</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <ImageIcon size={18} />
          </div>

          <div className="stat-content">
            <p className="stat-value">{photos}</p>
            <p className="stat-label">Photos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Video size={18} />
          </div>

          <div className="stat-content">
            <p className="stat-value">{videos}</p>
            <p className="stat-label">Videos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Mic size={18} />
          </div>

          <div className="stat-content">
            <p className="stat-value">{audio}</p>
            <p className="stat-label">Audio</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={18} />
          </div>

          <div className="stat-content">
            <p className="stat-value">{documents}</p>
            <p className="stat-label">Documents</p>
          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <section className="dashboard-main-grid">
        {/* ======================================================
            LEFT COLUMN
        ====================================================== */}

        <div className="dashboard-left-column">
          {/* Recent Memories */}

          <section className="dashboard-panel memories-panel">
            <div className="dashboard-panel-header">
              <div className="dashboard-panel-heading">
                <h2 className="dashboard-panel-title">Recent Memories</h2>

                <p className="dashboard-panel-description">
                  Your latest saved moments
                </p>
              </div>

              {memories.length > 0 && (
                <button
                  type="button"
                  className="dashboard-panel-link"
                  onClick={() => navigate("/app/vault")}
                >
                  View all
                </button>
              )}
            </div>

            {recentMemories.length === 0 ? (
              <div className="empty-memories">
                <div className="empty-memory-icon">
                  <ImageIcon size={21} />
                </div>

                <h3 className="empty-memories-title">No memories yet</h3>

                <p className="empty-memories-text">
                  Add your first photo, video, audio, or document to start
                  preserving your memories.
                </p>

                <button
                  type="button"
                  className="empty-memories-button"
                  onClick={() => navigate("/app/vault/upload")}
                >
                  <Plus size={14} />
                  Add Memory
                </button>
              </div>
            ) : (
              <div className="recent-memory-list">
                {recentMemories.map((memory) => (
                  <button
                    type="button"
                    key={memory.id}
                    className="recent-memory-row"
                    onClick={() => navigate(`/app/vault/${memory.id}`)}
                  >
                    <div className="memory-preview">
                      {memory.thumbnail ? (
                        <img src={memory.thumbnail} alt={memory.title} />
                      ) : (
                        getMemoryIcon(memory.type)
                      )}
                    </div>

                    <div className="memory-information">
                      <p className="memory-title">{memory.title}</p>

                      <div className="memory-meta">
                        <CalendarDays size={11} />

                        <span>{formatDate(memory.date)}</span>

                        <span className="memory-type">
                          {getMemoryTypeLabel(memory.type)}
                        </span>
                      </div>
                    </div>

                    <ArrowRight size={15} className="memory-row-arrow" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ====================================================
              RECENT ACTIVITY
          ==================================================== */}

          <section className="dashboard-panel activity-panel">
            <div className="dashboard-panel-header">
              <div className="dashboard-panel-heading">
                <h2 className="dashboard-panel-title">Recent Activity</h2>

                <p className="dashboard-panel-description">
                  Your latest EchoLife activity
                </p>
              </div>

              <Activity size={17} className="activity-header-icon" />
            </div>

            {memories.length === 0 ? (
              <div className="activity-empty">
                <div className="activity-empty-icon">
                  <Clock3 size={20} />
                </div>

                <p>No activity yet</p>

                <span>Your recent actions will appear here.</span>
              </div>
            ) : (
              <div className="activity-timeline">
                {recentMemories.slice(0, 4).map((memory, index) => (
                  <div className="activity-item" key={`activity-${memory.id}`}>
                    <div className="activity-line">
                      <div className="activity-icon">
                        {index === 0 ? (
                          <Plus size={15} />
                        ) : (
                          getMemoryIcon(memory.type)
                        )}
                      </div>
                    </div>

                    <div className="activity-content">
                      <strong>
                        {index === 0
                          ? `Added "${memory.title}"`
                          : `Memory "${memory.title}" is in your vault`}
                      </strong>

                      <span>{formatDate(memory.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ====================================================
              SECURITY
          ==================================================== */}

          <section className="security-card">
            <div className="security-icon">
              <ShieldCheck size={18} />
            </div>

            <div className="security-content">
              <h3 className="security-title">Your memories are private</h3>

              <p className="security-text">
                EchoLife keeps your personal memories protected and accessible
                only to your account.
              </p>
            </div>

            <CheckCircle2 size={17} className="security-check" />
          </section>
        </div>

        {/* ======================================================
            RIGHT COLUMN
        ====================================================== */}

        <aside className="dashboard-right-column">
          {/* ====================================================
              STORAGE
          ==================================================== */}

          <section className="dashboard-panel storage-panel">
            <div className="dashboard-panel-header">
              <div className="dashboard-panel-heading">
                <h2 className="dashboard-panel-title">Storage Usage</h2>

                <p className="dashboard-panel-description">
                  Your memory storage
                </p>
              </div>

              <FolderOpen size={17} className="panel-header-icon" />
            </div>

            <div className="storage-content">
              <div className="storage-overview">
                <div
                  className="storage-ring"
                  style={{
                    background: `conic-gradient(
                      #6251d0 ${storagePercentage * 3.6}deg,
                      #ececf5 ${storagePercentage * 3.6}deg
                    )`,
                  }}
                >
                  <span className="storage-ring-value">
                    {Math.round(storagePercentage)}%
                  </span>
                </div>

                <div className="storage-summary">
                  <p className="storage-used">{formatStorage()}</p>

                  <p className="storage-total">
                    of {storageLimitGB} GB available
                  </p>
                </div>
              </div>

              <div className="storage-progress">
                <div
                  className="storage-progress-value"
                  style={{
                    width: `${storagePercentage}%`,
                  }}
                />
              </div>

              <div className="storage-breakdown">
                <div className="storage-breakdown-row">
                  <span className="storage-breakdown-label">
                    <span className="storage-dot" />
                    Photos
                  </span>

                  <strong>{photos}</strong>
                </div>

                <div className="storage-breakdown-row">
                  <span className="storage-breakdown-label">
                    <span className="storage-dot" />
                    Videos
                  </span>

                  <strong>{videos}</strong>
                </div>

                <div className="storage-breakdown-row">
                  <span className="storage-breakdown-label">
                    <span className="storage-dot" />
                    Audio
                  </span>

                  <strong>{audio}</strong>
                </div>

                <div className="storage-breakdown-row">
                  <span className="storage-breakdown-label">
                    <span className="storage-dot" />
                    Documents
                  </span>

                  <strong>{documents}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* ====================================================
              REMINDERS
          ==================================================== */}

          <section className="dashboard-panel reminders-panel">
            <div className="dashboard-panel-header">
              <div className="dashboard-panel-heading">
                <h2 className="dashboard-panel-title">Reminders</h2>

                <p className="dashboard-panel-description">Important moments</p>
              </div>

              <Clock3 size={17} className="panel-header-icon" />
            </div>

            <div className="reminders-content">
              <div className="empty-reminders">
                <div className="empty-reminders-icon">
                  <CalendarDays size={19} />
                </div>

                <h3 className="empty-reminders-title">No reminders yet</h3>

                <p className="empty-reminders-text">
                  Set reminders for special memories.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

export default DashboardPage;
