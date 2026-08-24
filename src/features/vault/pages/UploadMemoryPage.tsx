import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "../../auth/AuthContext";

import {
  deleteMemoryApi,
  getMemoryByIdApi,
  getMemoriesByUserIdApi,
  getMemoryMediaApi,
  getUnlockedMemoriesApi,
  getLockedTimeCapsulesApi,
  uploadMemoryMediaApi,
} from "../MemoryAPI";

import type { BackendMemory, Memory, MemoryType } from "../memory.types";

/* =========================================================
   CONTEXT TYPE
========================================================= */

interface MemoryContextValue {
  memories: Memory[];

  loading: boolean;

  hydrated: boolean;

  error: string | null;

  refreshMemories: () => Promise<void>;

  addMemory: (memory: Memory) => Promise<void>;

  updateMemory: (memory: Memory) => Promise<void>;

  deleteMemory: (memoryId: string) => Promise<void>;

  getMemoryById: (memoryId: string) => Memory | undefined;

  getBackendMemoryById: (memoryId: number) => Promise<BackendMemory>;

  uploadMemoryFile: (
    memoryId: number,
    file: File,
    mediaType: MemoryType,
  ) => Promise<void>;

  getMemoryMediaFiles: (
    memoryId: number,
  ) => Promise<Awaited<ReturnType<typeof getMemoryMediaApi>>>;

  getUnlockedMemoryList: () => Promise<BackendMemory[]>;

  getLockedTimeCapsuleList: () => Promise<BackendMemory[]>;

  clearMemories: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const MemoryContext = createContext<MemoryContextValue | undefined>(undefined);

/* =========================================================
   MEDIA TYPE
========================================================= */

function detectMemoryType(mediaType?: string): MemoryType {
  const type = (mediaType || "").toLowerCase();

  if (type.includes("image") || type.includes("photo")) {
    return "photo";
  }

  if (type.includes("video") || type.includes("mp4") || type.includes("mov")) {
    return "video";
  }

  if (type.includes("audio") || type.includes("mp3") || type.includes("wav")) {
    return "audio";
  }

  return "document";
}

/* =========================================================
   BACKEND → FRONTEND
========================================================= */

function mapBackendMemory(backendMemory: BackendMemory): Memory {
  return {
    id: String(backendMemory.id),

    backendId: backendMemory.id,

    title: backendMemory.title || "Untitled Memory",

    description: backendMemory.description || "",

    type: "document",

    fileName: "",

    fileData: "",

    date: backendMemory.memoryDate,

    category: backendMemory.prompt?.category || "Personal",

    people: [],

    size: "",

    thumbnail: "",

    isTimeCapsule: backendMemory.isTimeCapsule,

    unlockDate: backendMemory.unlockDate || undefined,

    createdAt: backendMemory.memoryDate
      ? `${backendMemory.memoryDate}T00:00:00.000Z`
      : new Date().toISOString(),

    aiReflectionSummary: backendMemory.aiReflectionSummary,

    emotionalTone: backendMemory.emotionalTone,

    media: [],
  };
}

/* =========================================================
   PROVIDER
========================================================= */

export function MemoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [memories, setMemories] = useState<Memory[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     LOAD
  ======================================================= */

  const refreshMemories = useCallback(async () => {
    if (!user?.id) {
      setMemories([]);
      setLoading(false);
      return;
    }

    const userId = Number(user.id);

    if (!Number.isFinite(userId)) {
      setError("Invalid user ID.");

      setMemories([]);
      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError(null);

      const backendMemories = await getMemoriesByUserIdApi(userId);

      const mapped = backendMemories.map(mapBackendMemory);

      const withMedia = await Promise.all(
        mapped.map(async (memory: Memory) => {
          if (memory.backendId === undefined) {
            return memory;
          }

          try {
            const media = await getMemoryMediaApi(memory.backendId);

            const first = media[0];

            return {
              ...memory,

              type: detectMemoryType(first?.mediaType),

              media,

              thumbnail: first?.fileUrl || "",
            };
          } catch {
            return memory;
          }
        }),
      );

      setMemories(withMedia);
    } catch (requestError) {
      console.error("Unable to load memories:", requestError);

      setMemories([]);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load memories.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    void refreshMemories();
  }, [refreshMemories]);

  /* =======================================================
     HYDRATED
  ======================================================= */

  const hydrated = !loading;

  /* =======================================================
     ADD
  ======================================================= */

  const addMemory = useCallback(async (memory: Memory) => {
    setMemories((current) => {
      const exists = current.some((item) => item.id === memory.id);

      if (exists) {
        return current;
      }

      return [memory, ...current];
    });
  }, []);

  /* =======================================================
     UPDATE
  ======================================================= */

  const updateMemory = useCallback(async (memory: Memory) => {
    /*
     * Backend currently has no
     * PUT /api/memories/{id}.
     *
     * Keep this local for compatibility
     * until backend exposes update.
     */

    setMemories((current) =>
      current.map((item) =>
        item.id === memory.id
          ? {
              ...item,
              ...memory,
            }
          : item,
      ),
    );
  }, []);

  /* =======================================================
     DELETE
  ======================================================= */

  const deleteMemory = useCallback(async (memoryId: string) => {
    const numericId = Number(memoryId);

    if (!Number.isFinite(numericId)) {
      throw new Error("Invalid memory ID.");
    }

    await deleteMemoryApi(numericId);

    setMemories((current) =>
      current.filter((memory) => memory.id !== memoryId),
    );
  }, []);

  /* =======================================================
     GET CURRENT MEMORY
  ======================================================= */

  const getMemoryById = useCallback(
    (memoryId: string) => memories.find((memory) => memory.id === memoryId),
    [memories],
  );

  /* =======================================================
     GET BACKEND MEMORY
  ======================================================= */

  const getBackendMemoryById = useCallback(
    async (memoryId: number) => getMemoryByIdApi(memoryId),
    [],
  );

  /* =======================================================
     UPLOAD MEDIA
  ======================================================= */

  const uploadMemoryFile = useCallback(
    async (memoryId: number, file: File, mediaType: MemoryType) => {
      await uploadMemoryMediaApi(memoryId, file, mediaType);

      await refreshMemories();
    },
    [refreshMemories],
  );

  /* =======================================================
     GET MEDIA
  ======================================================= */

  const getMemoryMediaFiles = useCallback(async (memoryId: number) => {
    return getMemoryMediaApi(memoryId);
  }, []);

  /* =======================================================
     UNLOCKED
  ======================================================= */

  const getUnlockedMemoryList = useCallback(async () => {
    if (!user?.id) {
      return [];
    }

    return getUnlockedMemoriesApi(Number(user.id));
  }, [user?.id]);

  /* =======================================================
     LOCKED TIME CAPSULES
  ======================================================= */

  const getLockedTimeCapsuleList = useCallback(async () => {
    if (!user?.id) {
      return [];
    }

    return getLockedTimeCapsulesApi(Number(user.id));
  }, [user?.id]);

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearMemories = useCallback(() => {
    setMemories([]);
  }, []);

  /* =======================================================
     VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      memories,
      loading,
      hydrated,
      error,

      refreshMemories,

      addMemory,
      updateMemory,
      deleteMemory,

      getMemoryById,
      getBackendMemoryById,

      uploadMemoryFile,

      getMemoryMediaFiles,

      getUnlockedMemoryList,

      getLockedTimeCapsuleList,

      clearMemories,
    }),
    [
      memories,
      loading,
      hydrated,
      error,
      refreshMemories,
      addMemory,
      updateMemory,
      deleteMemory,
      getMemoryById,
      getBackendMemoryById,
      uploadMemoryFile,
      getMemoryMediaFiles,
      getUnlockedMemoryList,
      getLockedTimeCapsuleList,
      clearMemories,
    ],
  );

  return (
    <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useMemory() {
  const context = useContext(MemoryContext);

  if (!context) {
    throw new Error("useMemory must be used inside MemoryProvider");
  }

  return context;
}
