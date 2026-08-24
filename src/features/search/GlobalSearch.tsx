import { CalendarDays, FileHeart, Search, X } from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import { useMemory } from "../vault/MemoryContext";

import "./GlobalSearch.css";

interface GlobalSearchProps {
  onClose?: () => void;
}

function GlobalSearch({ onClose }: GlobalSearchProps) {
  const { memories } = useMemory();

  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  /*
   * Focus search immediately.
   */

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /*
   * Load recent searches.
   */

  useEffect(() => {
    const saved = localStorage.getItem("echolife_recent_searches");

    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  /*
   * Search memories.
   */

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return [];
    }

    return memories.filter((memory: any) => {
      const title = String(memory.title || "").toLowerCase();

      const description = String(memory.description || "").toLowerCase();

      const category = String(memory.category || "").toLowerCase();

      const people = String(memory.people || "").toLowerCase();

      return (
        title.includes(search) ||
        description.includes(search) ||
        category.includes(search) ||
        people.includes(search)
      );
    });
  }, [memories, query]);

  /*
   * Save search.
   */

  const saveSearch = (value: string) => {
    const cleaned = value.trim();

    if (!cleaned) {
      return;
    }

    const updated = [
      cleaned,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== cleaned.toLowerCase(),
      ),
    ].slice(0, 5);

    setRecentSearches(updated);

    localStorage.setItem("echolife_recent_searches", JSON.stringify(updated));
  };

  /*
   * Open memory.
   */

  const openMemory = (id: string) => {
    saveSearch(query);

    window.location.href = `/app/memory/${id}`;
  };

  /*
   * Keyboard controls.
   */

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      onClose?.();
      return;
    }

    if (event.key === "Enter" && results.length > 0) {
      openMemory(String(results[0].id));
    }
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="global-search">
      {/* SEARCH INPUT */}

      <div className="global-search-input-wrapper">
        <Search size={18} className="global-search-input-icon" />

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search your memories..."
          className="global-search-input"
        />

        {query && (
          <button
            type="button"
            className="global-search-clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}

        <kbd>ESC</kbd>
      </div>

      {/* SEARCH BODY */}

      <div className="global-search-body">
        {!query.trim() ? (
          <div className="global-search-empty">
            <div className="global-search-empty-icon">
              <Search size={22} />
            </div>

            <h3>Search your memories</h3>

            <p>Find memories by title, description, category, or people.</p>

            {recentSearches.length > 0 && (
              <div className="global-search-recent">
                <span>Recent searches</span>

                <div>
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      type="button"
                      onClick={() => setQuery(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : results.length > 0 ? (
          <div className="global-search-results">
            <div className="global-search-results-header">
              <span>
                {results.length} {results.length === 1 ? "memory" : "memories"}{" "}
                found
              </span>

              <small>Press Enter to open the first</small>
            </div>

            {results.map((memory: any) => (
              <button
                key={memory.id}
                type="button"
                className="global-search-result"
                onClick={() => openMemory(String(memory.id))}
              >
                <div className="global-search-result-icon">
                  <FileHeart size={18} />
                </div>

                <div className="global-search-result-content">
                  <strong>{memory.title || "Untitled memory"}</strong>

                  {memory.description && <p>{memory.description}</p>}

                  <div className="global-search-result-meta">
                    {memory.category && <span>{memory.category}</span>}

                    {memory.memoryDate && (
                      <span>
                        <CalendarDays size={11} />
                        {String(memory.memoryDate)}
                      </span>
                    )}

                    {memory.date && (
                      <span>
                        <CalendarDays size={11} />
                        {String(memory.date)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="global-search-empty">
            <div className="global-search-empty-icon">
              <Search size={22} />
            </div>

            <h3>No memories found</h3>

            <p>We couldn't find anything matching "{query}".</p>

            <button
              type="button"
              onClick={clearSearch}
              className="global-search-reset"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GlobalSearch;
