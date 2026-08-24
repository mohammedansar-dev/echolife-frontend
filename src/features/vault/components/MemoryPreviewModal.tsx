import {
  CalendarDays,
  FileAudio,
  FileText,
  HardDrive,
  Image as ImageIcon,
  Tag,
  UserRound,
  Video,
  X,
} from "lucide-react";

import type { Memory } from "../memory.types";

interface MemoryPreviewModalProps {
  memory: Memory | null;
  onClose: () => void;
  onEdit: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
}

function MemoryPreviewModal({
  memory,
  onClose,
  onEdit,
  onDelete,
}: MemoryPreviewModalProps) {
  if (!memory) {
    return null;
  }

  const formattedDate = new Date(memory.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const getIcon = () => {
    switch (memory.type) {
      case "photo":
        return ImageIcon;

      case "video":
        return Video;

      case "audio":
        return FileAudio;

      default:
        return FileText;
    }
  };

  const Icon = getIcon();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="memory-preview-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-600">Memory preview</p>

            <h2
              id="memory-preview-title"
              className="mt-0.5 truncate text-lg font-semibold text-slate-900"
            >
              {memory.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close memory preview"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto">
          {/* Preview area */}
          <div className="flex min-h-[260px] items-center justify-center bg-slate-50 p-6 sm:min-h-[340px]">
            {memory.thumbnail ? (
              <img
                src={memory.thumbnail}
                alt={memory.title}
                className="max-h-[320px] max-w-full rounded-xl object-contain shadow-sm"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <Icon size={34} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  {memory.type === "photo"
                    ? "Photo preview"
                    : `${memory.type.charAt(0).toUpperCase()}${memory.type.slice(1)} preview`}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Media preview will be connected to storage later.
                </p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-slate-900">
                  {memory.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {memory.description}
                </p>
              </div>

              <span className="shrink-0 self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                {memory.category}
              </span>
            </div>

            {/* Information */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays size={16} />

                  <span className="text-xs font-medium">Memory date</span>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {formattedDate}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Tag size={16} />

                  <span className="text-xs font-medium">Category</span>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {memory.category}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <HardDrive size={16} />

                  <span className="text-xs font-medium">File</span>
                </div>

                <p className="mt-2 truncate text-sm font-semibold text-slate-800">
                  {memory.fileName}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">{memory.size}</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <UserRound size={16} />

                  <span className="text-xs font-medium">People</span>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {memory.people.length > 0
                    ? memory.people.join(", ")
                    : "No people added"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => onEdit(memory)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Edit memory
              </button>

              <button
                type="button"
                onClick={() => onDelete(memory)}
                className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Delete memory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoryPreviewModal;
