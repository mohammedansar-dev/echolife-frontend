import { useCallback, useMemo, useState } from "react";
import {
  Archive,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileAudio,
  FileText,
  FileVideo,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useMemory } from "../MemoryContext";
import type { Memory, MemoryCategory, MemoryType } from "../memory.types";
import "./MemoryVaultPage.css";

/* =========================================================
   CONSTANTS
========================================================= */

const ALL_CATEGORY = "All";

const MEMORY_TYPES: Array<{
  value: "all" | MemoryType;
  label: string;
}> = [
  { value: "all", label: "All memories" },
  { value: "photo", label: "Photos" },
  { value: "video", label: "Videos" },
  { value: "audio", label: "Audio" },
  { value: "document", label: "Documents" },
];

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value?: string): string {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getMemoryTypeLabel(type: MemoryType): string {
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

function getMemoryIcon(type: MemoryType) {
  switch (type) {
    case "photo":
      return ImageIcon;

    case "video":
      return FileVideo;

    case "audio":
      return FileAudio;

    case "document":
    default:
      return FileText;
  }
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

/* =========================================================
   MEMORY CARD
========================================================= */

interface MemoryCardProps {
  memory: Memory;
  onOpen: (memory: Memory) => void;
}

function MemoryCard({ memory, onOpen }: MemoryCardProps) {
  const Icon = getMemoryIcon(memory.type);

  const hasImage = Boolean(memory.thumbnail);

  return (
    <article
      className="memory-vault-card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(memory)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(memory);
        }
      }}
    >
      <div className="memory-vault-card-media">
        {hasImage ? (
          <img
            src={memory.thumbnail}
            alt={memory.title}
            className="memory-vault-card-image"
          />
        ) : (
          <div className="memory-vault-card-placeholder">
            <Icon size={30} strokeWidth={1.7} />

            <span>{getMemoryTypeLabel(memory.type)}</span>
          </div>
        )}

        {memory.isTimeCapsule && (
          <span className="memory-vault-capsule-badge">
            <Clock3 size={13} />
            Time capsule
          </span>
        )}
      </div>

      <div className="memory-vault-card-body">
        <div className="memory-vault-card-title-row">
          <h3 className="memory-vault-card-title" title={memory.title}>
            {memory.title || "Untitled memory"}
          </h3>
        </div>

        <p className="memory-vault-card-description">
          {memory.description || "No description added."}
        </p>

        <div className="memory-vault-card-meta">
          <span>
            <CalendarDays size={14} />
            {formatDate(memory.date || memory.memoryDate)}
          </span>

          {memory.category && (
            <span className="memory-vault-category">{memory.category}</span>
          )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

interface EmptyStateProps {
  searching: boolean;
  onClear: () => void;
  onUpload: () => void;
}

function EmptyState({ searching, onClear, onUpload }: EmptyStateProps) {
  return (
    <section className="memory-vault-empty">
      <div className="memory-vault-empty-icon">
        {searching ? <Search size={30} /> : <Archive size={30} />}
      </div>

      <h2>{searching ? "No memories found" : "Your memory vault is empty"}</h2>

      <p>
        {searching
          ? "Try a different search term or adjust your filters."
          : "Start preserving your important moments in EchoLife."}
      </p>

      <div className="memory-vault-empty-actions">
        {searching && (
          <button
            type="button"
            className="memory-vault-secondary-button"
            onClick={onClear}
          >
            Clear filters
          </button>
        )}

        {!searching && (
          <button
            type="button"
            className="memory-vault-primary-button"
            onClick={onUpload}
          >
            <Plus size={18} />
            Add your first memory
          </button>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function MemoryVaultPage() {
  const navigate = useNavigate();

  const { memories, loading, error, initialized, refreshMemories, clearError } =
    useMemory();

  const [search, setSearch] = useState("");

  const [selectedType, setSelectedType] = useState<"all" | MemoryType>("all");

  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORY);

  const [showFilters, setShowFilters] = useState(false);

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "title">(
    "newest",
  );

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const values = memories
      .map((memory) => memory.category)
      .filter((value): value is MemoryCategory => Boolean(value));

    return [
      ALL_CATEGORY,
      ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b)),
    ];
  }, [memories]);

  /* =======================================================
     FILTERED MEMORIES
  ======================================================= */

  const filteredMemories = useMemo(() => {
    const query = normalizeSearchValue(search);

    const filtered = memories.filter((memory) => {
      const matchesSearch =
        !query ||
        normalizeSearchValue(memory.title).includes(query) ||
        normalizeSearchValue(memory.description).includes(query) ||
        normalizeSearchValue(memory.category).includes(query) ||
        memory.people.some((person) =>
          normalizeSearchValue(person).includes(query),
        );

      const matchesType =
        selectedType === "all" || memory.type === selectedType;

      const matchesCategory =
        selectedCategory === ALL_CATEGORY ||
        memory.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "title") {
        return a.title.localeCompare(b.title);
      }

      const first = new Date(a.date || a.memoryDate || 0).getTime();

      const second = new Date(b.date || b.memoryDate || 0).getTime();

      return sortOrder === "newest" ? second - first : first - second;
    });
  }, [memories, search, selectedType, selectedCategory, sortOrder]);

  /* =======================================================
     ACTIVE FILTERS
  ======================================================= */

  const hasActiveFilters =
    Boolean(search.trim()) ||
    selectedType !== "all" ||
    selectedCategory !== ALL_CATEGORY;

  /* =======================================================
     OPEN MEMORY
  ======================================================= */

  const handleOpenMemory = useCallback(
    (memory: Memory) => {
      navigate(`/vault/memory/${memory.id}`);
    },
    [navigate],
  );

  /* =======================================================
     UPLOAD
  ======================================================= */

  const handleUpload = useCallback(() => {
    navigate("/vault/upload");
  }, [navigate]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedType("all");
    setSelectedCategory(ALL_CATEGORY);
    setSortOrder("newest");
  }, []);

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = useCallback(async () => {
    await refreshMemories();
  }, [refreshMemories]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (!initialized && loading) {
    return (
      <main className="memory-vault-page">
        <div className="memory-vault-loading">
          <div className="memory-vault-loading-spinner">
            <Loader2 size={28} className="memory-vault-spin" />
          </div>

          <h2>Loading your memories</h2>

          <p>Connecting to your EchoLife memory vault...</p>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="memory-vault-page">
      <div className="memory-vault-container">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="memory-vault-header">
          <div className="memory-vault-header-content">
            <div className="memory-vault-eyebrow">
              <Sparkles size={15} />
              EchoLife
            </div>

            <h1>Memory Vault</h1>

            <p>
              Preserve the moments, stories and experiences that matter to you.
            </p>
          </div>

          <button
            type="button"
            className="memory-vault-primary-button"
            onClick={handleUpload}
          >
            <Plus size={18} />
            Add Memory
          </button>
        </header>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="memory-vault-error">
            <div>
              <strong>Unable to load memories</strong>

              <span>{error}</span>
            </div>

            <div className="memory-vault-error-actions">
              <button
                type="button"
                onClick={() => {
                  clearError();
                  void handleRefresh();
                }}
              >
                Try again
              </button>

              <button
                type="button"
                aria-label="Close error"
                onClick={clearError}
              >
                <X size={17} />
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <section className="memory-vault-toolbar">
          <div className="memory-vault-search">
            <Search size={19} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your memories..."
              aria-label="Search memories"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="memory-vault-toolbar-actions">
            <button
              type="button"
              className={
                showFilters
                  ? "memory-vault-tool-button active"
                  : "memory-vault-tool-button"
              }
              onClick={() => setShowFilters((current) => !current)}
            >
              <SlidersHorizontal size={17} />
              Filters
              {hasActiveFilters && <span className="memory-vault-filter-dot" />}
            </button>

            <button
              type="button"
              className="memory-vault-tool-button"
              onClick={() => void handleRefresh()}
              disabled={loading}
              aria-label="Refresh memories"
            >
              <RefreshCw
                size={17}
                className={loading ? "memory-vault-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </section>

        {/* =================================================
            FILTER PANEL
        ================================================= */}

        {showFilters && (
          <section className="memory-vault-filter-panel">
            <div className="memory-vault-filter-group">
              <label htmlFor="memory-type">Type</label>

              <div className="memory-vault-select-wrapper">
                <select
                  id="memory-type"
                  value={selectedType}
                  onChange={(event) =>
                    setSelectedType(event.target.value as "all" | MemoryType)
                  }
                >
                  {MEMORY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <ChevronDown size={16} />
              </div>
            </div>

            <div className="memory-vault-filter-group">
              <label htmlFor="memory-category">Category</label>

              <div className="memory-vault-select-wrapper">
                <select
                  id="memory-category"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <ChevronDown size={16} />
              </div>
            </div>

            <div className="memory-vault-filter-group">
              <label htmlFor="memory-sort">Sort by</label>

              <div className="memory-vault-select-wrapper">
                <select
                  id="memory-sort"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      event.target.value as "newest" | "oldest" | "title",
                    )
                  }
                >
                  <option value="newest">Newest first</option>

                  <option value="oldest">Oldest first</option>

                  <option value="title">Title</option>
                </select>

                <ChevronDown size={16} />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="memory-vault-clear-button"
                onClick={clearFilters}
              >
                Clear all
              </button>
            )}
          </section>
        )}

        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="memory-vault-summary">
          <div>
            <strong>{filteredMemories.length}</strong>

            <span>
              {filteredMemories.length === 1 ? " memory" : " memories"}
            </span>

            {hasActiveFilters && (
              <span className="memory-vault-summary-muted">
                {" "}
                matching your filters
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        {loading && initialized ? (
          <div className="memory-vault-inline-loading">
            <Loader2 size={22} className="memory-vault-spin" />
            <span>Updating your memories...</span>
          </div>
        ) : filteredMemories.length === 0 ? (
          <EmptyState
            searching={hasActiveFilters}
            onClear={clearFilters}
            onUpload={handleUpload}
          />
        ) : (
          <section className="memory-vault-grid" aria-label="Memory collection">
            {filteredMemories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onOpen={handleOpenMemory}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
