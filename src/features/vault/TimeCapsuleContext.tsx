import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useMemory } from "./MemoryContext";

import type {
  CreateTimeCapsuleInput,
  TimeCapsule,
  UpdateTimeCapsuleInput,
} from "./timeCapsule.types";

/* =========================================================
   RE-EXPORT TYPES
   This allows pages to import TimeCapsule from
   "../TimeCapsuleContext"
========================================================= */

export type {
  TimeCapsule,
  CreateTimeCapsuleInput,
  UpdateTimeCapsuleInput,
} from "./timeCapsule.types";

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "echolife_time_capsules";

/* =========================================================
   CONTEXT TYPE
========================================================= */

interface TimeCapsuleContextValue {
  capsules: TimeCapsule[];

  hydrated: boolean;

  createCapsule: (input: CreateTimeCapsuleInput) => Promise<TimeCapsule | null>;

  updateCapsule: (input: UpdateTimeCapsuleInput) => Promise<TimeCapsule | null>;

  deleteCapsule: (capsuleId: string) => Promise<void>;

  getCapsuleById: (capsuleId: string) => TimeCapsule | undefined;

  getCapsulesForMemory: (memoryId: string) => TimeCapsule[];

  isCapsuleUnlocked: (capsule: TimeCapsule) => boolean;

  openCapsule: (capsuleId: string) => Promise<boolean>;

  clearCapsules: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const TimeCapsuleContext = createContext<TimeCapsuleContextValue | undefined>(
  undefined,
);

/* =========================================================
   VALIDATION
========================================================= */

function isValidCapsule(value: unknown): value is TimeCapsule {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<TimeCapsule>;

  return (
    typeof item.id === "string" &&
    typeof item.memoryId === "string" &&
    typeof item.title === "string" &&
    typeof item.message === "string" &&
    typeof item.unlockDate === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string" &&
    typeof item.isOpened === "boolean"
  );
}

/* =========================================================
   LOAD
========================================================= */

function loadCapsules(): TimeCapsule[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidCapsule);
  } catch (error) {
    console.error("Unable to load time capsules:", error);

    return [];
  }
}

/* =========================================================
   PROVIDER
========================================================= */

export function TimeCapsuleProvider({ children }: { children: ReactNode }) {
  const { memories } = useMemory();

  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);

  const [hydrated, setHydrated] = useState(false);

  /* =======================================================
     HYDRATE
  ======================================================= */

  useEffect(() => {
    const loaded = loadCapsules();

    setCapsules(loaded);

    setHydrated(true);
  }, []);

  /* =======================================================
     PERSIST
  ======================================================= */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(capsules));
    } catch (error) {
      console.error("Unable to save time capsules:", error);
    }
  }, [capsules, hydrated]);

  /* =======================================================
     CREATE
  ======================================================= */

  const createCapsule = useCallback(
    async (input: CreateTimeCapsuleInput): Promise<TimeCapsule | null> => {
      const memoryExists = memories.some(
        (memory) => memory.id === input.memoryId,
      );

      if (!memoryExists) {
        return null;
      }

      const now = new Date().toISOString();

      const capsule: TimeCapsule = {
        id:
          input.id ||
          `capsule-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,

        memoryId: input.memoryId,

        title: input.title.trim(),

        message: input.message.trim(),

        unlockDate: input.unlockDate,

        createdAt: now,

        updatedAt: now,

        isOpened: false,
      };

      setCapsules((current) => [capsule, ...current]);

      return capsule;
    },
    [memories],
  );

  /* =======================================================
     UPDATE
  ======================================================= */

  const updateCapsule = useCallback(
    async (input: UpdateTimeCapsuleInput): Promise<TimeCapsule | null> => {
      const memoryExists = memories.some(
        (memory) => memory.id === input.memoryId,
      );

      if (!memoryExists) {
        return null;
      }

      let updatedCapsule: TimeCapsule | null = null;

      setCapsules((current) =>
        current.map((capsule) => {
          if (capsule.id !== input.id) {
            return capsule;
          }

          updatedCapsule = {
            ...capsule,

            memoryId: input.memoryId,

            title: input.title.trim(),

            message: input.message.trim(),

            unlockDate: input.unlockDate,

            updatedAt: new Date().toISOString(),

            isOpened:
              new Date(input.unlockDate).getTime() <= Date.now()
                ? capsule.isOpened
                : false,
          };

          return updatedCapsule;
        }),
      );

      return updatedCapsule;
    },
    [memories],
  );

  /* =======================================================
     DELETE
  ======================================================= */

  const deleteCapsule = useCallback(async (capsuleId: string) => {
    setCapsules((current) =>
      current.filter((capsule) => capsule.id !== capsuleId),
    );
  }, []);

  /* =======================================================
     GET BY ID
  ======================================================= */

  const getCapsuleById = useCallback(
    (capsuleId: string) => {
      return capsules.find((capsule) => capsule.id === capsuleId);
    },
    [capsules],
  );

  /* =======================================================
     GET FOR MEMORY
  ======================================================= */

  const getCapsulesForMemory = useCallback(
    (memoryId: string) => {
      return capsules.filter((capsule) => capsule.memoryId === memoryId);
    },
    [capsules],
  );

  /* =======================================================
     UNLOCK CHECK
  ======================================================= */

  const isCapsuleUnlocked = useCallback((capsule: TimeCapsule) => {
    const unlockTime = new Date(capsule.unlockDate).getTime();

    if (Number.isNaN(unlockTime)) {
      return false;
    }

    return unlockTime <= Date.now();
  }, []);

  /* =======================================================
     OPEN
  ======================================================= */

  const openCapsule = useCallback(
    async (capsuleId: string): Promise<boolean> => {
      let opened = false;

      setCapsules((current) =>
        current.map((capsule) => {
          if (capsule.id !== capsuleId) {
            return capsule;
          }

          const unlocked = new Date(capsule.unlockDate).getTime() <= Date.now();

          if (!unlocked) {
            return capsule;
          }

          opened = true;

          return {
            ...capsule,

            isOpened: true,

            updatedAt: new Date().toISOString(),
          };
        }),
      );

      return opened;
    },
    [],
  );

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearCapsules = useCallback(() => {
    setCapsules([]);
  }, []);

  /* =======================================================
     VALUE
  ======================================================= */

  const value = useMemo<TimeCapsuleContextValue>(
    () => ({
      capsules,

      hydrated,

      createCapsule,

      updateCapsule,

      deleteCapsule,

      getCapsuleById,

      getCapsulesForMemory,

      isCapsuleUnlocked,

      openCapsule,

      clearCapsules,
    }),
    [
      capsules,

      hydrated,

      createCapsule,

      updateCapsule,

      deleteCapsule,

      getCapsuleById,

      getCapsulesForMemory,

      isCapsuleUnlocked,

      openCapsule,

      clearCapsules,
    ],
  );

  return (
    <TimeCapsuleContext.Provider value={value}>
      {children}
    </TimeCapsuleContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useTimeCapsule() {
  const context = useContext(TimeCapsuleContext);

  if (!context) {
    throw new Error("useTimeCapsule must be used inside TimeCapsuleProvider");
  }

  return context;
}
