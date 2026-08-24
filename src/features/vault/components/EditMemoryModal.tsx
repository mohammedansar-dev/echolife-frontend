import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { Memory } from "../memory.types";

interface EditMemoryModalProps {
  memory: Memory | null;
  onClose: () => void;
  onSave: (memory: Memory) => void;
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

function EditMemoryModal({ memory, onClose, onSave }: EditMemoryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Family");
  const [people, setPeople] = useState("");

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

  if (!memory) {
    return null;
  }

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    const updatedMemory: Memory = {
      ...memory,
      title: title.trim(),
      description: description.trim(),
      date,
      category,
      people: people
        .split(",")
        .map((person) => person.trim())
        .filter(Boolean),
    };

    onSave(updatedMemory);
  };

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-memory-title"
        className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-medium text-blue-600">Memory Vault</p>

            <h2
              id="edit-memory-title"
              className="mt-0.5 text-lg font-semibold text-slate-900"
            >
              Edit memory
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close edit dialog"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <div className="max-h-[65vh] space-y-5 overflow-y-auto p-5">
          <div>
            <label
              htmlFor="edit-memory-title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Memory title
            </label>

            <input
              id="edit-memory-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="edit-memory-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="edit-memory-description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-memory-date"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Memory date
              </label>

              <input
                id="edit-memory-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="edit-memory-category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <select
                id="edit-memory-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-memory-people"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              People
            </label>

            <input
              id="edit-memory-people"
              type="text"
              value={people}
              onChange={(event) => setPeople(event.target.value)}
              placeholder="Dad, Mom, Sara"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1.5 text-[11px] text-slate-400">
              Separate multiple people with commas.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditMemoryModal;
