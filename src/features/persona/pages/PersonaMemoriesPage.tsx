import {
  Brain,
  Check,
  FileText,
  Image as ImageIcon,
  Link2,
  MoreVertical,
  Music,
  Search,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMemory } from "../../vault/MemoryContext";
import type { MemoryType } from "../../vault/memory.types";
import { usePersona } from "../PersonaContext";
import "./PersonaMemoriesPage.css";

const typeOptions: Array<"all" | MemoryType> = [
  "all",
  "photo",
  "video",
  "audio",
  "document",
];

function getIcon(type: MemoryType) {
  if (type === "photo") return ImageIcon;
  if (type === "video") return Video;
  if (type === "audio") return Music;

  return FileText;
}

export default function PersonaMemoriesPage() {
  const navigate = useNavigate();

  const {
    memories,
    hydrated,
    deleteMemory,
  } = useMemory();

  const {
    configuration,
    saveConfiguration,
  } = usePersona();

  const selectedIds = configuration?.selectedMemoryIds ?? [];

  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | MemoryType>("all");
  const [connectedOnly, setConnectedOnly] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredMemories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return memories.filter((memory) => {
      const matchesType =
        type === "all" || memory.type === type;

      const matchesSearch =
        !query ||
        `${memory.title} ${memory.description ?? ""} ${
          memory.category ?? ""
        }`
          .toLowerCase()
          .includes(query);

      const matchesConnected =
        !connectedOnly || selectedIds.includes(memory.id);

      return (
        matchesType &&
        matchesSearch &&
        matchesConnected
      );
    });
  }, [
    memories,
    search,
    type,
    connectedOnly,
    selectedIds,
  ]);

  const statistics = {
    total: memories.length,
    photos: memories.filter((m) => m.type === "photo").length,
    videos: memories.filter((m) => m.type === "video").length,
    audio: memories.filter((m) => m.type === "audio").length,
    documents: memories.filter((m) => m.type === "document").length,
    connected: selectedIds.length,
  };

  const connectMemory = async (memoryId: string) => {
    if (!configuration) return;

    if (selectedIds.includes(memoryId)) return;

    await saveConfiguration({
      ...configuration,
      selectedMemoryIds: [
        ...selectedIds,
        memoryId,
      ],
    });
  };

  const removeFromPersona = async (memoryId: string) => {
    if (!configuration) return;

    await saveConfiguration({
      ...configuration,
      selectedMemoryIds: selectedIds.filter(
        (id) => id !== memoryId,
      ),
    });
  };

  const selectAllVisible = async () => {
    if (!configuration) return;

    const ids = Array.from(
      new Set([
        ...selectedIds,
        ...filteredMemories.map(
          (memory) => memory.id,
        ),
      ]),
    );

    await saveConfiguration({
      ...configuration,
      selectedMemoryIds: ids,
    });
  };

  const clearAllConnections = async () => {
    if (!configuration) return;

    await saveConfiguration({
      ...configuration,
      selectedMemoryIds: [],
    });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    await deleteMemory(deleteId);

    setDeleteId(null);
    setShowMenu(null);
  };

  return (
    <div className="persona-vault-page">
      {/* HERO */}

      <header className="persona-vault-hero">
        <div className="persona-vault-hero-content">
          <div className="persona-vault-eyebrow">
            <Brain size={15} />
            Memory Vault
          </div>

          <h2>
            Preserve the moments that matter.
          </h2>

          <p>
            Store your photos, videos, audio recordings and
            documents in one place, then choose which memories
            your AI Persona can access.
          </p>
        </div>

        <Link
          to="/app/persona/memories/upload"
          className="persona-vault-upload-button"
        >
          <Upload size={17} />
          Upload Memory
        </Link>
      </header>

      {/* STATS */}

      <section className="persona-vault-stats">
        <div className="persona-vault-stat stat-main">
          <div className="persona-vault-stat-icon">
            <Brain size={19} />
          </div>

          <div>
            <strong>{statistics.total}</strong>
            <span>Total memories</span>
          </div>
        </div>

        <div className="persona-vault-stat">
          <div className="persona-vault-stat-icon">
            <ImageIcon size={18} />
          </div>

          <div>
            <strong>{statistics.photos}</strong>
            <span>Photos</span>
          </div>
        </div>

        <div className="persona-vault-stat">
          <div className="persona-vault-stat-icon">
            <Video size={18} />
          </div>

          <div>
            <strong>{statistics.videos}</strong>
            <span>Videos</span>
          </div>
        </div>

        <div className="persona-vault-stat">
          <div className="persona-vault-stat-icon">
            <Music size={18} />
          </div>

          <div>
            <strong>{statistics.audio}</strong>
            <span>Audio</span>
          </div>
        </div>

        <div className="persona-vault-stat">
          <div className="persona-vault-stat-icon">
            <Link2 size={18} />
          </div>

          <div>
            <strong>{statistics.connected}</strong>
            <span>Connected</span>
          </div>
        </div>
      </section>

      {/* PERSONA CONNECTION */}

      {configuration && (
        <section className="persona-vault-persona-bar">
          <div className="persona-vault-persona-info">
            <div className="persona-vault-persona-avatar">
              <Brain size={18} />
            </div>

            <div>
              <span>Current Persona</span>
              <strong>{configuration.name}</strong>
            </div>
          </div>

          <div className="persona-vault-persona-count">
            <strong>{statistics.connected}</strong>
            <span>memories connected</span>
          </div>
        </section>
      )}

      {/* FILTERS */}

      <section className="persona-vault-controls">
        <div className="persona-vault-search">
          <Search size={17} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search your memories..."
          />
        </div>

        <div className="persona-vault-filters">
          {typeOptions.map((item) => (
            <button
              type="button"
              key={item}
              className={
                type === item && !connectedOnly
                  ? "active"
                  : ""
              }
              onClick={() => {
                setType(item);
                setConnectedOnly(false);
              }}
            >
              {item === "all"
                ? "All"
                : item.charAt(0).toUpperCase() +
                  item.slice(1)}
            </button>
          ))}

          <button
            type="button"
            className={
              connectedOnly ? "active" : ""
            }
            onClick={() => setConnectedOnly(true)}
          >
            Connected
          </button>
        </div>
      </section>

      {/* ACTION BAR */}

      {configuration && filteredMemories.length > 0 && (
        <div className="persona-vault-action-bar">
          <div>
            <strong>
              {filteredMemories.length} memories
            </strong>

            <span>
              Select which memories your Persona can access.
            </span>
          </div>

          <div className="persona-vault-bulk-actions">
            <button
              type="button"
              onClick={selectAllVisible}
            >
              <Check size={15} />
              Connect visible
            </button>

            <button
              type="button"
              onClick={clearAllConnections}
            >
              <X size={15} />
              Disconnect all
            </button>
          </div>
        </div>
      )}

      {/* CONTENT */}

      {!hydrated ? (
        <div className="persona-vault-state">
          <div className="persona-vault-spinner" />
          <strong>Loading your Memory Vault</strong>
          <span>
            Preparing your memories...
          </span>
        </div>
      ) : memories.length === 0 ? (
        <div className="persona-vault-empty">
          <div className="persona-vault-empty-icon">
            <Brain size={34} />
          </div>

          <h3>Your Memory Vault is empty</h3>

          <p>
            Start preserving meaningful moments by uploading
            photos, videos, audio recordings or documents.
          </p>

          <Link
            to="/app/persona/memories/upload"
          >
            <Upload size={16} />
            Upload your first memory
          </Link>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="persona-vault-empty compact">
          <Search size={28} />

          <h3>No memories found</h3>

          <p>
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setType("all");
              setConnectedOnly(false);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <section className="persona-vault-grid">
          {filteredMemories.map((memory, index) => {
            const connected = selectedIds.includes(
              memory.id,
            );

            const Icon = getIcon(memory.type);

            return (
              <article
                key={memory.id}
                className={`persona-vault-card ${
                  connected ? "connected" : ""
                }`}
                style={{
                  animationDelay: `${index * 35}ms`,
                }}
              >
                <div className="persona-vault-preview">
                  {memory.thumbnail ? (
                    <img
                      src={memory.thumbnail}
                      alt=""
                    />
                  ) : (
                    <div className="persona-vault-file-icon">
                      <Icon size={34} />
                    </div>
                  )}

                  <div className="persona-vault-type">
                    {memory.type}
                  </div>

                  {connected && (
                    <div className="persona-vault-connected">
                      <Check size={12} />
                      Connected
                    </div>
                  )}

                  <button
                    type="button"
                    className="persona-vault-menu-trigger"
                    onClick={() =>
                      setShowMenu(
                        showMenu === memory.id
                          ? null
                          : memory.id,
                      )
                    }
                    aria-label="Memory actions"
                  >
                    <MoreVertical size={17} />
                  </button>

                  {showMenu === memory.id && (
                    <div className="persona-vault-menu">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/app/persona/memories/${memory.id}`,
                          )
                        }
                      >
                        View Memory
                      </button>

                      {connected ? (
                        <button
                          type="button"
                          onClick={() =>
                            removeFromPersona(
                              memory.id,
                            )
                          }
                        >
                          <X size={14} />
                          Remove from Persona
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            connectMemory(memory.id)
                          }
                        >
                          <Link2 size={14} />
                          Connect to Persona
                        </button>
                      )}

                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          setDeleteId(memory.id)
                        }
                      >
                        <Trash2 size={14} />
                        Delete Memory
                      </button>
                    </div>
                  )}
                </div>

                <div className="persona-vault-card-body">
                  <div className="persona-vault-card-title">
                    <h3>{memory.title}</h3>

                    <span>
                      {memory.memoryDate ||
                        "No date"}
                    </span>
                  </div>

                  {memory.description && (
                    <p>
                      {memory.description}
                    </p>
                  )}

                  <div className="persona-vault-card-footer">
                    <button
                      type="button"
                      className={
                        connected
                          ? "connected-button"
                          : ""
                      }
                      onClick={() =>
                        connected
                          ? removeFromPersona(
                              memory.id,
                            )
                          : connectMemory(
                              memory.id,
                            )
                      }
                    >
                      {connected ? (
                        <>
                          <Check size={14} />
                          Connected
                        </>
                      ) : (
                        <>
                          <Link2 size={14} />
                          Connect
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="view-button"
                      onClick={() =>
                        navigate(
                          `/app/persona/memories/${memory.id}`,
                        )
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* DELETE MODAL */}

      {deleteId && (
        <div
          className="persona-vault-modal-backdrop"
          onClick={() => setDeleteId(null)}
          role="presentation"
        >
          <div
            className="persona-vault-delete-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="persona-vault-delete-icon">
              <Trash2 size={20} />
            </div>

            <h3>Delete this memory?</h3>

            <p>
              This permanently removes the memory from
              your Memory Vault. If it is connected to your
              Persona, it will no longer be available there.
            </p>

            <div className="persona-vault-modal-actions">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
              >
                Delete Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}