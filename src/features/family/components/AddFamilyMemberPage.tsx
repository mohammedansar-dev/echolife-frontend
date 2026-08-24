import { ArrowLeft, Save, UserPlus } from "lucide-react";

import { useState, type FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import { useFamily } from "../FamilyContext";

import type { FamilyMember, FamilyRelationship } from "../family.types";

import "./AddFamilyMemberPage.css";

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

function AddFamilyMemberPage() {
  const navigate = useNavigate();

  const { addMember } = useFamily();

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [relationship, setRelationship] = useState<FamilyRelationship>("Other");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState("");

  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      const now = new Date().toISOString();

      const member: FamilyMember = {
        id: `family-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

        firstName: cleanFirstName,

        lastName: cleanLastName,

        relationship,

        email: email.trim(),

        phone: phone.trim(),

        dateOfBirth,

        profileImage: "",

        notes: notes.trim(),

        memoryIds: [],

        createdAt: now,

        updatedAt: now,
      };

      await addMember(member);

      /*
       * IMPORTANT
       *
       * Go back to the Family list after
       * creation.
       *
       * The new member will already be
       * persisted by FamilyContext.
       */

      navigate("/app/family", {
        replace: true,
      });
    } catch (error) {
      console.error("Unable to add family member:", error);

      setError("Unable to add family member. Please try again.");

      setSaving(false);
    }
  };

  return (
    <main className="add-family-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="add-family-header">
        <button
          type="button"
          className="add-family-back"
          onClick={() => navigate("/app/family")}
        >
          <ArrowLeft size={16} />
          Back to Family
        </button>

        <div className="add-family-heading">
          <div className="add-family-icon">
            <UserPlus size={20} />
          </div>

          <div>
            <h1>Add family member</h1>

            <p>Add someone important to your family space.</p>
          </div>
        </div>
      </header>

      {/* =================================================
          FORM
      ================================================= */}

      <form className="add-family-card" onSubmit={handleSubmit}>
        {error && <div className="add-family-error">{error}</div>}

        {/* NAME */}

        <div className="add-family-two">
          <label>
            First name
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="First name"
              autoComplete="given-name"
            />
          </label>

          <label>
            Last name
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Last name"
              autoComplete="family-name"
            />
          </label>
        </div>

        {/* RELATIONSHIP */}

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

        {/* CONTACT */}

        <div className="add-family-two">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              autoComplete="email"
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone number"
              autoComplete="tel"
            />
          </label>
        </div>

        {/* DATE */}

        <label>
          Date of birth
          <input
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
          />
        </label>

        {/* NOTES */}

        <label>
          Notes
          <textarea
            rows={5}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add any helpful family notes..."
          />
        </label>

        {/* ACTIONS */}

        <div className="add-family-actions">
          <button
            type="button"
            onClick={() => navigate("/app/family")}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" className="primary" disabled={saving}>
            <Save size={15} />

            {saving ? "Adding..." : "Add family member"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddFamilyMemberPage;
