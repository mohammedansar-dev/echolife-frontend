import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  Lock,
  Plus,
  Trash2,
  Unlock,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useMemory } from "../MemoryContext";

import { useTimeCapsule, type TimeCapsule } from "../TimeCapsuleContext";

import "./TimeCapsulesPage.css";

/* =========================================================
   HELPERS
========================================================= */

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
  const difference = new Date(unlockDate).getTime() - Date.now();

  if (difference <= 0) {
    return "Ready to open";
  }

  const totalMinutes = Math.floor(difference / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));

  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);

  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} ${days === 1 ? "day" : "days"} remaining`;
  }

  if (hours > 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} remaining`;
  }

  return `${minutes} ${minutes === 1 ? "minute" : "minutes"} remaining`;
}

function getMinimumDate() {
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.toISOString().slice(0, 10);
}

/* =========================================================
   PAGE
========================================================= */

function TimeCapsulesPage() {
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

  /* =======================================================
     CREATE / EDIT MODAL
  ======================================================= */

  const [modalOpen, setModalOpen] = useState(false);

  const [editingCapsule, setEditingCapsule] = useState<TimeCapsule | null>(
    null,
  );
  const [deleteCapsuleTarget, setDeleteCapsuleTarget] =
    useState<TimeCapsule | null>(null);
  const [memoryId, setMemoryId] = useState("");

  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [unlockDate, setUnlockDate] = useState("");

  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  /* =======================================================
     VIEW MODAL
  ======================================================= */

  const [viewCapsule, setViewCapsule] = useState<TimeCapsule | null>(null);

  /* =======================================================
     SORT
  ======================================================= */

  const sortedCapsules = useMemo(() => {
    return [...capsules].sort(
      (a, b) =>
        new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime(),
    );
  }, [capsules]);

  const lockedCapsules = sortedCapsules.filter(
    (capsule) => !isCapsuleUnlocked(capsule),
  );

  const unlockedCapsules = sortedCapsules.filter((capsule) =>
    isCapsuleUnlocked(capsule),
  );

  /* =======================================================
     MEMORY TITLE
  ======================================================= */

  const getMemoryTitle = (memoryId: string) => {
    return (
      memories.find((memory) => memory.id === memoryId)?.title ||
      "Memory unavailable"
    );
  };

  /* =======================================================
     OPEN CREATE
  ======================================================= */

  const openCreateModal = () => {
    setEditingCapsule(null);

    setMemoryId("");

    setTitle("");

    setMessage("");

    setUnlockDate("");

    setError("");

    setModalOpen(true);
  };

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const openEditModal = (capsule: TimeCapsule) => {
    if (isCapsuleUnlocked(capsule)) {
      setError("Unlocked capsules can no longer be edited.");

      return;
    }

    setEditingCapsule(capsule);

    setMemoryId(capsule.memoryId);

    setTitle(capsule.title);

    setMessage(capsule.message);

    setUnlockDate(capsule.unlockDate.slice(0, 10));

    setError("");

    setModalOpen(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);

    setEditingCapsule(null);

    setError("");
  };

  /* =======================================================
     SAVE
  ======================================================= */

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

    const selectedDate = new Date(`${unlockDate}T23:59:59`);

    if (Number.isNaN(selectedDate.getTime())) {
      setError("Please choose a valid unlock date.");

      return;
    }

    if (!editingCapsule && selectedDate.getTime() <= Date.now()) {
      setError("The unlock date must be in the future.");

      return;
    }

    setSaving(true);

    try {
      if (editingCapsule) {
        const result = await updateCapsule({
          id: editingCapsule.id,

          memoryId,

          title,

          message,

          unlockDate: selectedDate.toISOString(),
        });

        if (!result) {
          setError("Unable to update this capsule.");

          return;
        }
      } else {
        const result = await createCapsule({
          memoryId,

          title,

          message,

          unlockDate: selectedDate.toISOString(),
        });

        if (!result) {
          setError("The selected memory is no longer available.");

          return;
        }
      }

      closeModal();
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = (capsule: TimeCapsule) => {
    setDeleteCapsuleTarget(capsule);
  };

  const confirmDeleteCapsule = async () => {
    if (!deleteCapsuleTarget) {
      return;
    }

    await deleteCapsule(deleteCapsuleTarget.id);

    if (viewCapsule?.id === deleteCapsuleTarget.id) {
      setViewCapsule(null);
    }

    setDeleteCapsuleTarget(null);
  };
  /* =======================================================
     OPEN CAPSULE
  ======================================================= */

  const handleOpenCapsule = async (capsule: TimeCapsule) => {
    if (!isCapsuleUnlocked(capsule)) {
      return;
    }

    await openCapsule(capsule.id);

    const updated = {
      ...capsule,
      isOpened: true,
    };

    setViewCapsule(updated);
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!hydrated) {
    return (
      <main className="time-capsules-page">
        <section className="time-capsules-loading">
          <div className="time-capsules-spinner" />

          <h2>Loading your time capsules...</h2>

          <p>Preparing your private future memories.</p>
        </section>
      </main>
    );
  }

  /* =======================================================
     RENDER CARD
  ======================================================= */

  const renderCapsule = (capsule: TimeCapsule) => {
    const unlocked = isCapsuleUnlocked(capsule);

    return (
      <article
        key={capsule.id}
        className={`time-capsule-card ${
          unlocked ? "is-unlocked" : "is-locked"
        }`}
      >
        <div className="time-capsule-card-icon">
          {unlocked ? <Unlock size={21} /> : <Lock size={21} />}
        </div>

        <div className="time-capsule-card-body">
          <div className="time-capsule-card-top">
            <span
              className={`time-capsule-status ${
                unlocked ? "unlocked" : "locked"
              }`}
            >
              {unlocked ? "Unlocked" : "Locked"}
            </span>

            <div className="time-capsule-card-actions">
              {!unlocked && (
                <button
                  type="button"
                  onClick={() => openEditModal(capsule)}
                  aria-label="Edit capsule"
                  title="Edit capsule"
                >
                  <Edit3 size={15} />
                </button>
              )}

              <button
                type="button"
                className="danger"
                onClick={() => handleDelete(capsule)}
                aria-label="Delete capsule"
                title="Delete capsule"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <h3>{capsule.title}</h3>

          <p className="time-capsule-linked-memory">
            <span>Memory</span>

            <strong>{getMemoryTitle(capsule.memoryId)}</strong>
          </p>

          {capsule.message && (
            <p className="time-capsule-message">{capsule.message}</p>
          )}

          <div className="time-capsule-meta">
            <span>
              <CalendarClock size={14} />

              {formatDate(capsule.unlockDate)}
            </span>

            <span>
              {unlocked
                ? "Ready to revisit"
                : getRemainingText(capsule.unlockDate)}
            </span>
          </div>

          <div className="time-capsule-card-buttons">
            {unlocked ? (
              <button
                type="button"
                className="time-capsule-open"
                onClick={() => handleOpenCapsule(capsule)}
              >
                <Unlock size={15} />
                Open capsule
              </button>
            ) : (
              <div className="time-capsule-locked-note">
                <Lock size={13} />
                Locked until {formatDate(capsule.unlockDate)}
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="time-capsules-page">
      {/* HEADER */}

      <header className="time-capsules-header">
        <div className="time-capsules-heading-area">
          <button
            type="button"
            className="time-capsules-back"
            onClick={() => navigate("/app/vault")}
          >
            <ArrowLeft size={16} />
            Memory Vault
          </button>

          <div className="time-capsules-heading">
            <div className="time-capsules-heading-icon">
              <Clock3 size={23} />
            </div>

            <div>
              <h1>Time Capsules</h1>

              <p>Preserve something meaningful for your future self.</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="time-capsules-create"
          onClick={openCreateModal}
        >
          <Plus size={17} />
          Create capsule
        </button>
      </header>

      {/* INTRO */}

      <section className="time-capsules-intro">
        <div>
          <span className="time-capsules-intro-icon">
            <Lock size={17} />
          </span>

          <div>
            <strong>A private message from today</strong>

            <p>
              Choose a memory, write a message, and decide when your future self
              can open it.
            </p>
          </div>
        </div>

        <div className="time-capsule-summary">
          <span>
            <strong>{capsules.length}</strong>
            Total
          </span>

          <span>
            <strong>{lockedCapsules.length}</strong>
            Locked
          </span>

          <span>
            <strong>{unlockedCapsules.length}</strong>
            Ready
          </span>
        </div>
      </section>

      {/* EMPTY */}

      {capsules.length === 0 ? (
        <section className="time-capsules-empty">
          <div className="time-capsules-empty-icon">
            <Clock3 size={28} />
          </div>

          <h2>Your future memories start here</h2>

          <p>
            Create a time capsule from one of your memories. It will remain
            locked until the date you choose.
          </p>

          <button type="button" onClick={openCreateModal}>
            <Plus size={16} />
            Create your first capsule
          </button>
        </section>
      ) : (
        <>
          {/* LOCKED */}

          {lockedCapsules.length > 0 && (
            <section className="time-capsule-section">
              <div className="time-capsule-section-heading">
                <div>
                  <span className="section-eyebrow">THE FUTURE</span>

                  <h2>Waiting for the right moment</h2>

                  <p>
                    These capsules are safely locked until their chosen date.
                  </p>
                </div>

                <span className="section-count">
                  {lockedCapsules.length} locked
                </span>
              </div>

              <div className="time-capsule-grid">
                {lockedCapsules.map(renderCapsule)}
              </div>
            </section>
          )}

          {/* UNLOCKED */}

          {unlockedCapsules.length > 0 && (
            <section className="time-capsule-section">
              <div className="time-capsule-section-heading">
                <div>
                  <span className="section-eyebrow">READY</span>

                  <h2>Ready to revisit</h2>

                  <p>These time capsules are ready for you.</p>
                </div>

                <span className="section-count ready">
                  {unlockedCapsules.length} ready
                </span>
              </div>

              <div className="time-capsule-grid">
                {unlockedCapsules.map(renderCapsule)}
              </div>
            </section>
          )}
        </>
      )}

      {/* PRIVACY */}

      <footer className="time-capsules-privacy">
        <CheckCircle2 size={17} />

        <span>
          Your time capsules remain inside your private EchoLife memory space.
        </span>
      </footer>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {modalOpen && (
        <div
          className="time-capsule-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="time-capsule-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="time-capsule-modal-title"
          >
            <button
              type="button"
              className="time-capsule-modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="time-capsule-modal-heading">
              <div className="time-capsule-modal-icon">
                {editingCapsule ? <Edit3 size={19} /> : <Lock size={19} />}
              </div>

              <div>
                <span>{editingCapsule ? "UPDATE CAPSULE" : "NEW CAPSULE"}</span>

                <h2>
                  {editingCapsule
                    ? "Edit time capsule"
                    : "Create a time capsule"}
                </h2>

                <p>
                  {editingCapsule
                    ? "Update the details before the capsule unlocks."
                    : "Choose a memory and preserve a message for your future self."}
                </p>
              </div>
            </div>

            {error && <div className="time-capsule-form-error">{error}</div>}

            <div className="time-capsule-form">
              <label>
                <span>Memory</span>

                <select
                  value={memoryId}
                  onChange={(event) => setMemoryId(event.target.value)}
                >
                  <option value="">Select a memory</option>

                  {memories.map((memory) => (
                    <option key={memory.id} value={memory.id}>
                      {memory.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Capsule title</span>

                <input
                  value={title}
                  maxLength={100}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="A message for my future self"
                />
              </label>

              <label>
                <span>Message</span>

                <textarea
                  value={message}
                  maxLength={1000}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Write something you want to remember..."
                  rows={5}
                />

                <small>{message.length}/1000</small>
              </label>

              <label>
                <span>Unlock date</span>

                <input
                  type="date"
                  value={unlockDate}
                  min={editingCapsule ? undefined : getMinimumDate()}
                  onChange={(event) => setUnlockDate(event.target.value)}
                />

                <small>Your capsule stays locked until this date.</small>
              </label>
            </div>

            <div className="time-capsule-modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="button-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Lock size={15} />

                    {editingCapsule ? "Save changes" : "Lock capsule"}
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================
          VIEW CAPSULE MODAL
      ===================================================== */}

      {viewCapsule && (
        <div
          className="time-capsule-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewCapsule(null);
            }
          }}
        >
          <section
            className="time-capsule-view-modal"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="time-capsule-modal-close"
              onClick={() => setViewCapsule(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="time-capsule-view-icon">
              <Unlock size={25} />
            </div>

            <span className="view-eyebrow">TIME CAPSULE UNLOCKED</span>

            <h2>{viewCapsule.title}</h2>

            <p className="view-memory">
              From memory:{" "}
              <strong>{getMemoryTitle(viewCapsule.memoryId)}</strong>
            </p>

            <div className="time-capsule-letter">
              {viewCapsule.message ? (
                <p>{viewCapsule.message}</p>
              ) : (
                <p className="empty-message">
                  No message was added to this capsule.
                </p>
              )}
            </div>

            <div className="view-date">
              <CalendarClock size={15} />
              Unlocked {formatDate(viewCapsule.unlockDate)}
            </div>

            <div className="view-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setViewCapsule(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="primary"
                onClick={() => {
                  setViewCapsule(null);

                  navigate(
                    `/app/vault/${encodeURIComponent(viewCapsule.memoryId)}`,
                  );
                }}
              >
                <Unlock size={15} />
                Open memory
              </button>
            </div>
          </section>
        </div>
      )}
      {/* =====================================================
    DELETE CONFIRMATION
===================================================== */}

      {deleteCapsuleTarget && (
        <div
          className="time-capsule-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteCapsuleTarget(null);
            }
          }}
        >
          <section
            className="time-capsule-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-capsule-title"
          >
            <div className="time-capsule-delete-icon">
              <Trash2 size={22} />
            </div>

            <span className="delete-eyebrow">DELETE TIME CAPSULE</span>

            <h2 id="delete-capsule-title">Delete this capsule?</h2>

            <p>
              You're about to permanently delete{" "}
              <strong>"{deleteCapsuleTarget.title}"</strong>.
            </p>

            <p className="delete-warning">This action cannot be undone.</p>

            <div className="time-capsule-delete-actions">
              <button
                type="button"
                className="cancel"
                onClick={() => setDeleteCapsuleTarget(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete"
                onClick={confirmDeleteCapsule}
              >
                <Trash2 size={15} />
                Delete capsule
              </button>
            </div>
          </section>
        </div>
      )}
      {/* =====================================================
    DELETE CONFIRMATION
===================================================== */}

      {deleteCapsuleTarget && (
        <div
          className="time-capsule-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteCapsuleTarget(null);
            }
          }}
        >
          <section
            className="time-capsule-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-capsule-title"
          >
            <div className="time-capsule-delete-icon">
              <Trash2 size={22} />
            </div>

            <span className="delete-eyebrow">DELETE TIME CAPSULE</span>

            <h2 id="delete-capsule-title">Delete this capsule?</h2>

            <p>
              You're about to permanently delete{" "}
              <strong>"{deleteCapsuleTarget.title}"</strong>.
            </p>

            <p className="delete-warning">This action cannot be undone.</p>

            <div className="time-capsule-delete-actions">
              <button
                type="button"
                className="cancel"
                onClick={() => setDeleteCapsuleTarget(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete"
                onClick={confirmDeleteCapsule}
              >
                <Trash2 size={15} />
                Delete capsule
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default TimeCapsulesPage;
