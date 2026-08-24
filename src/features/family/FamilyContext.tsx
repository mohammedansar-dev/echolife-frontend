import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { FamilyMember } from "./family.types";

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "echolife_family_members";

/* =========================================================
   DEFAULT MEMBERS
========================================================= */

const DEFAULT_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: "family-mother",
    firstName: "Sarah",
    lastName: "Johnson",
    relationship: "Parent",
    email: "sarah@example.com",
    phone: "",
    dateOfBirth: "",
    profileImage: "",
    notes: "A loving and important part of the family.",
    memoryIds: [],
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
  },

  {
    id: "family-grandfather",
    firstName: "Robert",
    lastName: "Johnson",
    relationship: "Grandparent",
    email: "",
    phone: "",
    dateOfBirth: "",
    profileImage: "",
    notes: "Family stories and memories.",
    memoryIds: [],
    createdAt: "2026-08-02T10:00:00.000Z",
    updatedAt: "2026-08-02T10:00:00.000Z",
  },

  {
    id: "family-sister",
    firstName: "Emily",
    lastName: "Johnson",
    relationship: "Sibling",
    email: "",
    phone: "",
    dateOfBirth: "",
    profileImage: "",
    notes: "",
    memoryIds: [],
    createdAt: "2026-08-03T10:00:00.000Z",
    updatedAt: "2026-08-03T10:00:00.000Z",
  },
];

/* =========================================================
   CONTEXT TYPE
========================================================= */

interface FamilyContextValue {
  members: FamilyMember[];

  hydrated: boolean;

  addMember: (member: FamilyMember) => Promise<void>;

  updateMember: (member: FamilyMember) => Promise<void>;

  deleteMember: (memberId: string) => Promise<void>;

  getMemberById: (memberId: string) => FamilyMember | undefined;

  addMemoryToMember: (memberId: string, memoryId: string) => Promise<void>;

  removeMemoryFromMember: (memberId: string, memoryId: string) => Promise<void>;

  clearMembers: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined);

/* =========================================================
   PROVIDER
========================================================= */

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<FamilyMember[]>([]);

  const [hydrated, setHydrated] = useState(false);

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        setMembers(DEFAULT_FAMILY_MEMBERS);

        return;
      }

      const parsed: unknown = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        setMembers(DEFAULT_FAMILY_MEMBERS);

        return;
      }

      setMembers(parsed as FamilyMember[]);
    } catch (error) {
      console.error("Unable to load family members:", error);

      setMembers(DEFAULT_FAMILY_MEMBERS);
    } finally {
      setHydrated(true);
    }
  }, []);

  /* =======================================================
     SAVE
  ======================================================= */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch (error) {
      console.error("Unable to save family members:", error);
    }
  }, [members, hydrated]);

  /* =======================================================
     ADD MEMBER
  ======================================================= */

  const addMember = useCallback(async (member: FamilyMember) => {
    setMembers((current) => {
      const exists = current.some((item) => item.id === member.id);

      if (exists) {
        return current;
      }

      const updated = [member, ...current];

      /*
       * Save immediately as well.
       *
       * This prevents the newly created
       * member from disappearing when
       * navigation happens immediately.
       */

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Unable to immediately save new family member:", error);
      }

      return updated;
    });
  }, []);

  /* =======================================================
     UPDATE MEMBER
  ======================================================= */

  const updateMember = useCallback(async (updatedMember: FamilyMember) => {
    const normalized: FamilyMember = {
      ...updatedMember,

      firstName: updatedMember.firstName.trim(),

      lastName: updatedMember.lastName.trim(),

      email: updatedMember.email?.trim() ?? "",

      phone: updatedMember.phone?.trim() ?? "",

      notes: updatedMember.notes?.trim() ?? "",

      updatedAt: new Date().toISOString(),
    };

    setMembers((current) => {
      const updated = current.map((member) =>
        member.id === normalized.id ? normalized : member,
      );

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Unable to save updated family member:", error);
      }

      return updated;
    });
  }, []);

  /* =======================================================
     DELETE MEMBER
  ======================================================= */

  const deleteMember = useCallback(async (memberId: string) => {
    setMembers((current) => {
      const updated = current.filter((member) => member.id !== memberId);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Unable to save deleted family member:", error);
      }

      return updated;
    });
  }, []);

  /* =======================================================
     GET MEMBER
  ======================================================= */

  const getMemberById = useCallback(
    (memberId: string) => {
      return members.find((member) => member.id === memberId);
    },
    [members],
  );

  /* =======================================================
     ADD MEMORY
  ======================================================= */

  const addMemoryToMember = useCallback(
    async (memberId: string, memoryId: string) => {
      setMembers((current) => {
        const updated = current.map((member) => {
          if (member.id !== memberId) {
            return member;
          }

          if (member.memoryIds.includes(memoryId)) {
            return member;
          }

          return {
            ...member,

            memoryIds: [...member.memoryIds, memoryId],

            updatedAt: new Date().toISOString(),
          };
        });

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error("Unable to save memory connection:", error);
        }

        return updated;
      });
    },
    [],
  );

  /* =======================================================
     REMOVE MEMORY
  ======================================================= */

  const removeMemoryFromMember = useCallback(
    async (memberId: string, memoryId: string) => {
      setMembers((current) => {
        const updated = current.map((member) =>
          member.id === memberId
            ? {
                ...member,

                memoryIds: member.memoryIds.filter((id) => id !== memoryId),

                updatedAt: new Date().toISOString(),
              }
            : member,
        );

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error("Unable to save memory disconnection:", error);
        }

        return updated;
      });
    },
    [],
  );

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearMembers = useCallback(() => {
    setMembers([]);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
      console.error("Unable to clear family members:", error);
    }
  }, []);

  /* =======================================================
     VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      members,
      hydrated,
      addMember,
      updateMember,
      deleteMember,
      getMemberById,
      addMemoryToMember,
      removeMemoryFromMember,
      clearMembers,
    }),
    [
      members,
      hydrated,
      addMember,
      updateMember,
      deleteMember,
      getMemberById,
      addMemoryToMember,
      removeMemoryFromMember,
      clearMembers,
    ],
  );

  return (
    <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useFamily() {
  const context = useContext(FamilyContext);

  if (!context) {
    throw new Error("useFamily must be used inside FamilyProvider");
  }

  return context;
}
