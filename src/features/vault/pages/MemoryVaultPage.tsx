import {
  CalendarDays,
  FileText,
  Filter,
  Image as ImageIcon,
  Mic,
  Plus,
  Search,
  Upload,
  Video,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useMemory } from "../MemoryContext";

import type { MemoryType } from "../memory.types";

import "./MemoryVaultPage.css";

/* =========================================================
   TYPES
========================================================= */

type FilterType = "all" | MemoryType;

interface FilterOption {
  label: string;
  value: FilterType;
}

/* =========================================================
   FILTERS
========================================================= */

const FILTERS: FilterOption[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Photos",
    value: "photo",
  },
  {
    label: "Videos",
    value: "video",
  },
  {
    label: "Audio",
    value: "audio",
  },
  {
    label: "Documents",
    value: "document",
  },
];

/* =========================================================
   ICON
========================================================= */

function getMemoryIcon(type: MemoryType) {
  switch (type) {
    case "photo":
      return <ImageIcon size={22} />;

    case "video":
      return <Video size={22} />;

    case "audio":
      return <Mic size={22} />;

    case "document":
      return <FileText size={22} />;

    default:
      return <FileText size={22} />;
  }
}

/* =========================================================
   TYPE LABEL
========================================================= */

function getTypeLabel(type: MemoryType) {
  switch (type) {
    case "photo":
      return "Photo";

    case "video":
      return "Video";

    case "audio":
      return "Audio";

    case "document":
      return "Document";

    default:
      return "Memory";
  }
}

/* =========================================================
   DATE
========================================================= */

function formatMemoryDate(dateValue: string) {
  if (!dateValue) {
    return "No date";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/* =========================================================
   PAGE
========================================================= */

function MemoryVaultPage() {
  const navigate = useNavigate();

  const { memories, hydrated } = useMemory();

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<FilterType>("all");

  /* =======================================================
     FILTERED MEMORIES
  ======================================================= */

  const filteredMemories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return memories.filter((memory) => {
      const matchesFilter = filter === "all" || memory.type === filter;

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const title = memory.title?.toLowerCase() ?? "";

      const description = memory.description?.toLowerCase() ?? "";

      const category = memory.category?.toLowerCase() ?? "";

      const fileName = memory.fileName?.toLowerCase() ?? "";

      const people = memory.people ?? [];

      const peopleMatch = people.some((person) =>
        person.toLowerCase().includes(query),
      );

      return (
        title.includes(query) ||
        description.includes(query) ||
        category.includes(query) ||
        fileName.includes(query) ||
        peopleMatch
      );
    });
  }, [memories, search, filter]);

  /* =======================================================
     STATS
  ======================================================= */

  const totalPhotos = memories.filter(
    (memory) => memory.type === "photo",
  ).length;

  const totalVideos = memories.filter(
    (memory) => memory.type === "video",
  ).length;

  const totalAudio = memories.filter(
    (memory) => memory.type === "audio",
  ).length;

  const totalDocuments = memories.filter(
    (memory) => memory.type === "document",
  ).length;

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setFilter("all");
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!hydrated) {
    return (
      <main className="memory-vault-page">
        <section className="memory-vault-loading">
          <div className="memory-vault-spinner" />

          <h2>Loading your memories...</h2>

          <p>Preparing your private memory vault.</p>
        </section>
      </main>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="memory-vault-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="memory-vault-header">
        <div className="memory-vault-heading">
          <div className="memory-vault-heading-icon">
            <ImageIcon size={21} />
          </div>

          <div>
            <h1>Memory Vault</h1>

            <p>Preserve and revisit the moments that matter most.</p>
          </div>
        </div>

        <div className="memory-vault-actions">
          <button
            type="button"
            className="memory-vault-secondary-button"
            onClick={() => navigate("/app/vault/upload")}
          >
            <Upload size={15} />
            Upload memory
          </button>

          <button
            type="button"
            className="memory-vault-primary-button"
            onClick={() => navigate("/app/vault/upload")}
          >
            <Plus size={15} />
            Add memory
          </button>
        </div>
      </header>

      {/* =================================================
          STATS
      ================================================= */}

      <section className="memory-vault-stats">
        <div className="memory-vault-stat-card">
          <div className="memory-vault-stat-icon">
            <ImageIcon size={17} />
          </div>

          <div>
            <span>Total memories</span>

            <strong>{memories.length}</strong>
          </div>
        </div>

        <div className="memory-vault-stat-card">
          <div className="memory-vault-stat-icon">
            <ImageIcon size={17} />
          </div>

          <div>
            <span>Photos</span>

            <strong>{totalPhotos}</strong>
          </div>
        </div>

        <div className="memory-vault-stat-card">
          <div className="memory-vault-stat-icon">
            <Video size={17} />
          </div>

          <div>
            <span>Videos</span>

            <strong>{totalVideos}</strong>
          </div>
        </div>

        <div className="memory-vault-stat-card">
          <div className="memory-vault-stat-icon">
            <Mic size={17} />
          </div>

          <div>
            <span>Audio</span>

            <strong>{totalAudio}</strong>
          </div>
        </div>

        <div className="memory-vault-stat-card">
          <div className="memory-vault-stat-icon">
            <FileText size={17} />
          </div>

          <div>
            <span>Documents</span>

            <strong>{totalDocuments}</strong>
          </div>
        </div>
      </section>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <section className="memory-vault-toolbar">
        <div className="memory-vault-search">
          <Search size={16} />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search memories, people, categories..."
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="memory-vault-filter">
          <Filter size={14} />

          <div className="memory-vault-filter-buttons">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={filter === item.value ? "active" : ""}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          SECTION HEADER
      ================================================= */}

      <section className="memory-vault-section-header">
        <div>
          <h2>Your memories</h2>

          <p>
            {filteredMemories.length}{" "}
            {filteredMemories.length === 1 ? "memory" : "memories"}
          </p>
        </div>

        <span className="memory-vault-private">Private vault</span>
      </section>

      {/* =================================================
          EMPTY
      ================================================= */}

      {filteredMemories.length === 0 ? (
        <section className="memory-vault-empty">
          <div className="memory-vault-empty-icon">
            {memories.length === 0 ? (
              <ImageIcon size={24} />
            ) : (
              <Search size={24} />
            )}
          </div>

          <h3>
            {memories.length === 0
              ? "Your vault is empty"
              : "No memories found"}
          </h3>

          <p>
            {memories.length === 0
              ? "Start preserving your important moments by adding your first memory."
              : "Try another search or clear your selected filters."}
          </p>

          {memories.length === 0 ? (
            <button type="button" onClick={() => navigate("/app/vault/upload")}>
              <Plus size={15} />
              Add your first memory
            </button>
          ) : (
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </section>
      ) : (
        /* =================================================
           GRID
        ================================================= */

        <section className="memory-vault-grid">
          {filteredMemories.map((memory) => (
            <article
              key={memory.id}
              className="memory-vault-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/app/vault/${memory.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();

                  navigate(`/app/vault/${memory.id}`);
                }
              }}
            >
              {/* PREVIEW */}

              <div className="memory-vault-preview">
                {memory.thumbnail && memory.type === "photo" ? (
                  <img src={memory.thumbnail} alt={memory.title} />
                ) : (
                  <div className="memory-vault-preview-icon">
                    {getMemoryIcon(memory.type)}
                  </div>
                )}

                <span className="memory-vault-type-badge">
                  {getTypeLabel(memory.type)}
                </span>

                {memory.isTimeCapsule && (
                  <span className="memory-vault-capsule-badge">
                    Time Capsule
                  </span>
                )}
              </div>

              {/* CONTENT */}

              <div className="memory-vault-card-content">
                <div className="memory-vault-card-top">
                  <div>
                    <span className="memory-vault-category">
                      {memory.category}
                    </span>

                    <h3>{memory.title}</h3>
                  </div>
                </div>

                <p className="memory-vault-description">
                  {memory.description || "No description added."}
                </p>

                {/* PEOPLE */}

                {memory.people?.length > 0 && (
                  <div className="memory-vault-people">
                    {memory.people.slice(0, 3).map((person) => (
                      <span key={person}>{person}</span>
                    ))}

                    {memory.people.length > 3 && (
                      <span>+{memory.people.length - 3}</span>
                    )}
                  </div>
                )}

                {/* FOOTER */}

                <div className="memory-vault-card-footer">
                  <span>
                    <CalendarDays size={12} />

                    {formatMemoryDate(memory.date)}
                  </span>

                  <span>{memory.size || "—"}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MemoryVaultPage;
