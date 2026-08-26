import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "../auth/AuthContext";

import {
  createMemory as createMemoryApi,
  deleteMemory as deleteMemoryApi,
  getMemoryById as getMemoryByIdApi,
  getMemories as getMemoriesApi,
  updateMemory as updateMemoryApi,
} from "./MemoryAPI";

import type {
  CreateMemoryInput,
  Memory,
  UpdateMemoryInput,
} from "./memory.types";

/* =========================================================
   TYPES
========================================================= */

interface MemoryContextValue {
  memories: Memory[];

  /* Current naming */
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  /* Compatibility with existing Memory pages */
  loading: boolean;
  initialized: boolean;

  error: string | null;

  refreshMemories: () => Promise<void>;

  getMemory: (id: string | number) => Promise<Memory | null>;

  /*
   * Existing MemoryDetailsPage uses this name.
   * Keep it as an alias of getMemory().
   */
  getMemoryById: (id: string | number) => Promise<Memory | null>;

  addMemory: (input: CreateMemoryInput) => Promise<Memory>;

  updateMemory: (
    id: string | number,
    input: UpdateMemoryInput,
  ) => Promise<Memory>;

  removeMemory: (id: string | number) => Promise<void>;

  /*
   * Existing MemoryDetailsPage uses deleteMemory().
   * Keep it as an alias of removeMemory().
   */
  deleteMemory: (id: string | number) => Promise<void>;

  clearError: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const MemoryContext = createContext<MemoryContextValue | undefined>(undefined);

/* =========================================================
   PROVIDER PROPS
========================================================= */

interface MemoryProviderProps {
  children: ReactNode;
}

/* =========================================================
   PROVIDER
========================================================= */

export function MemoryProvider({ children }: MemoryProviderProps) {
  /*
   * IMPORTANT:
   *
   * AuthContext is the single source of truth
   * for the currently logged-in user.
   *
   * We do NOT independently read userId from
   * localStorage here.
   */

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  /* =======================================================
     STATE
  ======================================================= */

  const [memories, setMemories] = useState<Memory[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isCreating, setIsCreating] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [initialized, setInitialized] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     USER ID
  ======================================================= */

  const userId = useMemo(() => {
    if (!user?.id) {
      return null;
    }

    const parsed = Number(user.id);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }

    return parsed;
  }, [user?.id]);

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =======================================================
     GET ALL MEMORIES
  ======================================================= */

  const refreshMemories = useCallback(async () => {
    /*
     * Wait until authentication has finished restoring.
     */

    if (authLoading) {
      return;
    }

    /*
     * If there is no authenticated user,
     * clear memory state.
     */

    if (!isAuthenticated || userId === null) {
      setMemories([]);
      setInitialized(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getMemoriesApi(userId);

      setMemories(Array.isArray(result) ? result : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load memories.";

      setError(message);
    } finally {
      setIsLoading(false);
      setInitialized(true);
    }
  }, [authLoading, isAuthenticated, userId]);

  /* =======================================================
     INITIAL LOAD / USER CHANGE
  ======================================================= */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    void refreshMemories();
  }, [authLoading, refreshMemories]);

  /* =======================================================
     GET SINGLE MEMORY
  ======================================================= */

  const getMemory = useCallback(
    async (id: string | number): Promise<Memory | null> => {
      if (!isAuthenticated || userId === null) {
        const message = "Please log in before viewing a memory.";

        setError(message);

        return null;
      }

      setError(null);

      try {
        return await getMemoryByIdApi(id);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load memory.";

        setError(message);

        return null;
      }
    },
    [isAuthenticated, userId],
  );

  /* =======================================================
     GET MEMORY BY ID
     Compatibility alias
  ======================================================= */

  const getMemoryById = useCallback(
    async (id: string | number): Promise<Memory | null> => {
      return getMemory(id);
    },
    [getMemory],
  );

  /* =======================================================
     CREATE MEMORY
  ======================================================= */

  const addMemory = useCallback(
    async (input: CreateMemoryInput): Promise<Memory> => {
      /*
       * IMPORTANT:
       *
       * If this condition passes, the frontend
       * knows the user is logged in.
       *
       * The actual backend request is then sent
       * using the REAL database user ID.
       */

      if (!isAuthenticated || userId === null) {
        const message = "Please log in before creating a memory.";

        setError(message);

        throw new Error(message);
      }

      setIsCreating(true);
      setError(null);

      try {
        const createdMemory = await createMemoryApi(userId, input);

        setMemories((current) => {
          const alreadyExists = current.some(
            (memory) =>
              memory.id === createdMemory.id ||
              memory.backendId === createdMemory.backendId,
          );

          if (alreadyExists) {
            return current.map((memory) =>
              memory.id === createdMemory.id ||
              memory.backendId === createdMemory.backendId
                ? createdMemory
                : memory,
            );
          }

          return [createdMemory, ...current];
        });

        return createdMemory;
      } catch (err) {
        /*
         * Preserve the actual backend error.
         *
         * For example:
         *
         * 403 Consent / Security Violation
         *
         * should NOT be converted into
         * "Please log in".
         */

        const message =
          err instanceof Error ? err.message : "Unable to create memory.";

        setError(message);

        throw new Error(message);
      } finally {
        setIsCreating(false);
      }
    },
    [isAuthenticated, userId],
  );

  /* =======================================================
     UPDATE MEMORY
  ======================================================= */

  const updateMemory = useCallback(
    async (id: string | number, input: UpdateMemoryInput): Promise<Memory> => {
      if (!isAuthenticated || userId === null) {
        const message = "Please log in before updating a memory.";

        setError(message);

        throw new Error(message);
      }

      setIsUpdating(true);
      setError(null);

      try {
        const updatedMemory = await updateMemoryApi(id, input);

        setMemories((current) =>
          current.map((memory) =>
            memory.id === String(id) || memory.backendId === Number(id)
              ? updatedMemory
              : memory,
          ),
        );

        return updatedMemory;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to update memory.";

        setError(message);

        throw new Error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [isAuthenticated, userId],
  );

  /* =======================================================
     DELETE MEMORY
  ======================================================= */

  const removeMemory = useCallback(
    async (id: string | number): Promise<void> => {
      if (!isAuthenticated || userId === null) {
        const message = "Please log in before deleting a memory.";

        setError(message);

        throw new Error(message);
      }

      setIsDeleting(true);
      setError(null);

      try {
        await deleteMemoryApi(id);

        setMemories((current) =>
          current.filter(
            (memory) =>
              memory.id !== String(id) && memory.backendId !== Number(id),
          ),
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to delete memory.";

        setError(message);

        throw new Error(message);
      } finally {
        setIsDeleting(false);
      }
    },
    [isAuthenticated, userId],
  );

  /* =======================================================
     DELETE MEMORY
     Compatibility alias
  ======================================================= */

  const deleteMemory = useCallback(
    async (id: string | number): Promise<void> => {
      return removeMemory(id);
    },
    [removeMemory],
  );

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo<MemoryContextValue>(
    () => ({
      memories,

      /* Current state names */
      isLoading,
      isCreating,
      isUpdating,
      isDeleting,

      /* Compatibility names */
      loading: isLoading,
      initialized,

      error,

      /* Memory loading */
      refreshMemories,

      /* Single memory */
      getMemory,
      getMemoryById,

      /* Create */
      addMemory,

      /* Update */
      updateMemory,

      /* Delete */
      removeMemory,
      deleteMemory,

      /* Error */
      clearError,
    }),
    [
      memories,

      isLoading,
      isCreating,
      isUpdating,
      isDeleting,

      initialized,

      error,

      refreshMemories,

      getMemory,
      getMemoryById,

      addMemory,

      updateMemory,

      removeMemory,
      deleteMemory,

      clearError,
    ],
  );

  return (
    <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useMemory(): MemoryContextValue {
  const context = useContext(MemoryContext);

  if (!context) {
    throw new Error("useMemory must be used inside MemoryProvider");
  }

  return context;
}

export default MemoryContext;
