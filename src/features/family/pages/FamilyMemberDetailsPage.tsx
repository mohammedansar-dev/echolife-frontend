import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  Mail,
  Phone,
  Save,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useFamily } from "../FamilyContext";

import type { FamilyMember, FamilyRelationship } from "../family.types";

import { useMemory } from "../../vault/MemoryContext";

import "./FamilyMemberDetailsPage.css";

const RELATIONSHIPS: FamilyRelationship[] = [
  "Parent",
  "Grandparent",
  "Spouse",
  "Sibling",
  "Child",
  "Uncle/Aunt",
  "Cousin",
  "Other",
];

function getInitials(member: FamilyMember) {
  return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
}

function formatDate(value?: string) {
  if (!value) {
    return "Not added";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not added";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function FamilyMemberDetailsPage() {
  const navigate = useNavigate();

  const { memberId } = useParams<{
    memberId: string;
  }>();

  const {
    members,
    hydrated,
    updateMember,
    deleteMember,
    addMemoryToMember,
    removeMemoryFromMember,
  } = useFamily();

  const { memories } = useMemory();

  /* =======================================================
     MEMBER
  ======================================================= */

  const member = members.find((item) => item.id === memberId);

  /* =======================================================
     STATE
  ======================================================= */

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [relationship, setRelationship] = useState<FamilyRelationship>("Other");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState("");

  const [notes, setNotes] = useState("");

  /* =======================================================
     LOAD FORM
  ======================================================= */

  useEffect(() => {
    if (!member) {
      return;
    }

    setFirstName(member.firstName);

    setLastName(member.lastName);

    setRelationship(member.relationship);

    setEmail(member.email ?? "");

    setPhone(member.phone ?? "");

    setDateOfBirth(member.dateOfBirth ?? "");

    setNotes(member.notes ?? "");
  }, [member?.id]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (!hydrated) {
    return (
      <main className="family-details-page">
        <div className="family-details-loading">
          <div className="family-details-spinner" />

          <p>Loading family member...</p>
        </div>
      </main>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */
  if (!member) {
    return (
      <main className="family-details-page">
        <section className="family-details-not-found">
          <div className="family-not-found-icon">
            <UserRound size={24} />
          </div>

          <h1>Family member not found</h1>

          <p>This family member does not exist in your Family space.</p>

          <button type="button" onClick={() => navigate("/app/family")}>
            <ArrowLeft size={15} />
            Back to Family
          </button>
        </section>
      </main>
    );
  }

  /* =======================================================
     START EDIT
  ======================================================= */

  const handleEdit = () => {
    setFirstName(member.firstName);

    setLastName(member.lastName);

    setRelationship(member.relationship);

    setEmail(member.email ?? "");

    setPhone(member.phone ?? "");

    setDateOfBirth(member.dateOfBirth ?? "");

    setNotes(member.notes ?? "");

    setError("");

    setEditing(true);
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = () => {
    setFirstName(member.firstName);

    setLastName(member.lastName);

    setRelationship(member.relationship);

    setEmail(member.email ?? "");

    setPhone(member.phone ?? "");

    setDateOfBirth(member.dateOfBirth ?? "");

    setNotes(member.notes ?? "");

    setError("");

    setEditing(false);
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    const cleanFirstName = firstName.trim();

    const cleanLastName = lastName.trim();

    if (!cleanFirstName) {
      setError("First name is required.");

      return;
    }

    if (!cleanLastName) {
      setError("Last name is required.");

      return;
    }

    setSaving(true);

    setError("");

    try {
      const updatedMember: FamilyMember = {
        ...member,

        firstName: cleanFirstName,

        lastName: cleanLastName,

        relationship,

        email: email.trim(),

        phone: phone.trim(),

        dateOfBirth,

        notes: notes.trim(),

        updatedAt: new Date().toISOString(),
      };

      await updateMember(updatedMember);

      setEditing(false);
    } catch (error) {
      console.error("Unable to update family member:", error);

      setError("Unable to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async () => {
    setSaving(true);

    try {
      await deleteMember(member.id);

      navigate("/app/family", {
        replace: true,
      });
    } catch (error) {
      console.error("Unable to delete family member:", error);

      setSaving(false);
    }
  };

  /* =======================================================
     MEMORY TOGGLE
  ======================================================= */

  const toggleMemory = async (memoryId: string) => {
    try {
      const connected = member.memoryIds.includes(memoryId);

      if (connected) {
        await removeMemoryFromMember(member.id, memoryId);
      } else {
        await addMemoryToMember(member.id, memoryId);
      }
    } catch (error) {
      console.error("Unable to update memory connection:", error);
    }
  };

  /* =======================================================
     CONNECTED MEMORIES
  ======================================================= */

  const connectedMemories = memories.filter((memory) =>
    member.memoryIds.includes(memory.id),
  );

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="family-details-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="family-details-header">
        <div className="family-details-header-left">
          <button
            type="button"
            className="family-details-back"
            onClick={() => navigate("/app/family")}
          >
            <ArrowLeft size={16} />
            <span>Back to Family</span>
          </button>

          <div className="family-details-divider" />

          <div className="family-details-breadcrumb">
            <span>Family</span>

            <span>/</span>

            <strong>
              {member.firstName} {member.lastName}
            </strong>
          </div>
        </div>

        {!editing ? (
          <div className="family-details-actions">
            <button type="button" onClick={handleEdit}>
              <Edit3 size={14} />
              Edit
            </button>

            <button
              type="button"
              className="danger"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        ) : (
          <div className="family-details-actions">
            <button type="button" onClick={handleCancel} disabled={saving}>
              <X size={14} />
              Cancel
            </button>

            <button
              type="button"
              className="save"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={14} />

              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </header>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && <div className="family-details-error">{error}</div>}

      {/* =================================================
          PROFILE
      ================================================= */}

      <section className="family-profile-card">
        <div className="family-profile-avatar">
          {member.profileImage ? (
            <img
              src={member.profileImage}
              alt={`${member.firstName} ${member.lastName}`}
            />
          ) : (
            getInitials(member)
          )}
        </div>

        <div className="family-profile-heading">
          <span>{member.relationship}</span>

          <h1>
            {member.firstName} {member.lastName}
          </h1>

          <p>Family member</p>
        </div>
      </section>

      {/* =================================================
          CONTENT GRID
      ================================================= */}

      <div className="family-details-grid">
        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <section className="family-info-panel">
          <div className="family-panel-heading">
            <div>
              <h2>Personal information</h2>

              <p>Details about this family member.</p>
            </div>
          </div>

          {!editing ? (
            <div className="family-info-list">
              <div>
                <Mail size={16} />

                <span>Email</span>

                <strong>{member.email || "Not added"}</strong>
              </div>

              <div>
                <Phone size={16} />

                <span>Phone</span>

                <strong>{member.phone || "Not added"}</strong>
              </div>

              <div>
                <CalendarDays size={16} />

                <span>Date of birth</span>

                <strong>{formatDate(member.dateOfBirth)}</strong>
              </div>

              <div>
                <Users size={16} />

                <span>Relationship</span>

                <strong>{member.relationship}</strong>
              </div>
            </div>
          ) : (
            <div className="family-edit-form">
              <div className="family-edit-two">
                <label>
                  First name
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </label>

                <label>
                  Last name
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </label>
              </div>

              <label>
                Relationship
                <select
                  value={relationship}
                  onChange={(event) =>
                    setRelationship(event.target.value as FamilyRelationship)
                  }
                >
                  {RELATIONSHIPS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>

              <label>
                Date of birth
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                />
              </label>

              <label>
                Notes
                <textarea
                  rows={5}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add notes about this family member..."
                />
              </label>
            </div>
          )}
        </section>

        {/* =================================================
            NOTES
        ================================================= */}

        <section className="family-info-panel">
          <div className="family-panel-heading">
            <div>
              <h2>Notes</h2>

              <p>Personal notes and family context.</p>
            </div>
          </div>

          <div className="family-notes">
            {member.notes ? member.notes : <span>No notes added yet.</span>}
          </div>
        </section>

        {/* =================================================
            CONNECTED MEMORIES
        ================================================= */}

        <section className="family-info-panel family-memory-panel">
          <div className="family-panel-heading">
            <div>
              <h2>Connected memories</h2>

              <p>Connect memories with this family member.</p>
            </div>

            <strong>{connectedMemories.length}</strong>
          </div>

          {memories.length === 0 ? (
            <div className="family-no-memories">No memories available.</div>
          ) : (
            <div className="family-memory-picker">
              {memories.map((memory) => {
                const selected = member.memoryIds.includes(memory.id);

                return (
                  <button
                    type="button"
                    key={memory.id}
                    className={selected ? "selected" : ""}
                    onClick={() => toggleMemory(memory.id)}
                  >
                    <span>{memory.title}</span>

                    <span>{selected ? "Connected" : "Connect"}</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {deleteOpen && (
        <div className="family-details-overlay">
          <section className="family-details-delete">
            <button
              type="button"
              className="family-delete-close"
              onClick={() => setDeleteOpen(false)}
            >
              <X size={17} />
            </button>

            <div className="family-delete-large-icon">
              <Trash2 size={21} />
            </div>

            <h2>
              Remove {member.firstName} {member.lastName}?
            </h2>

            <p>
              This removes the family member from your Family space. Their
              memories will not be deleted.
            </p>

            <div className="family-delete-actions">
              <button type="button" onClick={() => setDeleteOpen(false)}>
                Cancel
              </button>

              <button
                type="button"
                className="danger"
                onClick={handleDelete}
                disabled={saving}
              >
                <Trash2 size={14} />

                {saving ? "Removing..." : "Remove member"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default FamilyMemberDetailsPage;
