import { ArrowLeft, Brain, Check, Save, ShieldCheck } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useMemory } from "../vault/MemoryContext";

import { usePersona } from "./PersonaContext";

import type { PersonaConfiguration } from "./PersonaAPI";

import "./PersonaConfigurePage.css";

const TONES = [
  {
    value: "Warm",
    description: "Caring, personal and supportive.",
  },
  {
    value: "Calm",
    description: "Peaceful, reassuring and thoughtful.",
  },
  {
    value: "Friendly",
    description: "Natural, approachable and conversational.",
  },
  {
    value: "Professional",
    description: "Clear, structured and focused.",
  },
  {
    value: "Reflective",
    description: "Thoughtful, meaningful and introspective.",
  },
];

function PersonaConfigurePage() {
  const navigate = useNavigate();

  const { configuration, hydrated, saving, error, saveConfiguration } =
    usePersona();

  const { memories } = useMemory();

  const [name, setName] = useState("");

  const [tone, setTone] = useState("Warm");

  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!configuration) {
      return;
    }

    setName(configuration.name);

    setTone(configuration.tone);

    setSelectedMemoryIds(configuration.selectedMemoryIds);
  }, [configuration]);

  const toggleMemory = (memoryId: string) => {
    setSelectedMemoryIds((current) =>
      current.includes(memoryId)
        ? current.filter((id) => id !== memoryId)
        : [...current, memoryId],
    );
  };

  const handleSave = async () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setFormError("Please enter a Persona name.");

      return;
    }

    setFormError("");

    const data: PersonaConfiguration = {
      name: trimmed,
      tone,
      selectedMemoryIds,
    };

    try {
      await saveConfiguration(data);

      navigate("/app/persona");
    } catch {
      // Error shown by Context.
    }
  };

  if (!hydrated) {
    return (
      <main className="persona-config-page">
        <div className="persona-config-loading">
          <div className="persona-config-loader" />

          <h2>Loading configuration</h2>

          <p>Preparing your Persona settings.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="persona-config-page">
      {/* HEADER */}

      <header className="persona-config-header">
        <button
          type="button"
          className="persona-config-back"
          onClick={() => navigate("/app/persona")}
        >
          <ArrowLeft size={16} />
          Persona
        </button>

        <div className="persona-config-title">
          <div className="persona-config-title-icon">
            <Brain size={22} />
          </div>

          <div>
            <span>PERSONAL AI</span>

            <h1>Configure your Persona</h1>

            <p>
              Define how your Persona should communicate and which memories it
              can access.
            </p>
          </div>
        </div>
      </header>

      {(formError || error) && (
        <div className="persona-config-error">{formError || error}</div>
      )}

      {/* IDENTITY */}

      <section className="persona-config-card">
        <div className="persona-config-section-title">
          <span>01</span>

          <div>
            <h2>Persona identity</h2>

            <p>Choose a name for your personal AI.</p>
          </div>
        </div>

        <label>
          Persona name
          <input
            value={name}
            maxLength={80}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter a name"
          />
          <small>Example: Echo, Memory Companion, Family Guide</small>
        </label>
      </section>

      {/* TONE */}

      <section className="persona-config-card">
        <div className="persona-config-section-title">
          <span>02</span>

          <div>
            <h2>Communication style</h2>

            <p>Select the tone your Persona should use.</p>
          </div>
        </div>

        <div className="persona-tone-grid">
          {TONES.map((item) => {
            const active = tone === item.value;

            return (
              <button
                type="button"
                key={item.value}
                className={`persona-tone ${active ? "active" : ""}`}
                onClick={() => setTone(item.value)}
              >
                <div>
                  <strong>{item.value}</strong>

                  <p>{item.description}</p>
                </div>

                <span className="persona-tone-radio">
                  {active && <Check size={12} />}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* MEMORIES */}

      <section className="persona-config-card">
        <div className="persona-config-section-title">
          <span>03</span>

          <div>
            <h2>Memory access</h2>

            <p>Choose which memories can provide context to your Persona.</p>
          </div>
        </div>

        <div className="persona-memory-security">
          <ShieldCheck size={17} />

          <div>
            <strong>Private memory connection</strong>

            <p>
              Only the memories you select will be included in Persona requests.
            </p>
          </div>
        </div>

        {memories.length === 0 ? (
          <div className="persona-config-no-memory">
            <Brain size={20} />

            <div>
              <strong>Your Memory Vault is empty</strong>

              <p>Add memories to your vault before connecting them here.</p>
            </div>
          </div>
        ) : (
          <div className="persona-memory-options">
            {memories.map((memory) => {
              const active = selectedMemoryIds.includes(memory.id);

              return (
                <button
                  type="button"
                  key={memory.id}
                  className={`persona-memory-option ${active ? "active" : ""}`}
                  onClick={() => toggleMemory(memory.id)}
                >
                  <div className="persona-memory-option-icon">
                    <Brain size={16} />
                  </div>

                  <div className="persona-memory-option-info">
                    <strong>{memory.title}</strong>

                    <span>
                      {memory.category}
                      {" · "}
                      {memory.type}
                    </span>
                  </div>

                  <span className="persona-memory-check">
                    {active && <Check size={12} />}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="persona-memory-count">
          {selectedMemoryIds.length}{" "}
          {selectedMemoryIds.length === 1 ? "memory" : "memories"} selected
        </div>
      </section>

      {/* ACTIONS */}

      <footer className="persona-config-actions">
        <button
          type="button"
          className="persona-config-cancel"
          disabled={saving}
          onClick={() => navigate("/app/persona")}
        >
          Cancel
        </button>

        <button
          type="button"
          className="persona-config-save"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? (
            <>
              <span className="persona-button-loader" />
              Saving...
            </>
          ) : (
            <>
              <Save size={15} />
              Save Persona
            </>
          )}
        </button>
      </footer>
    </main>
  );
}

export default PersonaConfigurePage;
