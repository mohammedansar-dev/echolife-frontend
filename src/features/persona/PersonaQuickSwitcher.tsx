import { ChevronDown, ChevronRight, UserRound, UsersRound } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./PersonaQuickSwitcher.css";

export interface PersonaItem {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  tone?: string;
}

interface PersonaQuickSwitcherProps {
  personas?: PersonaItem[];
}

function PersonaQuickSwitcher({ personas = [] }: PersonaQuickSwitcherProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  /*
   * Don't show the quick switcher inside Persona pages.
   */
  const isPersonaPage = location.pathname.startsWith("/app/persona");

  if (isPersonaPage) {
    return null;
  }

  const handlePersonaSelect = (personaId: string) => {
    setOpen(false);

    navigate(`/app/persona?persona=${encodeURIComponent(personaId)}`);
  };

  const handleCreatePersona = () => {
    setOpen(false);
    navigate("/app/persona/configure");
  };

  const handleViewPersonas = () => {
    setOpen(false);
    navigate("/app/persona");
  };

  return (
    <div className="persona-quick-switcher">
      {/* =====================================================
          FLOATING PERSONA BUTTON
      ===================================================== */}

      <button
        type="button"
        className={`persona-quick-button ${open ? "open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-label="Open personas"
        aria-expanded={open}
      >
        <UsersRound size={20} strokeWidth={1.8} />

        <span className="persona-quick-arrow">
          <ChevronDown size={12} />
        </span>
      </button>

      {open && (
        <>
          {/* =================================================
              BACKDROP
          ================================================= */}

          <button
            type="button"
            className="persona-quick-backdrop"
            aria-label="Close personas"
            onClick={() => setOpen(false)}
          />

          {/* =================================================
              PERSONA PANEL
          ================================================= */}

          <aside className="persona-quick-menu">
            {/* HEADER */}

            <div className="persona-quick-header">
              <div className="persona-quick-header-title">
                <span>PERSONAL AI</span>

                <strong>Your Personas</strong>
              </div>

              <button
                type="button"
                className="persona-quick-close"
                onClick={() => setOpen(false)}
                aria-label="Close personas"
              >
                ×
              </button>
            </div>

            <div className="persona-quick-divider" />

            {/* =================================================
                PERSONA CONTENT
            ================================================= */}

            <div className="persona-quick-content">
              {personas.length === 0 ? (
                /* =================================================
                   EMPTY STATE
                ================================================= */

                <div className="persona-quick-empty">
                  <div className="persona-empty-icon">
                    <UserRound size={22} strokeWidth={1.7} />
                  </div>

                  <strong>No personas yet</strong>

                  <p>Create a Persona to start your personal AI experience.</p>

                  <button
                    type="button"
                    className="persona-create-button"
                    onClick={handleCreatePersona}
                  >
                    Create Persona
                    <ChevronRight size={14} />
                  </button>
                </div>
              ) : (
                /* =================================================
                   REAL PERSONAS
                ================================================= */

                <div className="persona-quick-list">
                  {personas.map((persona) => (
                    <button
                      key={persona.id}
                      type="button"
                      className="persona-quick-item"
                      onClick={() => handlePersonaSelect(persona.id)}
                    >
                      {/* AVATAR */}

                      <div className="persona-quick-avatar">
                        {persona.avatarUrl ? (
                          <img src={persona.avatarUrl} alt={persona.name} />
                        ) : (
                          <UserRound size={19} strokeWidth={1.7} />
                        )}
                      </div>

                      {/* DETAILS */}

                      <div className="persona-quick-item-content">
                        <strong>{persona.name}</strong>

                        <span>
                          {persona.description || persona.tone || "Personal AI"}
                        </span>
                      </div>

                      <ChevronRight size={15} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <button
              type="button"
              className="persona-quick-manage"
              onClick={handleViewPersonas}
            >
              <span>View all personas</span>

              <ChevronRight size={15} />
            </button>
          </aside>
        </>
      )}
    </div>
  );
}

export default PersonaQuickSwitcher;
