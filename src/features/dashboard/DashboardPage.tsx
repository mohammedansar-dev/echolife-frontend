import {
  ArrowRight,
  CalendarDays,
  Camera,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Mic,
  Plus,
  Sparkles,
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
  const firstName = displayName.split(/\s+/)[0] || "User";

  /*
   * ============================================================
   * MEMORY STATISTICS
   * ============================================================
   */

  const totalMemories = memories.length;

  const photos = memories.filter((memory) => memory.type === "photo").length;

  const videos = memories.filter((memory) => memory.type === "video").length;

  const audio = memories.filter((memory) => memory.type === "audio").length;

  const documents = memories.filter(
    (memory) => memory.type === "document",
  ).length;

  /*
   * ============================================================
   * RECENT MEMORIES
   * ============================================================
   *
   * MemoryContext already provides the memory collection.
   * We do not create dashboard-only fake records here.
   */

  const recentMemories = memories.slice(0, 4);

  /*
   * ============================================================
   * STORAGE
   * ============================================================
   *
   * Only calculate storage from actual memory sizes.
   * No hardcoded 100 GB quota or fake percentage.
   */

  const totalBytes = memories.reduce((total, memory) => {
    return total + parseMemorySize(memory.size);
  }, 0);

  const storageUsedGB = totalBytes / (1024 * 1024 * 1024);

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  function parseMemorySize(size: string): number {
    if (!size) {
      return 0;
    }

    const value = Number.parseFloat(size);

    if (Number.isNaN(value)) {
      return 0;
    }

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
    if (totalBytes === 0) {
      return "0 GB";
    }

    if (storageUsedGB < 0.01) {
      return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
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
    if (!type) {
      return "Memory";
    }

    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  function formatDate(date: string) {
    if (!date) {
      return "No date";
    }

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

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="dashboard-page">
      {/* ========================================================
          PAGE HEADING
      ======================================================== */}

      <section className="dashboard-heading">
        <div className="dashboard-heading-content">
          <p className="dashboard-eyebrow">YOUR ECHOLIFE SPACE</p>

          <h1 className="dashboard-title">
            Good morning, {firstName}! <span aria-hidden="true">👋</span>
          </h1>

          <p className="dashboard-subtitle">
            Your memories, organized and enriched with AI.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-add-button"
          onClick={() => navigate("/app/vault/upload")}
        >
          <Plus size={17} strokeWidth={2.3} />
          <span>Add Memory</span>
        </button>
      </section>

      {/* ========================================================
          WELCOME HERO
      ======================================================== */}

      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-icon">
            <Sparkles size={21} strokeWidth={2} />
          </div>

          <h2 className="dashboard-hero-title">Welcome to your memory space</h2>

          <p className="dashboard-hero-text">
            Store, search, and revisit the moments that matter — all in one
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
          <div className="dashboard-hero-orbit dashboard-hero-orbit-one" />
          <div className="dashboard-hero-orbit dashboard-hero-orbit-two" />

          <div className="dashboard-hero-circle">
            <span className="dashboard-hero-circle-glow" />
          </div>

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
      </section>

      {/* ========================================================
          MEMORY STATISTICS
      ======================================================== */}

      <section className="dashboard-stats" aria-label="Memory statistics">
        <button
          type="button"
          className="stat-card"
          onClick={() => navigate("/app/vault")}
        >
          <span className="stat-icon stat-icon-purple">
            <FolderOpen size={18} />
          </span>

          <span className="stat-content">
            <strong className="stat-value">{totalMemories}</strong>
            <span className="stat-label">Total Memories</span>
          </span>
        </button>

        <button
          type="button"
          className="stat-card"
          onClick={() => navigate("/app/vault")}
        >
          <span className="stat-icon stat-icon-blue">
            <ImageIcon size={18} />
          </span>

          <span className="stat-content">
            <strong className="stat-value">{photos}</strong>
            <span className="stat-label">Photos</span>
          </span>
        </button>

        <button
          type="button"
          className="stat-card"
          onClick={() => navigate("/app/vault")}
        >
          <span className="stat-icon stat-icon-violet">
            <Video size={18} />
          </span>

          <span className="stat-content">
            <strong className="stat-value">{videos}</strong>
            <span className="stat-label">Videos</span>
          </span>
        </button>

        <button
          type="button"
          className="stat-card"
          onClick={() => navigate("/app/vault")}
        >
          <span className="stat-icon stat-icon-rose">
            <Mic size={18} />
          </span>

          <span className="stat-content">
            <strong className="stat-value">{audio}</strong>
            <span className="stat-label">Audio</span>
          </span>
        </button>

        <button
          type="button"
          className="stat-card"
          onClick={() => navigate("/app/vault")}
        >
          <span className="stat-icon stat-icon-amber">
            <FileText size={18} />
          </span>

          <span className="stat-content">
            <strong className="stat-value">{documents}</strong>
            <span className="stat-label">Documents</span>
          </span>
        </button>
      </section>

      {/* ========================================================
          MAIN DASHBOARD CONTENT
      ======================================================== */}

      <section className="dashboard-main-grid">
        {/* ======================================================
            RECENT MEMORIES
        ====================================================== */}

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
                <ImageIcon size={22} />
              </div>

              <h3 className="empty-memories-title">Your story starts here</h3>

              <p className="empty-memories-text">
                Upload your first photo, video, voice recording, or document and
                keep your memories safe.
              </p>

              <button
                type="button"
                className="empty-memories-button"
                onClick={() => navigate("/app/vault/upload")}
              >
                <Plus size={15} />
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
                  <span className="memory-preview">
                    {memory.thumbnail ? (
                      <img src={memory.thumbnail} alt={memory.title} />
                    ) : (
                      getMemoryIcon(memory.type)
                    )}
                  </span>

                  <span className="memory-information">
                    <span className="memory-title">{memory.title}</span>

                    <span className="memory-meta">
                      <CalendarDays size={11} />

                      <span>{formatDate(memory.date)}</span>

                      <span className="memory-type">
                        {getMemoryTypeLabel(memory.type)}
                      </span>
                    </span>
                  </span>

                  <ArrowRight size={16} className="memory-row-arrow" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ======================================================
            STORAGE USAGE
        ====================================================== */}

        <section className="dashboard-panel storage-panel">
          <div className="dashboard-panel-header">
            <div className="dashboard-panel-heading">
              <h2 className="dashboard-panel-title">Storage Usage</h2>

              <p className="dashboard-panel-description">
                Space currently used by your memories
              </p>
            </div>

            <FolderOpen size={17} className="panel-header-icon" />
          </div>

          <div className="storage-content">
            <div className="storage-overview">
              <div className="storage-visual">
                <div className="storage-visual-inner">
                  <FolderOpen size={22} />
                </div>
              </div>

              <div className="storage-summary">
                <p className="storage-used">{formatStorage()}</p>

                <p className="storage-total">Actual uploaded storage</p>
              </div>
            </div>

            <div className="storage-progress">
              <div
                className={`storage-progress-value ${
                  totalBytes > 0 ? "has-storage" : ""
                }`}
              />
            </div>

            <div className="storage-breakdown">
              <div className="storage-breakdown-row">
                <span className="storage-breakdown-label">
                  <span className="storage-dot storage-dot-blue" />
                  Photos
                </span>

                <strong>{photos}</strong>
              </div>

              <div className="storage-breakdown-row">
                <span className="storage-breakdown-label">
                  <span className="storage-dot storage-dot-purple" />
                  Videos
                </span>

                <strong>{videos}</strong>
              </div>

              <div className="storage-breakdown-row">
                <span className="storage-breakdown-label">
                  <span className="storage-dot storage-dot-green" />
                  Audio
                </span>

                <strong>{audio}</strong>
              </div>

              <div className="storage-breakdown-row">
                <span className="storage-breakdown-label">
                  <span className="storage-dot storage-dot-orange" />
                  Documents
                </span>

                <strong>{documents}</strong>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* ========================================================
          RECENT ACTIVITY
          No fake activity is generated here.
      ======================================================== */}

      <section className="dashboard-panel activity-panel">
        <div className="dashboard-panel-header">
          <div className="dashboard-panel-heading">
            <h2 className="dashboard-panel-title">Recent Activity</h2>

            <p className="dashboard-panel-description">
              Your latest EchoLife activity
            </p>
          </div>
        </div>

        <div className="activity-empty">
          <div className="activity-empty-icon">
            <Sparkles size={20} />
          </div>

          <h3>Your activity will appear here</h3>

          <p>
            Uploads, AI sessions, and other account activity will be displayed
            here once activity data is available.
          </p>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
