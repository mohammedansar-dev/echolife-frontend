import {
  Plus,
  Search,
  Users,
  Mail,
  Phone,
  CalendarDays,
  ArrowRight,
  Trash2,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useFamily } from "../FamilyContext";

import type { FamilyMember } from "../family.types";

import "./FamilyPage.css";

function getInitials(member: FamilyMember) {
  return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
}

function FamilyPage() {
  const navigate = useNavigate();

  const { members, hydrated, deleteMember } = useFamily();

  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();

      return (
        fullName.includes(query) ||
        member.relationship.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
      );
    });
  }, [members, search]);

  /* =======================================================
     DELETE
  ======================================================= */

  const memberToDelete = members.find((member) => member.id === deleteId);

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }

    await deleteMember(deleteId);

    setDeleteId(null);
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!hydrated) {
    return (
      <main className="family-page">
        <div className="family-loading">
          <div className="family-loading-spinner" />

          <p>Loading your family...</p>
        </div>
      </main>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="family-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="family-page-header">
        <div className="family-page-title">
          <div className="family-page-title-icon">
            <Users size={22} />
          </div>

          <div>
            <h1>Family</h1>

            <p>Keep the people and memories that matter connected.</p>
          </div>
        </div>

        <button
          type="button"
          className="family-add-button"
          onClick={() => navigate("/app/family/new")}
        >
          <Plus size={16} />
          Add family member
        </button>
      </header>

      {/* =================================================
          STATS
      ================================================= */}

      <section className="family-stats">
        <div className="family-stat-card">
          <div className="family-stat-icon">
            <Users size={17} />
          </div>

          <div>
            <span>Family members</span>

            <strong>{members.length}</strong>
          </div>
        </div>

        <div className="family-stat-card">
          <div className="family-stat-icon">
            <CalendarDays size={17} />
          </div>

          <div>
            <span>Connected memories</span>

            <strong>
              {members.reduce(
                (total, member) => total + member.memoryIds.length,
                0,
              )}
            </strong>
          </div>
        </div>
      </section>

      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="family-toolbar">
        <div className="family-search">
          <Search size={16} />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search family members..."
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </section>

      {/* =================================================
          SECTION
      ================================================= */}

      <section className="family-members-section">
        <div className="family-section-heading">
          <div>
            <h2>Your family</h2>

            <p>
              {filteredMembers.length}{" "}
              {filteredMembers.length === 1 ? "member" : "members"}
            </p>
          </div>
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredMembers.length === 0 ? (
          <div className="family-empty">
            <div className="family-empty-icon">
              <Users size={24} />
            </div>

            <h3>
              {members.length === 0
                ? "No family members yet"
                : "No members found"}
            </h3>

            <p>
              {members.length === 0
                ? "Add your first family member to start building your family space."
                : "Try a different search term."}
            </p>

            {members.length === 0 && (
              <button type="button" onClick={() => navigate("/app/family/new")}>
                <Plus size={15} />
                Add family member
              </button>
            )}
          </div>
        ) : (
          /* =================================================
             GRID
          ================================================= */

          <div className="family-grid">
            {filteredMembers.map((member) => (
              <article key={member.id} className="family-member-card">
                {/* PROFILE */}

                <button
                  type="button"
                  className="family-member-main"
                  onClick={() => navigate(`/app/family/${member.id}`)}
                >
                  <div className="family-member-avatar">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={`${member.firstName} ${member.lastName}`}
                      />
                    ) : (
                      getInitials(member)
                    )}
                  </div>

                  <div className="family-member-info">
                    <span className="family-member-relationship">
                      {member.relationship}
                    </span>

                    <h3>
                      {member.firstName} {member.lastName}
                    </h3>

                    {member.notes && <p>{member.notes}</p>}
                  </div>
                </button>

                {/* DETAILS */}

                <div className="family-member-meta">
                  {member.email && (
                    <span>
                      <Mail size={13} />

                      {member.email}
                    </span>
                  )}

                  {member.phone && (
                    <span>
                      <Phone size={13} />

                      {member.phone}
                    </span>
                  )}

                  <span>
                    <CalendarDays size={13} />
                    {member.memoryIds.length} memories
                  </span>
                </div>

                {/* FOOTER */}

                <div className="family-member-footer">
                  <button
                    type="button"
                    onClick={() => navigate(`/app/family/${member.id}`)}
                  >
                    View details
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    className="family-card-delete"
                    onClick={() => setDeleteId(member.id)}
                    aria-label={`Delete ${member.firstName} ${member.lastName}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {memberToDelete && (
        <div className="family-modal-overlay">
          <section className="family-delete-modal">
            <button
              type="button"
              className="family-modal-close"
              onClick={() => setDeleteId(null)}
            >
              <X size={17} />
            </button>

            <div className="family-delete-icon">
              <Trash2 size={20} />
            </div>

            <h2>Remove family member?</h2>

            <p>
              Are you sure you want to remove{" "}
              <strong>
                {memberToDelete.firstName} {memberToDelete.lastName}
              </strong>
              ? Their memories will remain safe.
            </p>

            <div className="family-delete-actions">
              <button type="button" onClick={() => setDeleteId(null)}>
                Cancel
              </button>

              <button type="button" className="danger" onClick={handleDelete}>
                <Trash2 size={14} />
                Remove member
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default FamilyPage;
