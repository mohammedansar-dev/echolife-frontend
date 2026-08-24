import {
  ArrowLeft,
  CalendarDays,
  Check,
  Download,
  FileText,
  Image as ImageIcon,
  Lock,
  Pencil,
  ShieldCheck,
  Trash2,
  Users,
  Video,
  Volume2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useMemory } from "../MemoryContext";

import type { MemoryCategory } from "../memory.types";

import { useTimeCapsule, type TimeCapsule } from "../TimeCapsuleContext";

import "./MemoryDetailsPage.css";

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES: MemoryCategory[] = [
  "Family",
  "Friends",
  "Celebrations",
  "Childhood",
  "Milestones",
  "Travel",
  "Personal",
  "Other",
];

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/* =========================================================
   PAGE
========================================================= */

function MemoryDetailsPage() {
  const navigate = useNavigate();

  const { memoryId } = useParams<{
    memoryId: string;
  }>();

  /* =======================================================
     MEMORY CONTEXT
  ======================================================= */

  const { memories, updateMemory, deleteMemory } = useMemory();

  /* =======================================================
     TIME CAPSULE CONTEXT
  ======================================================= */

  const { capsules, createCapsule } = useTimeCapsule();

  /* =======================================================
     MEMORY
  ======================================================= */

  const decodedId = memoryId ? decodeURIComponent(memoryId) : "";

  const memory = memories.find((item) => item.id === decodedId);

  /* =======================================================
     TIME CAPSULES FOR THIS MEMORY
  ======================================================= */

  const memoryCapsules = memory
    ? capsules.filter((capsule) => capsule.memoryId === memory.id)
    : [];

  /* =======================================================
     EDIT STATE
  ======================================================= */

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [date, setDate] = useState("");

  const [category, setCategory] = useState<MemoryCategory>("Family");

  const [people, setPeople] = useState("");

  /* =======================================================
     TIME CAPSULE STATE
  ======================================================= */

  const [capsuleOpen, setCapsuleOpen] = useState(false);

  const [capsuleTitle, setCapsuleTitle] = useState("");

  const [capsuleMessage, setCapsuleMessage] = useState("");

  const [capsuleDate, setCapsuleDate] = useState("");

  const [capsuleSaving, setCapsuleSaving] = useState(false);

  const [capsuleError, setCapsuleError] = useState("");

  /* =======================================================
     LOAD EDIT FORM
  ======================================================= */

  useEffect(() => {
    if (!memory) {
      return;
    }

    setTitle(memory.title);
    setDescription(memory.description);
    setDate(memory.date);
    setCategory(memory.category);
    setPeople(memory.people.join(", "));
  }, [memory]);

  /* =======================================================
     AUTO CLEAR MESSAGE
  ======================================================= */

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => setMessage(""), 3500);

    return () => window.clearTimeout(timer);
  }, [message]);

  /* =======================================================
     MEMORY NOT FOUND
  ======================================================= */

  if (!memory) {
    return (
      <main className="memory-details-page">
        <section className="memory-not-found">
          <div className="memory-not-found-icon">
            <ImageIcon size={28} />
          </div>

          <h1>Memory not found</h1>

          <p>
            The requested memory could not be found in your EchoLife memory
            space.
          </p>

          <div>
            <strong>Memory ID:</strong> {decodedId || "Unknown"}
          </div>

          <button type="button" onClick={() => navigate("/app/vault")}>
            <ArrowLeft size={16} />
            Back to Memory Vault
          </button>
        </section>
      </main>
    );
  }

  /* =======================================================
     SAVE MEMORY
  ======================================================= */

  const handleSave = async () => {
    if (!title.trim()) {
      setMessageType("error");
      setMessage("Please enter a memory title.");
      return;
    }

    setSaving(true);

    try {
      await updateMemory({
        ...memory,

        title: title.trim(),

        description: description.trim(),

        date,

        category,

        people: people
          .split(",")
          .map((person) => person.trim())
          .filter(Boolean),
      });

      setEditing(false);

      setMessageType("success");

      setMessage("Memory updated successfully.");
    } catch (error) {
      console.error(error);

      setMessageType("error");

      setMessage("Unable to update memory.");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE MEMORY
  ======================================================= */

  const handleDelete = async () => {
    setSaving(true);

    try {
      await deleteMemory(memory.id);

      navigate("/app/vault", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      setMessageType("error");

      setMessage("Unable to delete memory.");

      setSaving(false);
    }
  };

  /* =======================================================
     DOWNLOAD MEMORY
  ======================================================= */

  const handleDownload = () => {
    if (!memory.fileData) {
      setMessageType("error");

      setMessage("The file data is not available for this memory.");

      return;
    }

    const link = document.createElement("a");

    link.href = memory.fileData;

    link.download = memory.fileName || memory.title;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  /* =======================================================
     OPEN TIME CAPSULE MODAL
  ======================================================= */

  const openCapsuleModal = () => {
    setCapsuleError("");

    setCapsuleTitle(`${memory.title} — Future Me`);

    setCapsuleMessage("");

    setCapsuleDate("");

    setCapsuleOpen(true);
  };

  /* =======================================================
     CREATE TIME CAPSULE
  ======================================================= */

  const handleCreateCapsule = async () => {
    setCapsuleError("");

    if (!capsuleTitle.trim()) {
      setCapsuleError("Please enter a capsule title.");

      return;
    }

    if (!capsuleDate) {
      setCapsuleError("Please choose an unlock date.");

      return;
    }

    const unlockDate = new Date(capsuleDate);

    if (Number.isNaN(unlockDate.getTime())) {
      setCapsuleError("Please select a valid date.");

      return;
    }

    if (unlockDate.getTime() <= Date.now()) {
      setCapsuleError("The unlock date must be in the future.");

      return;
    }

    setCapsuleSaving(true);

    try {
      await createCapsule({
        id: `capsule-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

        memoryId: memory.id,

        title: capsuleTitle.trim(),

        message: capsuleMessage.trim(),

        unlockDate: unlockDate.toISOString(),


        isOpened: false,
      });

      setCapsuleTitle("");

      setCapsuleMessage("");

      setCapsuleDate("");

      setCapsuleOpen(false);

      setMessageType("success");

      setMessage("Time capsule created successfully.");
    } catch (error) {
      console.error("Unable to create time capsule:", error);

      setCapsuleError("Unable to create the time capsule. Please try again.");
    } finally {
      setCapsuleSaving(false);
    }
  };

  /* =======================================================
     CAPSULE STATUS
  ======================================================= */

  const isCapsuleUnlocked = (capsule: TimeCapsule) => {
    return new Date(capsule.unlockDate).getTime() <= Date.now();
  };

  /* =======================================================
     CAPSULE DATE
  ======================================================= */

  const formatCapsuleDate = (value: string) => {
    return formatDate(value);
  };

  /* =======================================================
     MEDIA
  ======================================================= */

  const renderMedia = () => {
    if (memory.type === "photo" && memory.thumbnail) {
      return <img src={memory.thumbnail} alt={memory.title} />;
    }

    if (memory.type === "video" && memory.fileData) {
      return <video src={memory.fileData} controls />;
    }

    if (memory.type === "audio" && memory.fileData) {
      return (
        <div className="memory-audio-preview">
          <Volume2 size={40} />

          <audio src={memory.fileData} controls />
        </div>
      );
    }

    if (memory.type === "photo") {
      return (
        <div className="memory-details-file">
          <ImageIcon size={42} />

          <strong>{memory.fileName}</strong>

          <span>Photo</span>
        </div>
      );
    }

    if (memory.type === "video") {
      return (
        <div className="memory-details-file">
          <Video size={42} />

          <strong>{memory.fileName}</strong>

          <span>Video</span>
        </div>
      );
    }

    return (
      <div className="memory-details-file">
        <FileText size={42} />

        <strong>{memory.fileName}</strong>

        <span>{memory.type}</span>
      </div>
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="memory-details-page">
      {/* ===================================================
          TOAST
      =================================================== */}

      {message && (
        <div
          className={`memory-details-toast ${
            messageType === "error" ? "error" : ""
          }`}
        >
          {messageType === "success" ? <Check size={16} /> : <X size={16} />}

          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Close notification"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="memory-details-header">
        <button
          type="button"
          className="memory-details-back"
          onClick={() => navigate("/app/vault")}
        >
          <ArrowLeft size={17} />
          Memory Vault
        </button>

        {!editing ? (
          <div className="memory-details-actions">
            {/* TIME CAPSULE */}

            <button
              type="button"
              className="time-capsule-action"
              onClick={openCapsuleModal}
            >
              <Lock size={15} />
              Create Time Capsule
            </button>

            {/* DOWNLOAD */}

            <button type="button" onClick={handleDownload}>
              <Download size={15} />
              Download
            </button>

            {/* EDIT */}

            <button type="button" onClick={() => setEditing(true)}>
              <Pencil size={15} />
              Edit
            </button>

            {/* DELETE */}

            <button
              type="button"
              className="danger"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        ) : (
          <div className="memory-details-actions">
            <button
              type="button"
              disabled={saving}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="save"
              disabled={saving}
              onClick={handleSave}
            >
              <Check size={15} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </header>

      {/* ===================================================
          TIME CAPSULE MODAL
      =================================================== */}

      {capsuleOpen && (
        <div
          className="memory-capsule-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="time-capsule-title"
        >
          <section className="memory-capsule-modal">
            <button
              type="button"
              className="memory-capsule-close"
              onClick={() => setCapsuleOpen(false)}
              disabled={capsuleSaving}
              aria-label="Close time capsule"
            >
              <X size={18} />
            </button>

            <div className="memory-capsule-heading">
              <div className="memory-capsule-icon">
                <Lock size={20} />
              </div>

              <div>
                <h2 id="time-capsule-title">Create Time Capsule</h2>

                <p>Keep this memory safely locked until your chosen date.</p>
              </div>
            </div>

            {/* SELECTED MEMORY */}

            <div className="memory-capsule-selected">
              <span>Selected memory</span>

              <strong>{memory.title}</strong>
            </div>

            {/* ERROR */}

            {capsuleError && (
              <div className="memory-capsule-error">
                <X size={15} />

                <span>{capsuleError}</span>
              </div>
            )}

            {/* TITLE */}

            <label>
              Capsule title
              <input
                type="text"
                value={capsuleTitle}
                onChange={(event) => setCapsuleTitle(event.target.value)}
                placeholder="A message for my future self"
                disabled={capsuleSaving}
              />
            </label>

            {/* MESSAGE */}

            <label>
              Message
              <textarea
                rows={5}
                value={capsuleMessage}
                onChange={(event) => setCapsuleMessage(event.target.value)}
                placeholder="Write something you want your future self to remember..."
                disabled={capsuleSaving}
              />
            </label>

            {/* DATE */}

            <label>
              Unlock date
              <input
                type="date"
                value={capsuleDate}
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                onChange={(event) => setCapsuleDate(event.target.value)}
                disabled={capsuleSaving}
              />
            </label>

            {/* PREVIEW */}

            <div className="memory-capsule-preview">
              <Lock size={18} />

              <div>
                <strong>This memory will be locked</strong>

                <span>It will become available on the selected date.</span>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="memory-capsule-actions">
              <button
                type="button"
                onClick={() => setCapsuleOpen(false)}
                disabled={capsuleSaving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary"
                onClick={handleCreateCapsule}
                disabled={capsuleSaving}
              >
                <Lock size={15} />

                {capsuleSaving ? "Locking..." : "Lock Time Capsule"}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ===================================================
          DELETE DIALOG
      =================================================== */}

      {deleteOpen && (
        <div className="memory-delete-overlay">
          <div className="memory-delete-dialog">
            <div className="memory-delete-icon">
              <Trash2 size={21} />
            </div>

            <h2>Delete this memory?</h2>

            <p>
              You're about to delete <strong>"{memory.title}"</strong>. This
              action cannot be undone.
            </p>

            <div className="memory-delete-actions">
              <button type="button" onClick={() => setDeleteOpen(false)}>
                Cancel
              </button>

              <button
                type="button"
                className="danger"
                disabled={saving}
                onClick={handleDelete}
              >
                <Trash2 size={14} />

                {saving ? "Deleting..." : "Delete Memory"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="memory-details-layout">
        {/* =================================================
            MEDIA
        ================================================= */}

        <section className="memory-details-media-card">
          <div className="memory-details-media">{renderMedia()}</div>

          <div className="memory-details-media-footer">
            <span>{memory.fileName}</span>

            <span>{memory.size}</span>
          </div>
        </section>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <section className="memory-details-info">
          {!editing ? (
            <>
              {/* HEADING */}

              <div className="memory-details-heading">
                <span>{memory.category}</span>

                <h1>{memory.title}</h1>

                <p>
                  <CalendarDays size={14} />

                  {formatDate(memory.date)}
                </p>
              </div>

              {/* DESCRIPTION */}

              <div className="memory-details-section">
                <h2>Description</h2>

                <p>{memory.description || "No description added."}</p>
              </div>

              {/* PEOPLE */}

              <div className="memory-details-section">
                <h2>
                  <Users size={16} />
                  People
                </h2>

                <div className="memory-people">
                  {memory.people.length > 0 ? (
                    memory.people.map((person) => (
                      <span key={person}>{person}</span>
                    ))
                  ) : (
                    <small>No people added.</small>
                  )}
                </div>
              </div>

              {/* MEMORY INFORMATION */}

              <div className="memory-details-section">
                <h2>Memory information</h2>

                <div className="memory-information-grid">
                  <div>
                    <span>Type</span>

                    <strong>{memory.type}</strong>
                  </div>

                  <div>
                    <span>Category</span>

                    <strong>{memory.category}</strong>
                  </div>

                  <div>
                    <span>File size</span>

                    <strong>{memory.size}</strong>
                  </div>

                  <div>
                    <span>Added</span>
                    <strong>
                      {formatDate(memory.createdAt || memory.date)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* PRIVATE */}

              <div className="memory-private-box">
                <ShieldCheck size={19} />

                <div>
                  <strong>Private memory</strong>

                  <p>This memory belongs to your private EchoLife space.</p>
                </div>
              </div>

              {/* =================================================
                  EXISTING TIME CAPSULES
              ================================================= */}

              {memoryCapsules.length > 0 && (
                <section className="memory-capsules-section">
                  <div className="memory-capsules-section-heading">
                    <div>
                      <h2>Time Capsules</h2>

                      <p>Future memories connected to this memory.</p>
                    </div>

                    <span>{memoryCapsules.length}</span>
                  </div>

                  <div className="memory-capsules-list">
                    {memoryCapsules.map((capsule) => {
                      const unlocked = isCapsuleUnlocked(capsule);

                      return (
                        <div
                          key={capsule.id}
                          className={`memory-capsule-status-card ${
                            unlocked ? "unlocked" : "locked"
                          }`}
                        >
                          <div className="memory-capsule-status-icon">
                            {unlocked ? (
                              <Check size={17} />
                            ) : (
                              <Lock size={17} />
                            )}
                          </div>

                          <div className="memory-capsule-status-content">
                            <div className="memory-capsule-status-top">
                              <strong>{capsule.title}</strong>

                              <span>{unlocked ? "Unlocked" : "Locked"}</span>
                            </div>

                            <p>
                              {unlocked
                                ? "This capsule is ready to revisit."
                                : `Opens ${formatCapsuleDate(
                                    capsule.unlockDate,
                                  )}`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="memory-view-capsules-button"
                    onClick={() => navigate("/app/time-capsule")}
                  >
                    View all time capsules
                  </button>
                </section>
              )}

              {/* =================================================
                  CREATE CAPSULE CARD
              ================================================= */}

              <button
                type="button"
                className="memory-create-capsule-card"
                onClick={openCapsuleModal}
              >
                <div className="memory-create-capsule-icon">
                  <Lock size={19} />
                </div>

                <div>
                  <strong>Preserve this for the future</strong>

                  <span>Create a time capsule from this memory.</span>
                </div>

                <span className="memory-create-capsule-arrow">→</span>
              </button>
            </>
          ) : (
            /* =================================================
               EDIT FORM
            ================================================= */

            <div className="memory-edit-form">
              <div>
                <span>EDIT MEMORY</span>

                <h1>Update memory</h1>
              </div>

              <label>
                Title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>

              <label>
                Description
                <textarea
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>

              <label>
                Memory date
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>

              <label>
                Category
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as MemoryCategory)
                  }
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                People
                <input
                  value={people}
                  onChange={(event) => setPeople(event.target.value)}
                  placeholder="Family, Friends"
                />
                <small>Separate people with commas.</small>
              </label>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default MemoryDetailsPage;
