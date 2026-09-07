import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  Lock,
  Plus,
  Sparkles,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMemory } from "../../vault/MemoryContext";
import {
  useTimeCapsule,
  type TimeCapsule,
} from "../../vault/TimeCapsuleContext";

import "./PersonaTimeCapsulesPage.css";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getRemainingText(unlockDate: string) {
  const difference =
    new Date(unlockDate).getTime() - Date.now();

  if (difference <= 0) {
    return "Ready to open";
  }

  const totalMinutes = Math.floor(
    difference / (1000 * 60),
  );

  const days = Math.floor(
    totalMinutes / (60 * 24),
  );

  const hours = Math.floor(
    (totalMinutes % (60 * 24)) / 60,
  );

  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} ${
      days === 1 ? "day" : "days"
    } remaining`;
  }

  if (hours > 0) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } remaining`;
  }

  return `${minutes} ${
    minutes === 1 ? "minute" : "minutes"
  } remaining`;
}

function getMinimumDate() {
  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1,
  );

  return tomorrow.toISOString().slice(0, 10);
}

export default function PersonaTimeCapsulesPage() {
  const navigate = useNavigate();

  const { memories } = useMemory();

  const {
    capsules,
    hydrated,
    createCapsule,
    updateCapsule,
    deleteCapsule,
    isCapsuleUnlocked,
    openCapsule,
  } = useTimeCapsule();

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingCapsule, setEditingCapsule] =
    useState<TimeCapsule | null>(null);

  const [viewCapsule, setViewCapsule] =
    useState<TimeCapsule | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<TimeCapsule | null>(null);

  const [memoryId, setMemoryId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [unlockDate, setUnlockDate] =
    useState("");

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [activeFilter, setActiveFilter] =
    useState<"all" | "locked" | "ready">(
      "all",
    );

  const sortedCapsules = useMemo(
    () =>
      [...capsules].sort(
        (a, b) =>
          new Date(a.unlockDate).getTime() -
          new Date(b.unlockDate).getTime(),
      ),
    [capsules],
  );

  const visibleCapsules = useMemo(() => {
    if (activeFilter === "locked") {
      return sortedCapsules.filter(
        (capsule) =>
          !isCapsuleUnlocked(capsule),
      );
    }

    if (activeFilter === "ready") {
      return sortedCapsules.filter(
        (capsule) =>
          isCapsuleUnlocked(capsule),
      );
    }

    return sortedCapsules;
  }, [
    activeFilter,
    sortedCapsules,
    isCapsuleUnlocked,
  ]);

  const getMemoryTitle = (
    id: string,
  ) =>
    memories.find(
      (memory) => memory.id === id,
    )?.title || "Memory unavailable";

  const openCreateModal = () => {
    setEditingCapsule(null);
    setMemoryId("");
    setTitle("");
    setMessage("");
    setUnlockDate("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (
    capsule: TimeCapsule,
  ) => {
    if (isCapsuleUnlocked(capsule)) {
      return;
    }

    setEditingCapsule(capsule);
    setMemoryId(capsule.memoryId);
    setTitle(capsule.title);
    setMessage(capsule.message);
    setUnlockDate(
      capsule.unlockDate.slice(0, 10),
    );
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingCapsule(null);
    setError("");
  };

  const handleSave = async () => {
    setError("");

    if (!memoryId) {
      setError("Please select a memory.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a capsule title.");
      return;
    }

    if (!unlockDate) {
      setError("Please choose an unlock date.");
      return;
    }

    const selectedDate = new Date(
      `${unlockDate}T23:59:59`,
    );

    if (
      Number.isNaN(
        selectedDate.getTime(),
      )
    ) {
      setError("Please choose a valid date.");
      return;
    }

    if (
      !editingCapsule &&
      selectedDate.getTime() <= Date.now()
    ) {
      setError(
        "The unlock date must be in the future.",
      );
      return;
    }

    setSaving(true);

    try {
      if (editingCapsule) {
        const result =
          await updateCapsule({
            id: editingCapsule.id,
            memoryId,
            title: title.trim(),
            message: message.trim(),
            unlockDate:
              selectedDate.toISOString(),
          });

        if (!result) {
          setError(
            "Unable to update this capsule.",
          );
          return;
        }
      } else {
        const result =
          await createCapsule({
            memoryId,
            title: title.trim(),
            message: message.trim(),
            unlockDate:
              selectedDate.toISOString(),
          });

        if (!result) {
          setError(
            "The selected memory is no longer available.",
          );
          return;
        }
      }

      closeModal();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the capsule.",
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCapsule(
        deleteTarget.id,
      );

      if (
        viewCapsule?.id ===
        deleteTarget.id
      ) {
        setViewCapsule(null);
      }

      setDeleteTarget(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the capsule.",
      );
    }
  };

  const handleOpen = async (
    capsule: TimeCapsule,
  ) => {
    if (!isCapsuleUnlocked(capsule)) {
      return;
    }

    try {
      await openCapsule(capsule.id);

      setViewCapsule({
        ...capsule,
        isOpened: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to open the capsule.",
      );
    }
  };

  if (!hydrated) {
    return (
      <section className="persona-capsules-page">
        <div className="persona-capsules-loading">
          <div className="persona-capsules-spinner" />
          <h2>Loading time capsules...</h2>
          <p>
            Preparing your future memories.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="persona-capsules-page">

      {/* HEADER */}

      <header className="persona-capsules-header">
        <div>
          <span className="persona-section-eyebrow">
            FUTURE MEMORIES
          </span>

          <h2>Time Capsules</h2>

          <p>
            Leave a message attached to a memory and
            choose when it should become available.
          </p>
        </div>

        <button
          type="button"
          className="persona-capsule-create"
          onClick={openCreateModal}
        >
          <Plus size={16} />
          Create capsule
        </button>
      </header>

      {/* INFO */}

      <section className="persona-capsule-info">
        <div className="persona-capsule-info-icon">
          <Sparkles size={17} />
        </div>

        <div>
          <strong>
            Preserve something for a future moment.
          </strong>

          <span>
            Each capsule stays connected to the memory
            you select and remains locked until its
            unlock date.
          </span>
        </div>
      </section>

      {/* FILTERS */}

      <div className="persona-capsule-toolbar">
        <div className="persona-capsule-filters">
          {[
            ["all", "All"],
            ["locked", "Locked"],
            ["ready", "Ready"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={
                activeFilter === value
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveFilter(
                  value as
                    | "all"
                    | "locked"
                    | "ready",
                )
              }
            >
              {label}
            </button>
          ))}
        </div>

        <span>
          {visibleCapsules.length} capsule
          {visibleCapsules.length === 1
            ? ""
            : "s"}
        </span>
      </div>

      {/* ERROR */}

      {error && (
        <div className="persona-capsule-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* EMPTY */}

      {visibleCapsules.length === 0 ? (
        <div className="persona-capsule-empty">
          <div className="persona-capsule-empty-icon">
            <CalendarClock size={28} />
          </div>

          <span className="persona-section-eyebrow">
            NO CAPSULES
          </span>

          <h3>
            {activeFilter === "all"
              ? "Create your first time capsule"
              : "Nothing here yet"}
          </h3>

          <p>
            Create a future memory by selecting an
            existing memory, writing a message and
            choosing an unlock date.
          </p>

          {activeFilter === "all" && (
            <button
              type="button"
              onClick={openCreateModal}
            >
              <Plus size={15} />
              Create time capsule
            </button>
          )}
        </div>
      ) : (
        <div className="persona-capsule-grid">
          {visibleCapsules.map(
            (capsule) => {
              const unlocked =
                isCapsuleUnlocked(
                  capsule,
                );

              return (
                <article
                  key={capsule.id}
                  className={`persona-capsule-card ${
                    unlocked
                      ? "unlocked"
                      : "locked"
                  }`}
                >
                  <div className="persona-capsule-card-top">
                    <div
                      className={`persona-capsule-card-icon ${
                        unlocked
                          ? "ready"
                          : ""
                      }`}
                    >
                      {unlocked ? (
                        <Unlock size={18} />
                      ) : (
                        <Lock size={18} />
                      )}
                    </div>

                    <span
                      className={`persona-capsule-status ${
                        unlocked
                          ? "ready"
                          : ""
                      }`}
                    >
                      {unlocked
                        ? "Ready"
                        : "Locked"}
                    </span>
                  </div>

                  <h3>
                    {capsule.title}
                  </h3>

                  <p className="persona-capsule-message">
                    {capsule.message ||
                      "No message added."}
                  </p>

                  <div className="persona-capsule-memory">
                    <Sparkles size={13} />

                    <span>
                      {getMemoryTitle(
                        capsule.memoryId,
                      )}
                    </span>
                  </div>

                  <div className="persona-capsule-date">
                    <Clock3 size={13} />

                    <span>
                      {unlocked
                        ? "Available since "
                        : "Unlocks "}
                      {formatDate(
                        capsule.unlockDate,
                      )}
                    </span>
                  </div>

                  <div className="persona-capsule-remaining">
                    {getRemainingText(
                      capsule.unlockDate,
                    )}
                  </div>

                  <div className="persona-capsule-actions">
                    <button
                      type="button"
                      onClick={() =>
                        unlocked
                          ? void handleOpen(
                              capsule,
                            )
                          : setViewCapsule(
                              capsule,
                            )
                      }
                    >
                      {unlocked
                        ? "Open capsule"
                        : "View details"}
                    </button>

                    {!unlocked && (
                      <button
                        type="button"
                        className="icon"
                        onClick={() =>
                          openEditModal(
                            capsule,
                          )
                        }
                        aria-label="Edit capsule"
                      >
                        <Edit3 size={14} />
                      </button>
                    )}

                    <button
                      type="button"
                      className="icon danger"
                      onClick={() =>
                        setDeleteTarget(
                          capsule,
                        )
                      }
                      aria-label="Delete capsule"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}

      {modalOpen && (
        <div
          className="persona-capsule-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !saving
            ) {
              closeModal();
            }
          }}
        >
          <section
            className="persona-capsule-modal"
            role="dialog"
            aria-modal="true"
          >
            <header>
              <div>
                <span>
                  {editingCapsule
                    ? "EDIT CAPSULE"
                    : "NEW CAPSULE"}
                </span>

                <h2>
                  {editingCapsule
                    ? "Update time capsule"
                    : "Create time capsule"}
                </h2>

                <p>
                  Choose the memory and future date
                  for this capsule.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </header>

            {error && (
              <div className="persona-capsule-modal-error">
                {error}
              </div>
            )}

            <div className="persona-capsule-form">

              <label>
                <span>Memory</span>

                <select
                  value={memoryId}
                  onChange={(event) =>
                    setMemoryId(
                      event.target.value,
                    )
                  }
                  disabled={saving}
                >
                  <option value="">
                    Select a memory
                  </option>

                  {memories.map(
                    (memory) => (
                      <option
                        key={memory.id}
                        value={memory.id}
                      >
                        {memory.title ||
                          "Untitled memory"}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label>
                <span>Capsule title</span>

                <input
                  type="text"
                  value={title}
                  maxLength={150}
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  placeholder="A message for the future"
                  disabled={saving}
                />
              </label>

              <label>
                <span>Message</span>

                <textarea
                  value={message}
                  maxLength={2000}
                  onChange={(event) =>
                    setMessage(
                      event.target.value,
                    )
                  }
                  placeholder="Write something you want to preserve..."
                  rows={6}
                  disabled={saving}
                />

                <small>
                  {message.length}/2000
                </small>
              </label>

              <label>
                <span>Unlock date</span>

                <input
                  type="date"
                  min={getMinimumDate()}
                  value={unlockDate}
                  onChange={(event) =>
                    setUnlockDate(
                      event.target.value,
                    )
                  }
                  disabled={saving}
                />
              </label>
            </div>

            <footer>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary"
                onClick={() =>
                  void handleSave()
                }
                disabled={saving}
              >
                <CheckCircle2 size={15} />

                {saving
                  ? "Saving..."
                  : editingCapsule
                    ? "Save changes"
                    : "Create capsule"}
              </button>
            </footer>
          </section>
        </div>
      )}

      {/* VIEW MODAL */}

      {viewCapsule && (
        <div
          className="persona-capsule-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setViewCapsule(null);
            }
          }}
        >
          <section
            className="persona-capsule-view-modal"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="persona-view-close"
              onClick={() =>
                setViewCapsule(null)
              }
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div
              className={`persona-view-icon ${
                isCapsuleUnlocked(
                  viewCapsule,
                )
                  ? "ready"
                  : ""
              }`}
            >
              {isCapsuleUnlocked(
                viewCapsule,
              ) ? (
                <Unlock size={25} />
              ) : (
                <Lock size={25} />
              )}
            </div>

            <span className="persona-section-eyebrow">
              TIME CAPSULE
            </span>

            <h2>
              {viewCapsule.title}
            </h2>

            <p className="persona-view-message">
              {isCapsuleUnlocked(
                viewCapsule,
              )
                ? viewCapsule.message
                : "This capsule is still locked. Its message will become available when the unlock date arrives."}
            </p>

            <div className="persona-view-details">
              <div>
                <span>Memory</span>
                <strong>
                  {getMemoryTitle(
                    viewCapsule.memoryId,
                  )}
                </strong>
              </div>

              <div>
                <span>Unlock date</span>
                <strong>
                  {formatDate(
                    viewCapsule.unlockDate,
                  )}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {isCapsuleUnlocked(
                    viewCapsule,
                  )
                    ? "Available"
                    : "Locked"}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="persona-view-memory"
              onClick={() => {
                setViewCapsule(null);

                navigate(
                  `/app/persona/memories/${viewCapsule.memoryId}`,
                );
              }}
            >
              View connected memory
            </button>
          </section>
        </div>
      )}

      {/* DELETE MODAL */}

      {deleteTarget && (
        <div
          className="persona-capsule-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            className="persona-delete-modal"
            role="dialog"
            aria-modal="true"
          >
            <div className="persona-delete-icon">
              <Trash2 size={21} />
            </div>

            <h2>Delete this capsule?</h2>

            <p>
              This will permanently remove the time
              capsule. The connected memory will not be
              deleted.
            </p>

            <div>
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="danger"
                onClick={() =>
                  void confirmDelete()
                }
              >
                Delete capsule
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}