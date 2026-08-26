import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileAudio,
  FileText,
  FileVideo,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMemory } from "../MemoryContext";
import type { Memory, MemoryType } from "../memory.types";

import EditMemoryModal from "../components/EditMemoryModal";

import "./MemoryDetailsPage.css";

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
    weekday: "long",
    day: "numeric",
    month: "long",
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

/* =========================================================
   PAGE
========================================================= */

export default function MemoryDetailsPage() {
  const navigate = useNavigate();

  const { memoryId } = useParams<{
    memoryId: string;
  }>();

  const { getMemoryById, deleteMemory, updateMemory } = useMemory();

  /* =======================================================
     MEMORY STATEk
  ======================================================= */

  const [memory, setMemory] = useState<Memory | undefined>(undefined);

  const [loadingMemory, setLoadingMemory] = useState(true);

  /* =======================================================
     ACTION STATE
  ======================================================= */

  const [deleting, setDeleting] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);


  /* =======================================================
     TOAST
  ======================================================= */

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* =======================================================
     LOAD MEMORY
  ======================================================= */

  useEffect(() => {
    if (!memoryId) {
      setMemory(undefined);
      setLoadingMemory(false);
      return;
    }

    let cancelled = false;

    const loadMemory = async () => {
      setLoadingMemory(true);
      setToast(null);

      try {
        const result = await getMemoryById(memoryId);

        if (!cancelled) {
          setMemory(result ?? undefined);
        }
      } catch (error) {
        console.error("Unable to load memory:", error);

        if (!cancelled) {
          setMemory(undefined);

          setToast({
            type: "error",
            message: "Unable to load this memory.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingMemory(false);
        }
      }
    };

    void loadMemory();

    return () => {
      cancelled = true;
    };
  }, [memoryId, getMemoryById]);

  /* =======================================================
     NO ID
  ======================================================= */

  if (!memoryId) {
    return (
      <main className="memory-details-page">
        <div className="memory-details-not-found">
          <h1>Memory not found</h1>

          <p>No memory identifier was provided.</p>

          <button type="button" onClick={() => navigate("/app/vault")}>
            <ArrowLeft size={17} />
            Back to Memory Vault
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loadingMemory) {
    return (
      <main className="memory-details-page">
        <div className="memory-details-not-found">
          <Loader2 size={34} className="memory-details-spin" />

          <h1>Loading memory...</h1>

          <p>Retrieving your memory from EchoLife.</p>
        </div>
      </main>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!memory) {
    return (
      <main className="memory-details-page">
        <div className="memory-details-not-found">
          <div className="memory-details-not-found-icon">
            <FileText size={28} />
          </div>

          <h1>Memory not found</h1>

          <p>This memory is not available or may have been deleted.</p>

          <button type="button" onClick={() => navigate("/app/vault")}>
            <ArrowLeft size={17} />
            Back to Memory Vault
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     MEMORY DATA
  ======================================================= */

  const Icon = getMemoryIcon(memory.type);

  const isImage = memory.type === "photo" || Boolean(memory.thumbnail);

  const isVideo = memory.type === "video";

  const isAudio = memory.type === "audio";

  const canPreviewFile = Boolean(memory.fileData);

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEditSave = async (updatedMemory: Memory) => {
    setToast(null);

    try {
      const result = await updateMemory(updatedMemory.id, {
        title: updatedMemory.title,
        description: updatedMemory.description,
        date: updatedMemory.date,
        category: updatedMemory.category,
        people: updatedMemory.people,
        type: updatedMemory.type,
        fileName: updatedMemory.fileName,
        size: updatedMemory.size,
        thumbnail: updatedMemory.thumbnail,
        fileData: updatedMemory.fileData,
        isTimeCapsule: updatedMemory.isTimeCapsule,
        unlockDate: updatedMemory.unlockDate,
        aiReflectionSummary: updatedMemory.aiReflectionSummary,
        emotionalTone: updatedMemory.emotionalTone,
      });

      if (result) {
        setMemory(result);

        setShowEditModal(false);

        setToast({
          type: "success",
          message: "Memory updated successfully.",
        });
      } else {
        setToast({
          type: "error",
          message: "Unable to update this memory.",
        });
      }
    } catch (error) {
      console.error("Unable to update memory:", error);

      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while updating the memory.",
      });
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async () => {
    setDeleting(true);
    setToast(null);

    try {
      await deleteMemory(memory.id);

      setShowDeleteConfirm(false);

      setToast({
        type: "success",
        message: "Memory deleted successfully.",
      });

      /*
       * Give the toast a moment to appear
       * before navigating away.
       */
      window.setTimeout(() => {
        navigate("/app/vault");
      }, 700);
    } catch (error) {
      console.error("Unable to delete memory:", error);

      setDeleting(false);

      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete this memory.",
      });
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="memory-details-page">
      <div className="memory-details-container">
        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="memory-details-topbar">
          <button
            type="button"
            className="memory-details-back-button"
            onClick={() => navigate("/app/vault")}
          >
            <ArrowLeft size={18} />
            Memory Vault
          </button>

          <div className="memory-details-actions">
            <button
              type="button"
              className="memory-details-edit-button"
              onClick={() => setShowEditModal(true)}
            >
              <Pencil size={16} />
              Edit
            </button>

            <button
              type="button"
              className="memory-details-delete-button"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </header>

        {/* =================================================
            MAIN
        ================================================= */}

        <div className="memory-details-layout">
          {/* =================================================
              MEDIA
          ================================================= */}

          <section className="memory-details-media-panel">
            {memory.thumbnail && isImage ? (
              <img
                src={memory.thumbnail}
                alt={memory.title}
                className="memory-details-image"
              />
            ) : memory.fileData && isVideo ? (
              <video
                src={memory.fileData}
                className="memory-details-video"
                controls
              />
            ) : memory.fileData && isAudio ? (
              <div className="memory-details-audio">
                <FileAudio size={48} />

                <audio src={memory.fileData} controls />
              </div>
            ) : (
              <div className="memory-details-file-placeholder">
                <Icon size={50} />

                <strong>{getMemoryTypeLabel(memory.type)}</strong>

                <span>{memory.fileName || "Memory file"}</span>

                {canPreviewFile && (
                  <a href={memory.fileData} target="_blank" rel="noreferrer">
                    Open file
                  </a>
                )}
              </div>
            )}
          </section>

          {/* =================================================
              DETAILS
          ================================================= */}

          <section className="memory-details-content">
            <div className="memory-details-type">
              <Icon size={15} />

              {getMemoryTypeLabel(memory.type)}

              {memory.isTimeCapsule && (
                <span>
                  <Clock3 size={13} />
                  Time capsule
                </span>
              )}
            </div>

            <h1>{memory.title || "Untitled memory"}</h1>

            <div className="memory-details-date">
              <CalendarDays size={16} />

              <span>{formatDate(memory.date || memory.memoryDate)}</span>
            </div>

            {/* DESCRIPTION */}

            {memory.description && (
              <div className="memory-details-description">
                <h2>About this memory</h2>

                <p>{memory.description}</p>
              </div>
            )}

            {/* INFORMATION */}

            <div className="memory-details-information">
              <div className="memory-details-information-item">
                <span>Category</span>

                <strong>{memory.category || "Memories"}</strong>
              </div>

              <div className="memory-details-information-item">
                <span>File</span>

                <strong title={memory.fileName}>
                  {memory.fileName || "Memory"}
                </strong>
              </div>

              {memory.size && (
                <div className="memory-details-information-item">
                  <span>Size</span>

                  <strong>{memory.size}</strong>
                </div>
              )}

              {memory.people.length > 0 && (
                <div className="memory-details-information-item memory-details-people">
                  <span>People</span>

                  <div>
                    {memory.people.map((person) => (
                      <span key={person}>{person}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI REFLECTION */}

            {(memory.aiReflectionSummary ||
              memory.aiReflection ||
              memory.emotionalTone) && (
              <section className="memory-details-ai-section">
                <div className="memory-details-ai-heading">
                  <div className="memory-details-ai-icon">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <h2>AI Reflection</h2>

                    <p>A reflection connected to this memory.</p>
                  </div>
                </div>

                {memory.aiReflectionSummary && (
                  <p className="memory-details-ai-summary">
                    {memory.aiReflectionSummary}
                  </p>
                )}

                {memory.aiReflection && (
                  <p className="memory-details-ai-reflection">
                    {memory.aiReflection}
                  </p>
                )}

                {memory.emotionalTone && (
                  <div className="memory-details-emotion">
                    <span>Emotional tone</span>

                    <strong>{memory.emotionalTone}</strong>
                  </div>
                )}
              </section>
            )}

            {/* TIME CAPSULE */}

            {memory.isTimeCapsule && (
              <section className="memory-details-capsule">
                <div className="memory-details-capsule-icon">
                  <Clock3 size={18} />
                </div>

                <div>
                  <h2>Time Capsule</h2>

                  <p>This memory is intended to be opened in the future.</p>

                  {memory.unlockDate && (
                    <strong>Unlocks on {formatDate(memory.unlockDate)}</strong>
                  )}
                </div>
              </section>
            )}

            {/* METADATA */}

            <div className="memory-details-metadata">
              {memory.createdAt && (
                <span>Created {formatDate(memory.createdAt)}</span>
              )}

              {memory.updatedAt && (
                <span>Updated {formatDate(memory.updatedAt)}</span>
              )}

              {memory.backendId && <span>Memory ID #{memory.backendId}</span>}
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {showDeleteConfirm && (
        <div
          className="memory-details-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowDeleteConfirm(false);
            }
          }}
        >
          <div
            className="memory-details-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-memory-title"
          >
            <div className="memory-details-dialog-icon">
              <Trash2 size={21} />
            </div>

            <h2 id="delete-memory-title">Delete this memory?</h2>

            <p>
              This will remove the memory from your current EchoLife vault. This
              action cannot be undone from the frontend.
            </p>

            <div className="memory-details-dialog-actions">
              <button
                type="button"
                className="memory-details-dialog-cancel"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="memory-details-dialog-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 size={17} className="memory-details-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT MEMORY
      ===================================================== */}

      {showEditModal && (
        <EditMemoryModal
          memory={memory}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <div
          className={`memory-details-toast ${
            toast.type === "success"
              ? "memory-details-toast-success"
              : "memory-details-toast-error"
          }`}
          role="status"
        >
          <div className="memory-details-toast-content">
            <strong>{toast.type === "success" ? "Success" : "Error"}</strong>

            <span>{toast.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
