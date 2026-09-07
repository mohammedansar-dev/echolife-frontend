import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Music,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Upload,
  UserRound,
  Video,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { useMemory } from "../vault/MemoryContext";
import type { MemoryType } from "../vault/memory.types";
import { usePersona } from "./PersonaContext";
import type { PersonaConfiguration } from "./PersonaAPI";

import "./PersonaConfigurePage.css";

type ExtendedPersonaConfiguration = PersonaConfiguration & {
  relationship?: string;
  description?: string;
  personalityTraits?: string[];
  responseStyle?: string;
};

type ToneOption = {
  value: string;
  title: string;
  description: string;
};

type TraitOption = {
  id: string;
  title: string;
  description: string;
};

const TONES: ToneOption[] = [
  {
    value: "Warm",
    title: "Warm",
    description: "Supportive, caring and emotionally welcoming.",
  },
  {
    value: "Calm",
    title: "Calm",
    description: "Peaceful, patient and reassuring.",
  },
  {
    value: "Friendly",
    title: "Friendly",
    description: "Natural, conversational and approachable.",
  },
  {
    value: "Professional",
    title: "Professional",
    description: "Clear, structured and respectful.",
  },
  {
    value: "Reflective",
    title: "Reflective",
    description: "Thoughtful, meaningful and introspective.",
  },
];

const TRAITS: TraitOption[] = [
  {
    id: "caring",
    title: "Caring",
    description: "Shows empathy and emotional warmth.",
  },
  {
    id: "patient",
    title: "Patient",
    description: "Takes time and avoids rushing responses.",
  },
  {
    id: "encouraging",
    title: "Encouraging",
    description: "Supports and motivates during conversations.",
  },
  {
    id: "thoughtful",
    title: "Thoughtful",
    description: "Responds carefully and considers context.",
  },
  {
    id: "humorous",
    title: "Light-hearted",
    description: "Can use gentle humour when appropriate.",
  },
  {
    id: "reflective",
    title: "Reflective",
    description: "Connects conversations with meaningful memories.",
  },
];

const RELATIONSHIPS = [
  "Myself",
  "Parent",
  "Grandparent",
  "Partner",
  "Sibling",
  "Friend",
  "Family member",
  "Mentor",
  "Other",
];

const MEMORY_FILTERS: Array<{
  value: "all" | MemoryType;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "photo", label: "Photos" },
  { value: "video", label: "Videos" },
  { value: "audio", label: "Audio" },
  { value: "document", label: "Documents" },
];

function getMemoryIcon(type: MemoryType) {
  switch (type) {
    case "photo":
      return ImageIcon;

    case "video":
      return Video;

    case "audio":
      return Music;

    case "document":
    default:
      return FileText;
  }
}

export default function PersonaConfigurePage() {
  const navigate = useNavigate();

  const {
    configuration,
    saveConfiguration,
    resetConfiguration,
    saving,
  } = usePersona();

  const { memories, hydrated: memoriesHydrated } = useMemory();

  const existingConfiguration =
    configuration as ExtendedPersonaConfiguration | null;

  const [name, setName] = useState(
    existingConfiguration?.name ?? "",
  );

  const [relationship, setRelationship] = useState(
    existingConfiguration?.relationship ?? "",
  );

  const [description, setDescription] = useState(
    existingConfiguration?.description ?? "",
  );

  const [tone, setTone] = useState(
    existingConfiguration?.tone ?? "Warm",
  );

  const [selectedTraits, setSelectedTraits] = useState<string[]>(
    existingConfiguration?.personalityTraits ?? [],
  );

  const [responseStyle, setResponseStyle] = useState(
    existingConfiguration?.responseStyle ?? "Natural",
  );

  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>(
    existingConfiguration?.selectedMemoryIds ?? [],
  );

  const [search, setSearch] = useState("");

  const [memoryFilter, setMemoryFilter] = useState<
    "all" | MemoryType
  >("all");

  const [connectedOnly, setConnectedOnly] = useState(false);

  const [personalityOpen, setPersonalityOpen] = useState(true);

  const [memoryOpen, setMemoryOpen] = useState(true);

  const [showResetModal, setShowResetModal] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  /* =========================================================
     MEMORY FILTERING
     ========================================================= */

  const filteredMemories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return memories.filter((memory) => {
      const searchableText = [
        memory.title,
        memory.description ?? "",
        memory.category ?? "",
        memory.fileName ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesType =
        memoryFilter === "all" ||
        memory.type === memoryFilter;

      const matchesConnection =
        !connectedOnly ||
        selectedMemoryIds.includes(memory.id);

      return (
        matchesSearch &&
        matchesType &&
        matchesConnection
      );
    });
  }, [
    memories,
    search,
    memoryFilter,
    connectedOnly,
    selectedMemoryIds,
  ]);

  /* =========================================================
     MEMORY STATISTICS
     ========================================================= */

  const memoryStats = useMemo(
    () => ({
      total: memories.length,
      photos: memories.filter(
        (memory) => memory.type === "photo",
      ).length,
      videos: memories.filter(
        (memory) => memory.type === "video",
      ).length,
      audio: memories.filter(
        (memory) => memory.type === "audio",
      ).length,
      documents: memories.filter(
        (memory) => memory.type === "document",
      ).length,
    }),
    [memories],
  );

  const connectedCount = selectedMemoryIds.length;

  /* =========================================================
     HANDLERS
     ========================================================= */

  const toggleTrait = (traitId: string) => {
    setSelectedTraits((current) =>
      current.includes(traitId)
        ? current.filter((id) => id !== traitId)
        : [...current, traitId],
    );
  };

  const toggleMemory = (memoryId: string) => {
    setSelectedMemoryIds((current) =>
      current.includes(memoryId)
        ? current.filter((id) => id !== memoryId)
        : [...current, memoryId],
    );
  };

  const connectVisible = () => {
    const visibleIds = filteredMemories.map(
      (memory) => memory.id,
    );

    setSelectedMemoryIds((current) =>
      Array.from(
        new Set([...current, ...visibleIds]),
      ),
    );
  };

  const disconnectVisible = () => {
    const visibleIds = new Set(
      filteredMemories.map(
        (memory) => memory.id,
      ),
    );

    setSelectedMemoryIds((current) =>
      current.filter(
        (id) => !visibleIds.has(id),
      ),
    );
  };

  const clearAllMemories = () => {
    setSelectedMemoryIds([]);
  };

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setName(value);

    if (errors.name) {
      setErrors((current) => ({
        ...current,
        name: undefined,
      }));
    }
  };

  const validate = () => {
    const nextErrors: {
      name?: string;
      description?: string;
    } = {};

    if (!name.trim()) {
      nextErrors.name =
        "Please give your Persona a name.";
    }

    if (name.trim().length > 100) {
      nextErrors.name =
        "Persona name should be 100 characters or fewer.";
    }

    if (description.trim().length > 1000) {
      nextErrors.description =
        "Description should be 1000 characters or fewer.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const nextConfiguration = {
      ...(existingConfiguration ?? {}),
      name: name.trim(),
      tone,
      selectedMemoryIds,
      relationship: relationship.trim(),
      description: description.trim(),
      personalityTraits: selectedTraits,
      responseStyle,
    } as PersonaConfiguration;

    await saveConfiguration(nextConfiguration);

    navigate("/app/persona");
  };

  const handleReset = async () => {
    await resetConfiguration();

    setShowResetModal(false);

    navigate("/app/persona");
  };

  return (
    <div className="persona-config-page">
      <form
        className="persona-config-form"
        onSubmit={handleSubmit}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="persona-config-topbar">
          <div className="persona-config-heading-area">
            <Link
              to="/app/persona"
              className="persona-back-link"
            >
              <ArrowLeft size={15} />
              Back to Persona
            </Link>

            <div className="persona-config-title-row">
              <div className="persona-config-title-icon">
                <Sparkles size={20} />
              </div>

              <div>
                <span className="persona-config-kicker">
                  AI PERSONA
                </span>

                <h1>
                  {existingConfiguration
                    ? "Configure your Persona"
                    : "Create your Persona"}
                </h1>

                <p>
                  Define the identity, personality and memories
                  your Persona can use.
                </p>
              </div>
            </div>
          </div>

          <div className="persona-config-top-actions">
            <Link
              to="/app/persona/memories"
              className="persona-outline-button"
            >
              <Brain size={15} />
              Memory Vault
            </Link>

            <Link
              to="/app/persona/memories/upload"
              className="persona-outline-button"
            >
              <Upload size={15} />
              Upload Memory
            </Link>
          </div>
        </header>

        {/* =====================================================
            MAIN LAYOUT
        ===================================================== */}

        <div className="persona-config-layout">
          <main className="persona-config-main">
            {/* =================================================
                IDENTITY
            ================================================= */}

            <section className="persona-section">
              <div className="persona-section-header">
                <div className="persona-section-icon">
                  <UserRound size={17} />
                </div>

                <div className="persona-section-heading">
                  <h2 className="persona-section-title">
                    Persona identity
                  </h2>

                  <p className="persona-section-description">
                    Give your Persona a clear identity and
                    background.
                  </p>
                </div>
              </div>

              <div className="persona-form-grid">
                <div className="persona-field">
                  <div className="persona-label-row">
                    <label
                      htmlFor="persona-name"
                      className="persona-label"
                    >
                      Persona name{" "}
                      <span className="persona-required">
                        *
                      </span>
                    </label>

                    <span className="persona-character-count">
                      {name.length}/100
                    </span>
                  </div>

                  <input
                    id="persona-name"
                    className={`persona-input ${
                      errors.name ? "error" : ""
                    }`}
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Amma, Dad, My Future Self"
                    maxLength={100}
                    autoComplete="off"
                  />

                  {errors.name ? (
                    <div className="persona-field-error">
                      {errors.name}
                    </div>
                  ) : (
                    <div className="persona-field-help">
                      Choose a name that feels natural during
                      conversations.
                    </div>
                  )}
                </div>

                <div className="persona-field">
                  <div className="persona-label-row">
                    <label
                      htmlFor="persona-relationship"
                      className="persona-label"
                    >
                      Relationship
                    </label>
                  </div>

                  <select
                    id="persona-relationship"
                    className="persona-select"
                    value={relationship}
                    onChange={(event) =>
                      setRelationship(
                        event.target.value,
                      )
                    }
                  >
                    <option value="">
                      Select relationship
                    </option>

                    {RELATIONSHIPS.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                  <div className="persona-field-help">
                    Helps establish context for your Persona.
                  </div>
                </div>

                <div className="persona-field full-width">
                  <div className="persona-label-row">
                    <label
                      htmlFor="persona-description"
                      className="persona-label"
                    >
                      About this Persona
                    </label>

                    <span className="persona-character-count">
                      {description.length}/1000
                    </span>
                  </div>

                  <textarea
                    id="persona-description"
                    className={`persona-textarea ${
                      errors.description
                        ? "error"
                        : ""
                    }`}
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    placeholder="Describe who this Persona represents, their background, important qualities, or anything you want the AI to understand..."
                    maxLength={1000}
                    rows={4}
                  />

                  {errors.description ? (
                    <div className="persona-field-error">
                      {errors.description}
                    </div>
                  ) : (
                    <div className="persona-field-help">
                      This gives the Persona additional context
                      beyond its name.
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* =================================================
                PERSONALITY
            ================================================= */}

            <section className="persona-section">
              <button
                type="button"
                className="persona-collapsible-header"
                onClick={() =>
                  setPersonalityOpen(
                    (current) => !current,
                  )
                }
              >
                <div className="persona-section-header">
                  <div className="persona-section-icon">
                    <Sparkles size={17} />
                  </div>

                  <div className="persona-section-heading">
                    <h2 className="persona-section-title">
                      Personality & communication
                    </h2>

                    <p className="persona-section-description">
                      Shape how your Persona speaks and responds.
                    </p>
                  </div>
                </div>

                {personalityOpen ? (
                  <ChevronUp size={17} />
                ) : (
                  <ChevronDown size={17} />
                )}
              </button>

              {personalityOpen && (
                <div className="persona-collapsible-content">
                  {/* TONE */}

                  <div className="persona-subsection">
                    <div className="persona-subsection-header">
                      <div>
                        <h3>Communication tone</h3>

                        <p>
                          Choose the overall feeling of
                          conversations.
                        </p>
                      </div>

                      <span className="persona-selection-pill">
                        {tone}
                      </span>
                    </div>

                    <div className="persona-tone-grid">
                      {TONES.map((item) => {
                        const selected =
                          tone === item.value;

                        return (
                          <button
                            type="button"
                            key={item.value}
                            className={`persona-tone-option ${
                              selected
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              setTone(item.value)
                            }
                          >
                            <span className="persona-tone-check">
                              {selected && (
                                <Check size={11} />
                              )}
                            </span>

                            <span className="persona-tone-option-title">
                              {item.title}
                            </span>

                            <span className="persona-tone-option-description">
                              {item.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* TRAITS */}

                  <div className="persona-subsection">
                    <div className="persona-subsection-header">
                      <div>
                        <h3>Personality traits</h3>

                        <p>
                          Select the qualities you want your
                          Persona to emphasize.
                        </p>
                      </div>

                      <span className="persona-selection-pill">
                        {selectedTraits.length} selected
                      </span>
                    </div>

                    <div className="persona-traits-grid">
                      {TRAITS.map((trait) => {
                        const selected =
                          selectedTraits.includes(
                            trait.id,
                          );

                        return (
                          <button
                            type="button"
                            key={trait.id}
                            className={`persona-trait ${
                              selected
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              toggleTrait(
                                trait.id,
                              )
                            }
                          >
                            <span className="persona-trait-checkbox">
                              {selected && (
                                <Check size={11} />
                              )}
                            </span>

                            <span className="persona-trait-content">
                              <span className="persona-trait-title">
                                {trait.title}
                              </span>

                              <span className="persona-trait-description">
                                {trait.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* RESPONSE STYLE */}

                  <div className="persona-subsection">
                    <div className="persona-subsection-header">
                      <div>
                        <h3>Response style</h3>

                        <p>
                          Choose how detailed responses should
                          generally feel.
                        </p>
                      </div>
                    </div>

                    <div className="persona-response-options">
                      {[
                        {
                          value: "Concise",
                          title: "Concise",
                          description:
                            "Short and direct responses.",
                        },
                        {
                          value: "Natural",
                          title: "Natural",
                          description:
                            "Balanced and conversational.",
                        },
                        {
                          value: "Detailed",
                          title: "Detailed",
                          description:
                            "More context and explanation.",
                        },
                      ].map((option) => {
                        const selected =
                          responseStyle ===
                          option.value;

                        return (
                          <button
                            type="button"
                            key={option.value}
                            className={`persona-response-option ${
                              selected
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              setResponseStyle(
                                option.value,
                              )
                            }
                          >
                            <span className="persona-response-radio">
                              {selected && (
                                <span />
                              )}
                            </span>

                            <span>
                              <span className="persona-response-title">
                                {option.title}
                              </span>

                              <span className="persona-response-description">
                                {option.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* =================================================
                MEMORY VAULT
            ================================================= */}

            <section className="persona-section persona-memory-section">
              <button
                type="button"
                className="persona-collapsible-header"
                onClick={() =>
                  setMemoryOpen(
                    (current) => !current,
                  )
                }
              >
                <div className="persona-section-header">
                  <div className="persona-section-icon blue">
                    <Brain size={17} />
                  </div>

                  <div className="persona-section-heading">
                    <h2 className="persona-section-title">
                      Memory Vault access
                    </h2>

                    <p className="persona-section-description">
                      Choose which memories this Persona can
                      access.
                    </p>
                  </div>
                </div>

                <div className="persona-memory-header-right">
                  <span>
                    {connectedCount} connected
                  </span>

                  {memoryOpen ? (
                    <ChevronUp size={17} />
                  ) : (
                    <ChevronDown size={17} />
                  )}
                </div>
              </button>

              {memoryOpen && (
                <div className="persona-memory-content">
                  {/* MEMORY SUMMARY */}

                  <div className="persona-memory-summary">
                    <div className="persona-memory-summary-main">
                      <div className="persona-memory-summary-icon">
                        <Brain size={18} />
                      </div>

                      <div>
                        <strong>
                          {connectedCount} memories connected
                        </strong>

                        <span>
                          Your Persona can use these memories
                          during conversations.
                        </span>
                      </div>
                    </div>

                    <div className="persona-memory-summary-actions">
                      <Link
                        to="/app/persona/memories"
                        className="persona-memory-secondary"
                      >
                        <Brain size={14} />
                        Open Vault
                      </Link>

                      <Link
                        to="/app/persona/memories/upload"
                        className="persona-memory-primary"
                      >
                        <Upload size={14} />
                        Upload Memory
                      </Link>
                    </div>
                  </div>

                  {/* STATS */}

                  <div className="persona-memory-stats">
                    <div className="persona-memory-stat">
                      <strong>{memoryStats.total}</strong>
                      <span>Total</span>
                    </div>

                    <div className="persona-memory-stat">
                      <strong>{memoryStats.photos}</strong>
                      <span>Photos</span>
                    </div>

                    <div className="persona-memory-stat">
                      <strong>{memoryStats.videos}</strong>
                      <span>Videos</span>
                    </div>

                    <div className="persona-memory-stat">
                      <strong>{memoryStats.audio}</strong>
                      <span>Audio</span>
                    </div>

                    <div className="persona-memory-stat">
                      <strong>{memoryStats.documents}</strong>
                      <span>Documents</span>
                    </div>
                  </div>

                  {/* SEARCH */}

                  <div className="persona-memory-toolbar">
                    <div className="persona-memory-search">
                      <Search
                        size={15}
                        className="persona-memory-search-icon"
                      />

                      <input
                        value={search}
                        onChange={(event) =>
                          setSearch(
                            event.target.value,
                          )
                        }
                        placeholder="Search your Memory Vault..."
                      />

                      {search && (
                        <button
                          type="button"
                          className="persona-clear-search"
                          onClick={() =>
                            setSearch("")
                          }
                          aria-label="Clear search"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>

                    <Link
                      to="/app/persona/memories"
                      className="persona-memory-manage"
                    >
                      Manage
                    </Link>
                  </div>

                  {/* FILTERS */}

                  <div className="persona-memory-filters">
                    {MEMORY_FILTERS.map(
                      (filter) => (
                        <button
                          type="button"
                          key={filter.value}
                          className={`persona-memory-filter ${
                            memoryFilter ===
                            filter.value
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setMemoryFilter(
                              filter.value,
                            )
                          }
                        >
                          {filter.label}
                        </button>
                      ),
                    )}

                    <button
                      type="button"
                      className={`persona-memory-filter ${
                        connectedOnly
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setConnectedOnly(
                          (current) => !current,
                        )
                      }
                    >
                      Connected
                    </button>
                  </div>

                  {/* BULK ACTIONS */}

                  <div className="persona-memory-actions">
                    <button
                      type="button"
                      className="persona-memory-action"
                      onClick={connectVisible}
                      disabled={
                        filteredMemories.length === 0
                      }
                    >
                      <Check size={12} />
                      Connect visible
                    </button>

                    <button
                      type="button"
                      className="persona-memory-action"
                      onClick={disconnectVisible}
                      disabled={
                        filteredMemories.length === 0
                      }
                    >
                      <X size={12} />
                      Disconnect visible
                    </button>

                    <button
                      type="button"
                      className="persona-memory-action danger"
                      onClick={clearAllMemories}
                      disabled={
                        selectedMemoryIds.length === 0
                      }
                    >
                      Clear all
                    </button>
                  </div>

                  {/* MEMORY LIST */}

                  <div className="persona-memory-list">
                    {!memoriesHydrated ? (
                      <div className="persona-memory-empty">
                        <div className="persona-memory-empty-icon">
                          <Brain size={19} />
                        </div>

                        <strong>
                          Loading Memory Vault
                        </strong>

                        <span>
                          Preparing your memories...
                        </span>
                      </div>
                    ) : filteredMemories.length === 0 ? (
                      <div className="persona-memory-empty">
                        <div className="persona-memory-empty-icon">
                          <Search size={18} />
                        </div>

                        <strong>
                          No memories found
                        </strong>

                        <span>
                          Try changing your search or filters.
                        </span>

                        {(search ||
                          memoryFilter !== "all" ||
                          connectedOnly) && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearch("");
                              setMemoryFilter(
                                "all",
                              );
                              setConnectedOnly(
                                false,
                              );
                            }}
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    ) : (
                      filteredMemories
                        .slice(0, 12)
                        .map((memory) => {
                          const connected =
                            selectedMemoryIds.includes(
                              memory.id,
                            );

                          const Icon =
                            getMemoryIcon(
                              memory.type,
                            );

                          return (
                            <button
                              type="button"
                              key={memory.id}
                              className={`persona-memory-row ${
                                connected
                                  ? "connected"
                                  : ""
                              }`}
                              onClick={() =>
                                toggleMemory(
                                  memory.id,
                                )
                              }
                            >
                              <span className="persona-memory-row-icon">
                                <Icon size={15} />
                              </span>

                              <span className="persona-memory-row-content">
                                <strong>
                                  {memory.title ||
                                    memory.fileName ||
                                    "Untitled memory"}
                                </strong>

                                <span>
                                  {memory.category ||
                                    memory.type}
                                  {memory.date
                                    ? ` · ${memory.date}`
                                    : ""}
                                </span>
                              </span>

                              <span
                                className={`persona-memory-row-check ${
                                  connected
                                    ? "checked"
                                    : ""
                                }`}
                              >
                                {connected && (
                                  <Check size={11} />
                                )}
                              </span>
                            </button>
                          );
                        })
                    )}
                  </div>

                  {filteredMemories.length > 12 && (
                    <Link
                      to="/app/persona/memories"
                      className="persona-memory-view-all"
                    >
                      Manage all memories in Memory Vault
                      <ArrowRight size={13} />
                    </Link>
                  )}

                  {filteredMemories.length > 0 &&
                    filteredMemories.length <= 12 && (
                      <Link
                        to="/app/persona/memories"
                        className="persona-memory-view-all"
                      >
                        Manage all memories in Memory Vault
                        <ArrowRight size={13} />
                      </Link>
                    )}
                </div>
              )}
            </section>
          </main>

          {/* ===================================================
              RIGHT SIDEBAR
          =================================================== */}

          <aside className="persona-config-sidebar">
            {/* LIVE PREVIEW */}

            <div className="persona-preview-card">
              <div className="persona-preview-header">
                <div>
                  <span>LIVE PREVIEW</span>
                  <h2>Your Persona</h2>
                </div>

                <div className="persona-preview-sparkle">
                  <Sparkles size={14} />
                </div>
              </div>

              <p className="persona-preview-description">
                Your Persona's identity and personality will
                appear here as you configure it.
              </p>

              <div className="persona-preview-profile">
                <div className="persona-preview-avatar">
                  <Sparkles size={18} />
                </div>

                <div>
                  <strong>
                    {name.trim() || "Your Persona"}
                  </strong>

                  <span>
                    {relationship ||
                      "AI Persona"}
                  </span>
                </div>
              </div>

              <div className="persona-preview-details">
                <div className="persona-preview-detail">
                  <span>Communication</span>
                  <strong>{tone}</strong>
                </div>

                <div className="persona-preview-detail">
                  <span>Response style</span>
                  <strong>
                    {responseStyle}
                  </strong>
                </div>

                <div className="persona-preview-detail">
                  <span>Connected memories</span>
                  <strong>
                    {connectedCount}
                  </strong>
                </div>
              </div>

              <div className="persona-preview-note">
                <CheckCircle2 size={14} />

                <span>
                  You can continue adding memories after
                  creating your Persona.
                </span>
              </div>
            </div>

            {/* TIME CAPSULE */}

            <div className="persona-feature-card">
              <div className="persona-feature-icon orange">
                <RotateCcw size={16} />
              </div>

              <div className="persona-feature-content">
                <span className="persona-feature-label">
                  OPTIONAL FEATURE
                </span>

                <h3>Time Capsules</h3>

                <p>
                  Preserve meaningful memories for a future
                  date. Create and manage Time Capsules after
                  your Persona is ready.
                </p>

                <Link
                  to="/app/persona/time-capsules"
                  className="persona-feature-link"
                >
                  Manage
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* CONVERSATIONS */}

            <div className="persona-feature-card">
              <div className="persona-feature-icon green">
                <MessageCircle size={16} />
              </div>

              <div className="persona-feature-content">
                <span className="persona-feature-label">
                  PERSONA EXPERIENCE
                </span>

                <h3>Conversations</h3>

                <p>
                  Start a conversation using your Persona's
                  identity and connected memories.
                </p>

                <Link
                  to="/app/persona/conversations"
                  className="persona-feature-link"
                >
                  Open
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* =====================================================
            SAVE BAR
        ===================================================== */}

        <div className="persona-config-actions">
          <div className="persona-config-action-info">
            <span className="persona-save-status-dot" />

            <span>
              {saving
                ? "Saving your Persona..."
                : "Changes are ready to save"}
            </span>
          </div>

          <div className="persona-config-action-buttons">
            {existingConfiguration && (
              <button
                type="button"
                className="persona-reset-button"
                onClick={() =>
                  setShowResetModal(true)
                }
                disabled={saving}
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}

            <Link
              to="/app/persona"
              className="persona-cancel-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="persona-save-button"
              disabled={saving}
            >
              <Save size={15} />

              {saving
                ? "Saving..."
                : "Save Persona"}
            </button>
          </div>
        </div>
      </form>

      {/* =====================================================
          RESET MODAL
      ===================================================== */}

      {showResetModal && (
        <div
          className="persona-modal-backdrop"
          role="presentation"
          onMouseDown={() =>
            setShowResetModal(false)
          }
        >
          <div
            className="persona-reset-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-persona-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="persona-reset-modal-icon">
              <RotateCcw size={20} />
            </div>

            <h2 id="reset-persona-title">
              Reset Persona?
            </h2>

            <p>
              This will remove the saved Persona
              configuration. Your memories will not be
              deleted.
            </p>

            <div className="persona-reset-modal-actions">
              <button
                type="button"
                className="persona-modal-cancel"
                onClick={() =>
                  setShowResetModal(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="persona-modal-danger"
                onClick={handleReset}
              >
                Reset Persona
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}