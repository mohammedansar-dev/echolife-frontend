import {
  FileAudio,
  FileText,
  Image as ImageIcon,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

import type { OnboardingData } from "../onboarding.types";

interface FirstMemoryStepProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "application/pdf",
  "text/plain",
];

function getFileIcon(type: string) {
  if (type.startsWith("image/")) {
    return ImageIcon;
  }

  if (type.startsWith("video/")) {
    return Video;
  }

  if (type.startsWith("audio/")) {
    return FileAudio;
  }

  return FileText;
}

function getFileTypeLabel(type: string) {
  if (type.startsWith("image/")) {
    return "Photo";
  }

  if (type.startsWith("video/")) {
    return "Video";
  }

  if (type.startsWith("audio/")) {
    return "Audio";
  }

  return "Document";
}

function FirstMemoryStep({
  data,
  onChange,
  onNext,
  onBack,
}: FirstMemoryStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const selectedFile = data.firstMemory;

  const handleFile = (file?: File) => {
    if (!file) return;

    setError("");

    if (!allowedTypes.includes(file.type)) {
      setError(
        "This file type is not supported. Please choose a photo, video, audio file, PDF, or text document.",
      );

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "This file is larger than 100 MB. Please choose a smaller file.",
      );

      return;
    }

    onChange({
      firstMemory: {
        fileName: file.name,
        fileType: file.type,
      },
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    handleFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    handleFile(file);
  };

  const removeFile = () => {
    onChange({
      firstMemory: undefined,
    });

    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      {/* Header */}
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Upload size={21} />
        </div>

        <p className="mt-5 text-sm font-semibold text-blue-600">
          Your first memory
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Add something meaningful.
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Start your EchoLife space with a photo, video, audio recording, or
          document. You can always add more memories later.
        </p>
      </div>

      {/* Upload area */}
      {!selectedFile ? (
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="mt-8 cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={[
              "image/*",
              "video/*",
              "audio/*",
              "application/pdf",
              "text/plain",
            ].join(",")}
            onChange={handleInputChange}
          />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
            <Upload size={25} />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-slate-800">
            Drop your memory here
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            or click to browse from your device
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-500">
              Photos
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-500">
              Videos
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-500">
              Audio
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-500">
              Documents
            </span>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            Maximum file size: 100 MB
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = getFileIcon(selectedFile.fileType);

              return (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Icon size={21} />
                </div>
              );
            })()}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {selectedFile.fileName}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {getFileTypeLabel(selectedFile.fileType)}
              </p>
            </div>

            <button
              type="button"
              onClick={removeFile}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              aria-label="Remove selected memory"
            >
              <X size={17} />
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-blue-50 px-3 py-2.5 text-xs text-blue-700">
            Your memory is ready to be added to EchoLife.
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            Skip for now
          </button>

          {selectedFile && (
            <button
              type="button"
              onClick={onNext}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FirstMemoryStep;
