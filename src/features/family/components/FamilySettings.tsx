import { Check, Save, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { useFamily } from "../FamilyContext";

function FamilySettings() {
  const { family, updateFamilySettings } = useFamily();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [nameError, setNameError] = useState("");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(family?.name ?? "");
    setDescription(family?.description ?? "");
  }, [family]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setNameError("Family name is required.");
      return;
    }

    if (cleanName.length < 2) {
      setNameError("Family name must contain at least 2 characters.");
      return;
    }

    setNameError("");

    updateFamilySettings({
      name: cleanName,
      description: description.trim(),
    });

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}

      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users size={19} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Family settings
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Manage the basic information for your EchoLife family space.
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit} className="p-5">
        {/* FAMILY NAME */}

        <div>
          <label
            htmlFor="family-name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Family name
          </label>

          <input
            id="family-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);

              if (nameError) {
                setNameError("");
              }

              setSaved(false);
            }}
            maxLength={80}
            placeholder="My Family"
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
              nameError
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          <div className="mt-1 flex items-center justify-between">
            {nameError ? (
              <p className="text-xs text-red-600">{nameError}</p>
            ) : (
              <p className="text-xs text-slate-400">
                Choose a name your family will recognize.
              </p>
            )}

            <p className="text-xs text-slate-400">{name.length}/80</p>
          </div>
        </div>

        {/* DESCRIPTION */}

        <div className="mt-5">
          <label
            htmlFor="family-description"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Description
            <span className="ml-1 font-normal text-slate-400">Optional</span>
          </label>

          <textarea
            id="family-description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);

              setSaved(false);
            }}
            maxLength={300}
            rows={4}
            placeholder="A private space for our family memories."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {description.length}/300
          </p>
        </div>

        {/* FOOTER */}

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {saved ? (
              <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                <Check size={17} />
                Changes saved successfully
              </div>
            ) : (
              <p className="text-xs leading-5 text-slate-400">
                Only family administrators should change family settings.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Save size={16} />
            Save changes
          </button>
        </div>
      </form>
    </section>
  );
}

export default FamilySettings;
