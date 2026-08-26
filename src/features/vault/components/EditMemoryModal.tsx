import { CalendarDays, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { Memory } from "../memory.types";

interface EditMemoryModalProps {
  memory: Memory | null;
  onClose: () => void;
  onSave: (memory: Memory) => void | Promise<void>;
  saving?: boolean;
}

const categories = [
  "Family",
  "Travel",
  "Celebration",
  "Childhood",
  "Personal",
  "Milestone",
  "Other",
];

function EditMemoryModal({
  memory,
  onClose,
  onSave,
  saving = false,
}: EditMemoryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Family");
  const [people, setPeople] = useState("");
  const [emotionalTone, setEmotionalTone] = useState("");

  useEffect(() => {
    if (!memory) {
      return;
    }

    setTitle(memory.title ?? "");
    setDescription(memory.description ?? "");
    setDate(memory.date || memory.memoryDate || "");
    setCategory(memory.category || "Other");
    setPeople(memory.people?.join(", ") ?? "");
    setEmotionalTone(memory.emotionalTone ?? "");
  }, [memory]);

  if (!memory) {
    return null;
  }

  const handleSave = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const updatedMemory: Memory = {
      ...memory,

      title: trimmedTitle,

      description: description.trim(),

      date,

      memoryDate: date,

      category: category.trim() || "Other",

      people: people
        .split(",")
        .map((person) => person.trim())
        .filter(Boolean),

      emotionalTone: emotionalTone.trim(),
    };

    await onSave(updatedMemory);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-memory-dialog-title"
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
              Memory Vault
            </p>

            <h2
              id="edit-memory-dialog-title"
              className="mt-1 text-xl font-semibold text-slate-900"
            >
              Edit memory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the details of this memory.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close edit memory"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="max-h-[68vh] space-y-5 overflow-y-auto p-6">
          {/* Title */}
          <div>
            <label
              htmlFor="edit-memory-title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Memory title
            </label>

            <input
              id="edit-memory-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Give this memory a meaningful title"
              maxLength={150}
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
            />

            <div className="mt-1 text-right text-[11px] text-slate-400">
              {title.length}/150
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-memory-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="edit-memory-description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add details about this memory..."
              maxLength={1000}
              disabled={saving}
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
            />

            <div className="mt-1 text-right text-[11px] text-slate-400">
              {description.length}/1000
            </div>
          </div>

          {/* Date + Category */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-memory-date"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Memory date
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="edit-memory-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-memory-category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <select
                id="edit-memory-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                disabled={saving}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

                {!categories.includes(category) && category && (
                  <option value={category}>{category}</option>
                )}
              </select>
            </div>
          </div>

          {/* People */}
          <div>
            <label
              htmlFor="edit-memory-people"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              People
            </label>

            <input
              id="edit-memory-people"
              type="text"
              value={people}
              onChange={(event) => setPeople(event.target.value)}
              placeholder="Dad, Mom, Sara"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Separate multiple people with commas.
            </p>
          </div>

          {/* Emotional tone */}
          <div>
            <label
              htmlFor="edit-memory-emotional-tone"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Emotional tone
            </label>

            <input
              id="edit-memory-emotional-tone"
              type="text"
              value={emotionalTone}
              onChange={(event) => setEmotionalTone(event.target.value)}
              placeholder="e.g. Happy, Nostalgic, Peaceful"
              maxLength={80}
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />

            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditMemoryModal;
