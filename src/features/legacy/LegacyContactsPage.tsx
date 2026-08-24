import {
  Check,
  ChevronRight,
  Clock3,
  Heart,
  Mail,
  Plus,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

import "./LegacyContactsPage.css";

type AccessLevel =
  | "Memories only"
  | "Memories + conversations"
  | "Full legacy access";

type ContactStatus = "Active" | "Pending";

interface LegacyContact {
  id: number;
  name: string;
  email: string;
  relationship: string;
  access: AccessLevel;
  status: ContactStatus;
  initials: string;
}

const initialContacts: LegacyContact[] = [
  {
    id: 1,
    name: "Ayesha Hansi",
    email: "ayesha@example.com",
    relationship: "Daughter",
    access: "Full legacy access",
    status: "Active",
    initials: "AH",
  },
  {
    id: 2,
    name: "Rahul Hansi",
    email: "rahul@example.com",
    relationship: "Brother",
    access: "Memories only",
    status: "Pending",
    initials: "RH",
  },
];

const accessOptions: AccessLevel[] = [
  "Memories only",
  "Memories + conversations",
  "Full legacy access",
];

function LegacyContactsPage() {
  const [contacts, setContacts] = useState<LegacyContact[]>(initialContacts);

  const [showAddModal, setShowAddModal] = useState(false);

  const [removeContact, setRemoveContact] = useState<LegacyContact | null>(
    null,
  );

  const [selectedContact, setSelectedContact] = useState<LegacyContact | null>(
    null,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [access, setAccess] = useState<AccessLevel>("Memories only");

  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setRelationship("");
    setAccess("Memories only");
    setError("");
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleAddContact = () => {
    if (!name.trim()) {
      setError("Please enter the contact name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!relationship.trim()) {
      setError("Please enter the relationship.");
      return;
    }

    const initials = name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();

    const newContact: LegacyContact = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      relationship: relationship.trim(),
      access,
      status: "Pending",
      initials,
    };

    setContacts((current) => [...current, newContact]);

    closeAddModal();
  };

  const confirmRemove = () => {
    if (!removeContact) {
      return;
    }

    setContacts((current) =>
      current.filter((contact) => contact.id !== removeContact.id),
    );

    if (selectedContact?.id === removeContact.id) {
      setSelectedContact(null);
    }

    setRemoveContact(null);
  };

  return (
    <main className="legacy-page">
      {/* HEADER */}

      <header className="legacy-header">
        <div>
          <span className="legacy-eyebrow">
            <Heart size={11} />
            LEGACY
          </span>

          <h1>Preserve your family story for the future.</h1>

          <p>
            Choose trusted people who may receive access to your preserved
            memories and conversations according to the permissions you select.
          </p>
        </div>

        <div className="legacy-header-badge">
          <ShieldCheck size={13} />
          Private by default
        </div>
      </header>

      {/* OVERVIEW */}

      <section className="legacy-overview">
        <div className="legacy-overview-icon">
          <Users size={18} />
        </div>

        <div className="legacy-overview-content">
          <span>YOUR LEGACY PLAN</span>

          <strong>
            {contacts.length} trusted{" "}
            {contacts.length === 1 ? "contact" : "contacts"}
          </strong>

          <p>Access is only available to people you intentionally add here.</p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="legacy-primary-button"
        >
          <Plus size={13} />
          Add contact
        </button>
      </section>

      {/* CONTACTS */}

      <section className="legacy-section">
        <div className="legacy-section-heading">
          <div>
            <span>TRUSTED CONTACTS</span>

            <h2>People you've chosen</h2>

            <p>
              Manage who can access your family story and what they can see.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="legacy-secondary-button"
          >
            <UserPlus size={12} />
            Add contact
          </button>
        </div>

        <div className="legacy-contact-list">
          {contacts.length === 0 ? (
            <div className="legacy-empty">
              <div className="legacy-empty-icon">
                <Users size={20} />
              </div>

              <strong>No legacy contacts yet</strong>

              <p>Add someone you trust to begin building your legacy plan.</p>

              <button
                type="button"
                onClick={openAddModal}
                className="legacy-primary-button"
              >
                <Plus size={12} />
                Add your first contact
              </button>
            </div>
          ) : (
            contacts.map((contact) => (
              <article key={contact.id} className="legacy-contact">
                <div className="legacy-avatar">{contact.initials}</div>

                <div className="legacy-contact-info">
                  <div className="legacy-contact-name">
                    <strong>{contact.name}</strong>

                    <span
                      className={
                        contact.status === "Active" ? "active" : "pending"
                      }
                    >
                      {contact.status}
                    </span>
                  </div>

                  <div className="legacy-contact-meta">
                    <span>{contact.relationship}</span>

                    <span>{contact.email}</span>
                  </div>

                  <div className="legacy-contact-access">
                    <ShieldCheck size={10} />

                    <span>{contact.access}</span>
                  </div>
                </div>

                <div className="legacy-contact-actions">
                  <button
                    type="button"
                    onClick={() => setSelectedContact(contact)}
                  >
                    View details
                    <ChevronRight size={11} />
                  </button>

                  <button
                    type="button"
                    className="legacy-remove-button"
                    onClick={() => setRemoveContact(contact)}
                    aria-label={`Remove ${contact.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* ACCESS INFORMATION */}

      <section className="legacy-info-grid">
        <article className="legacy-info-card">
          <div className="legacy-info-icon blue">
            <ShieldCheck size={15} />
          </div>

          <div>
            <span>PRIVATE BY DEFAULT</span>

            <h2>You control access</h2>

            <p>
              Adding someone as a legacy contact does not automatically give
              them unrestricted access. You choose the level of access for each
              person.
            </p>
          </div>
        </article>

        <article className="legacy-info-card">
          <div className="legacy-info-icon green">
            <Clock3 size={15} />
          </div>

          <div>
            <span>FUTURE ACCESS</span>

            <h2>Your memories stay protected</h2>

            <p>
              Legacy contacts are designed for future access to preserved family
              memories according to your plan.
            </p>
          </div>
        </article>
      </section>

      {/* CONTACT DETAILS MODAL */}

      {selectedContact && (
        <div
          className="legacy-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedContact(null);
            }
          }}
        >
          <div className="legacy-modal">
            <button
              type="button"
              className="legacy-modal-close"
              onClick={() => setSelectedContact(null)}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="legacy-modal-avatar">
              {selectedContact.initials}
            </div>

            <span className="legacy-modal-eyebrow">LEGACY CONTACT</span>

            <h2>{selectedContact.name}</h2>

            <p className="legacy-modal-description">
              {selectedContact.relationship}
            </p>

            <div className="legacy-detail-list">
              <div className="legacy-detail-row">
                <Mail size={13} />

                <div>
                  <span>Email</span>

                  <strong>{selectedContact.email}</strong>
                </div>
              </div>

              <div className="legacy-detail-row">
                <ShieldCheck size={13} />

                <div>
                  <span>Access level</span>

                  <strong>{selectedContact.access}</strong>
                </div>
              </div>

              <div className="legacy-detail-row">
                <Clock3 size={13} />

                <div>
                  <span>Invitation status</span>

                  <strong>{selectedContact.status}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="legacy-modal-remove"
              onClick={() => {
                setRemoveContact(selectedContact);
                setSelectedContact(null);
              }}
            >
              <Trash2 size={12} />
              Remove contact
            </button>
          </div>
        </div>
      )}

      {/* ADD CONTACT MODAL */}

      {showAddModal && (
        <div
          className="legacy-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAddModal();
            }
          }}
        >
          <div className="legacy-modal legacy-add-modal">
            <button
              type="button"
              className="legacy-modal-close"
              onClick={closeAddModal}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="legacy-add-icon">
              <UserPlus size={19} />
            </div>

            <span className="legacy-modal-eyebrow">NEW CONTACT</span>

            <h2>Add a trusted contact</h2>

            <p className="legacy-modal-description">
              Choose someone you trust to include in your EchoLife legacy plan.
            </p>

            {error && <div className="legacy-form-error">{error}</div>}

            <div className="legacy-form">
              <label>
                Full name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter full name"
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                />
              </label>

              <label>
                Relationship
                <input
                  type="text"
                  value={relationship}
                  onChange={(event) => setRelationship(event.target.value)}
                  placeholder="e.g. Daughter"
                />
              </label>

              <label>
                Access level
                <select
                  value={access}
                  onChange={(event) =>
                    setAccess(event.target.value as AccessLevel)
                  }
                >
                  {accessOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="legacy-modal-actions">
              <button
                type="button"
                className="legacy-modal-secondary"
                onClick={closeAddModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="legacy-modal-primary"
                onClick={handleAddContact}
              >
                Add contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE CONFIRMATION */}

      {removeContact && (
        <div
          className="legacy-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setRemoveContact(null);
            }
          }}
        >
          <div className="legacy-modal legacy-confirm-modal">
            <div className="legacy-danger-icon">
              <Trash2 size={19} />
            </div>

            <h2>Remove this contact?</h2>

            <p>
              Remove <strong>{removeContact.name}</strong> from your legacy
              contacts? They will no longer be included in your current legacy
              plan.
            </p>

            <div className="legacy-modal-actions">
              <button
                type="button"
                className="legacy-modal-secondary"
                onClick={() => setRemoveContact(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="legacy-modal-danger"
                onClick={confirmRemove}
              >
                Remove contact
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default LegacyContactsPage;
