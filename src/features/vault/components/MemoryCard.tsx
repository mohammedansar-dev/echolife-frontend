import { FileAudio, FileText, MoreHorizontal, Play, Video } from "lucide-react";

import type { Memory } from "../memory.types";

interface MemoryCardProps {
  memory: Memory;
  view: "grid" | "list";
  onClick: (memory: Memory) => void;
}

function MemoryCard({ memory, view, onClick }: MemoryCardProps) {
  const formattedDate = new Date(memory.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const getTypeLabel = () => {
    switch (memory.type) {
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
  };

  const getIcon = () => {
    switch (memory.type) {
      case "video":
        return Video;

      case "audio":
        return FileAudio;

      case "document":
        return FileText;

      default:
        return null;
    }
  };

  const Icon = getIcon();

  if (view === "list") {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(memory)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick(memory);
          }
        }}
        className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {/* Preview */}
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
          {memory.thumbnail ? (
            <img
              src={memory.thumbnail}
              alt={memory.title}
              className="h-full w-full object-cover"
            />
          ) : Icon ? (
            <Icon size={25} className="text-slate-400" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-600">
              <span className="text-xs font-semibold">IMG</span>
            </div>
          )}

          {memory.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow-sm">
                <Play size={13} fill="currentColor" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-800">
              {memory.title}
            </h3>

            <span className="hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 sm:inline-block">
              {getTypeLabel()}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-slate-500">
            {memory.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span>{formattedDate}</span>

            <span>{memory.category}</span>

            <span>{memory.size}</span>
          </div>
        </div>

        {/* Menu */}
        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={`More options for ${memory.title}`}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(memory)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(memory);
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {/* Preview */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {memory.thumbnail ? (
          <img
            src={memory.thumbnail}
            alt={memory.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {Icon ? (
              <Icon size={38} className="text-slate-300" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <span className="text-xs font-bold">PHOTO</span>
              </div>
            )}
          </div>
        )}

        {/* Video play */}
        {memory.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow-lg">
              <Play size={18} fill="currentColor" />
            </div>
          </div>
        )}

        {/* Type badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-sm backdrop-blur">
          {getTypeLabel()}
        </span>

        {/* Menu */}
        <button
          type="button"
          className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-slate-500 opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 hover:bg-white hover:text-slate-800"
          aria-label={`More options for ${memory.title}`}
        >
          <MoreHorizontal size={17} />
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-slate-800">
          {memory.title}
        </h3>

        <p className="mt-1 truncate text-xs text-slate-500">
          {memory.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="truncate text-[11px] text-slate-400">
            {formattedDate}
          </span>

          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
            {memory.category}
          </span>
        </div>

        {memory.people.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex -space-x-1">
              {memory.people.slice(0, 3).map((person, index) => (
                <div
                  key={`${person}-${index}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-[9px] font-semibold text-blue-700"
                  title={person}
                >
                  {person.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>

            <span className="truncate text-[10px] text-slate-400">
              {memory.people.join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryCard;
