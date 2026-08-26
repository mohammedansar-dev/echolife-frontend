import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileAudio,
  FileText,
  FileVideo,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import { useMemory } from "../MemoryContext";
import type { CreateMemoryInput, MemoryType } from "../memory.types";

import "./UploadMemoryPage.css";

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/* =========================================================
   HELPERS
========================================================= */

function getMemoryType(file: File): MemoryType {
  if (file.type.startsWith("image/")) {
    return "photo";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  if (file.type.startsWith("audio/")) {
    return "audio";
  }

  return "document";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getFileIcon(type: MemoryType) {
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

function getDefaultTitle(file: File | null): string {
  if (!file) {
    return "";
  }

  const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

  return nameWithoutExtension;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/* =========================================================
   PAGE
========================================================= */

export default function UploadMemoryPage() {
  const navigate = useNavigate();

  const { addMemory, loading, error, clearError } = useMemory();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [memoryDate, setMemoryDate] = useState(getToday());

  const [category, setCategory] = useState("Memories");

  const [emotionalTone, setEmotionalTone] = useState("");

  const [isTimeCapsule, setIsTimeCapsule] = useState(false);

  const [unlockDate, setUnlockDate] = useState("");

  const [dragActive, setDragActive] = useState(false);

  const [validationError, setValidationError] = useState("");

  const [success, setSuccess] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /* =======================================================
     FILE PREVIEW
  ======================================================= */

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  /* =======================================================
     SELECT FILE
  ======================================================= */

  const processFile = (file: File) => {
    setValidationError("");
    clearError();
    setSuccess(false);

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setValidationError(
        "This file type is not supported. Please select a photo, video, audio file, PDF, Word document, or text file.",
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError("The selected file is larger than 50 MB.");
      return;
    }

    setSelectedFile(file);

    if (!title.trim()) {
      setTitle(getDefaultTitle(file));
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      processFile(file);
    }

    event.target.value = "";
  };

  /* =======================================================
     DRAG AND DROP
  ======================================================= */

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  /* =======================================================
     REMOVE FILE
  ======================================================= */

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError("");
    setSuccess(false);
  };

  /* =======================================================
     FILE INFORMATION
  ======================================================= */

  const selectedFileType = selectedFile ? getMemoryType(selectedFile) : null;

  const SelectedFileIcon = selectedFileType
    ? getFileIcon(selectedFileType)
    : Upload;


  const isVideo = selectedFile?.type.startsWith("video/") ?? false;

  const isAudio = selectedFile?.type.startsWith("audio/") ?? false;

  /* =======================================================
     FORM VALIDATION
  ======================================================= */

  const validationMessage = useMemo(() => {
    if (!selectedFile) {
      return "Select a file to continue.";
    }

    if (!title.trim()) {
      return "Enter a title for your memory.";
    }

    if (!memoryDate) {
      return "Select the memory date.";
    }

    if (isTimeCapsule && !unlockDate) {
      return "Select an unlock date for the time capsule.";
    }

    if (isTimeCapsule && unlockDate && unlockDate < memoryDate) {
      return "The unlock date cannot be earlier than the memory date.";
    }

    return "";
  }, [selectedFile, title, memoryDate, isTimeCapsule, unlockDate]);

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValidationError("");
    clearError();
    setSuccess(false);

    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    if (!selectedFile) {
      return;
    }

    const type = getMemoryType(selectedFile);

    const input: CreateMemoryInput = {
      title: title.trim() || getDefaultTitle(selectedFile),

      description: description.trim(),

      date: memoryDate,

      category: category.trim() || "Memories",

      people: [],

      type,

      fileName: selectedFile.name,

      size: formatFileSize(selectedFile.size),

      thumbnail: previewUrl ?? undefined,

      file: selectedFile,

      isTimeCapsule,

      unlockDate: isTimeCapsule ? unlockDate : null,

      aiReflectionSummary: "",

      emotionalTone: emotionalTone.trim(),
    };

    const created = await addMemory(input);

    if (!created) {
      return;
    }

    setSuccess(true);

    /*
     * Give the success state enough time to be visible,
     * then open the newly-created memory.
     */
    window.setTimeout(() => {
      navigate(`/vault/memory/${created.id}`);
    }, 650);
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = () => {
    navigate("/vault");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="upload-memory-page">
      <div className="upload-memory-container">
        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="upload-memory-topbar">
          <button
            type="button"
            className="upload-memory-back-button"
            onClick={handleCancel}
          >
            <ArrowLeft size={18} />
            Back to Memory Vault
          </button>

          <div className="upload-memory-heading">
            <span>Memory Vault</span>

            <h1>Add a Memory</h1>

            <p>Preserve a moment that matters to you.</p>
          </div>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form className="upload-memory-layout" onSubmit={handleSubmit}>
          {/* =================================================
              LEFT — FILE
          ================================================= */}

          <section className="upload-memory-panel">
            <div className="upload-memory-panel-heading">
              <div>
                <h2>Memory file</h2>

                <p>Upload a photo, video, audio recording, or document.</p>
              </div>

              <span className="upload-memory-required">Required</span>
            </div>

            {!selectedFile ? (
              <div
                className={
                  dragActive
                    ? "upload-memory-dropzone active"
                    : "upload-memory-dropzone"
                }
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();

                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="upload-memory-drop-icon">
                  <Upload size={28} />
                </div>

                <h3>Drop your file here</h3>

                <p>or click to browse</p>

                <span>Maximum file size: 50 MB</span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES.join(",")}
                  onChange={handleFileChange}
                  hidden
                />
              </div>
            ) : (
              <div className="upload-memory-selected-file">
                <div className="upload-memory-preview">
                  {previewUrl ? (
                    <img src={previewUrl} alt={selectedFile.name} />
                  ) : isVideo ? (
                    <video src={URL.createObjectURL(selectedFile)} controls />
                  ) : isAudio ? (
                    <div className="upload-memory-audio-preview">
                      <FileAudio size={36} />

                      <audio src={URL.createObjectURL(selectedFile)} controls />
                    </div>
                  ) : (
                    <div className="upload-memory-file-preview">
                      <SelectedFileIcon size={38} />

                      <span>{selectedFileType?.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="upload-memory-file-details">
                  <strong title={selectedFile.name}>{selectedFile.name}</strong>

                  <span>{formatFileSize(selectedFile.size)}</span>

                  <span>{selectedFileType ? selectedFileType : "file"}</span>
                </div>

                <button
                  type="button"
                  className="upload-memory-remove-file"
                  onClick={removeFile}
                  aria-label="Remove selected file"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="upload-memory-file-note">
              <span>Supported formats</span>

              <p>
                JPG, PNG, WEBP, GIF, MP4, WEBM, MP3, WAV, OGG, PDF, DOC, DOCX,
                TXT
              </p>
            </div>
          </section>

          {/* =================================================
              RIGHT — DETAILS
          ================================================= */}

          <section className="upload-memory-panel">
            <div className="upload-memory-panel-heading">
              <div>
                <h2>Memory details</h2>

                <p>Add context to help preserve the story.</p>
              </div>
            </div>

            {/* TITLE */}

            <div className="upload-memory-field">
              <label htmlFor="memory-title">
                Title
                <span>*</span>
              </label>

              <input
                id="memory-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give this memory a meaningful title"
                maxLength={150}
              />

              <div className="upload-memory-character-count">
                {title.length}/150
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="upload-memory-field">
              <label htmlFor="memory-description">Description</label>

              <textarea
                id="memory-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What happened? Add a few details about this memory..."
                rows={5}
                maxLength={1000}
              />

              <div className="upload-memory-character-count">
                {description.length}
                /1000
              </div>
            </div>

            {/* DATE */}

            <div className="upload-memory-two-columns">
              <div className="upload-memory-field">
                <label htmlFor="memory-date">
                  Memory date
                  <span>*</span>
                </label>

                <div className="upload-memory-input-icon">
                  <CalendarDays size={17} />

                  <input
                    id="memory-date"
                    type="date"
                    value={memoryDate}
                    onChange={(event) => setMemoryDate(event.target.value)}
                  />
                </div>
              </div>

              {/* CATEGORY */}

              <div className="upload-memory-field">
                <label htmlFor="memory-category">Category</label>

                <input
                  id="memory-category"
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="e.g. Family, Travel, Celebration"
                  maxLength={60}
                />
              </div>
            </div>

            {/* EMOTIONAL TONE */}

            <div className="upload-memory-field">
              <label htmlFor="emotional-tone">Emotional tone</label>

              <input
                id="emotional-tone"
                type="text"
                value={emotionalTone}
                onChange={(event) => setEmotionalTone(event.target.value)}
                placeholder="e.g. Happy, Nostalgic, Peaceful"
                maxLength={80}
              />
            </div>

            {/* TIME CAPSULE */}

            <div className="upload-memory-capsule-section">
              <label className="upload-memory-checkbox-row">
                <input
                  type="checkbox"
                  checked={isTimeCapsule}
                  onChange={(event) => {
                    setIsTimeCapsule(event.target.checked);

                    if (!event.target.checked) {
                      setUnlockDate("");
                    }
                  }}
                />

                <span className="upload-memory-checkbox-custom" />

                <span>
                  <strong>Make this a time capsule</strong>

                  <small>Keep this memory locked until a future date.</small>
                </span>
              </label>

              {isTimeCapsule && (
                <div className="upload-memory-field upload-memory-unlock-field">
                  <label htmlFor="unlock-date">
                    Unlock date
                    <span>*</span>
                  </label>

                  <div className="upload-memory-input-icon">
                    <CalendarDays size={17} />

                    <input
                      id="unlock-date"
                      type="date"
                      value={unlockDate}
                      min={memoryDate}
                      onChange={(event) => setUnlockDate(event.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ERROR */}

            {(validationError || error) && (
              <div className="upload-memory-error">
                <strong>Unable to create memory</strong>

                <p>{validationError || error}</p>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="upload-memory-success">
                <CheckCircle2 size={19} />

                <div>
                  <strong>Memory created successfully</strong>

                  <span>Opening your memory...</span>
                </div>
              </div>
            )}

            {/* ACTIONS */}

            <div className="upload-memory-actions">
              <button
                type="button"
                className="upload-memory-cancel-button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="upload-memory-submit-button"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="upload-memory-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Save Memory
                  </>
                )}
              </button>
            </div>
          </section>
        </form>

        {/* =================================================
            BACKEND NOTE
        ================================================= */}

        <div className="upload-memory-integration-note">
          <strong>EchoLife Memory</strong>

          <span>
            Your memory details are saved through the connected EchoLife
            backend.
          </span>
        </div>
      </div>
    </main>
  );
}
