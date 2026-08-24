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
  deleteMemoryApi,
  getMemoryByIdApi,
  getMemoriesByUserIdApi,
  getMemoryMediaApi,
  getUnlockedMemoriesApi,
  getLockedTimeCapsulesApi,
  uploadMemoryMediaApi,
} from "./MemoryAPI";

import type { BackendMemory, Memory, MemoryType } from "./memory.types";

/* =========================================================
   CONTEXT TYPE
========================================================= */

interface MemoryContextValue {
  memories: Memory[];

  loading: boolean;

  /*
   * Kept for compatibility with existing pages.
   */
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
  ) => ReturnType<typeof getMemoryMediaApi>;

  getUnlockedMemoryList: () => Promise<BackendMemory[]>;

  getLockedTimeCapsuleList: () => Promise<BackendMemory[]>;

  clearMemories: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const MemoryContext = createContext<MemoryContextValue | undefined>(undefined);

/* =========================================================
   MEDIA TYPE DETECTION
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

    category:
      (backendMemory.prompt?.category as Memory["category"]) || "Personal",

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
     LOAD MEMORIES FROM BACKEND
  ======================================================= */

  const refreshMemories = useCallback(async () => {
    if (!user?.id) {
      setMemories([]);
      setLoading(false);

      return;
    }

    const userId = Number(user.id);

    if (!Number.isFinite(userId)) {
      setError("Invalid user ID. Unable to load memories.");

      setMemories([]);
      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError(null);

      /*
       * Backend:
       *
       * GET /api/memories/user/{userId}
       */

      const backendMemories = await getMemoriesByUserIdApi(userId);

      const mappedMemories = backendMemories.map(mapBackendMemory);

      /*
       * Media is a separate endpoint.
       */

      const memoriesWithMedia = await Promise.all(
        mappedMemories.map(async (memory: Memory): Promise<Memory> => {
          if (memory.backendId === undefined) {
            return memory;
          }

          try {
            const media = await getMemoryMediaApi(memory.backendId);

            const firstMedia = media[0];

            return {
              ...memory,

              type: detectMemoryType(firstMedia?.mediaType),

              media,

              thumbnail: firstMedia?.fileUrl || "",
            };
          } catch (mediaError) {
            /*
             * Do not make the entire
             * memory disappear if media
             * loading fails.
             */

            console.warn(
              "Unable to load media for memory:",
              memory.backendId,
              mediaError,
            );

            return memory;
          }
        }),
      );

      setMemories(memoriesWithMedia);
    } catch (requestError) {
      console.error("Unable to load memories:", requestError);

      setMemories([]);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load your memories.",
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
     ADD MEMORY
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
     UPDATE MEMORY
========================================================= */

  const updateMemory = useCallback(async (memory: Memory) => {
    /*
     * IMPORTANT:
     *
     * Current Swagger does not provide
     * PUT /api/memories/{id}.
     *
     * Therefore do not fake an update
     * request.
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
     DELETE MEMORY
  ======================================================= */

  const deleteMemory = useCallback(async (memoryId: string) => {
    const numericId = Number(memoryId);

    if (!Number.isFinite(numericId)) {
      throw new Error("Invalid memory ID.");
    }

    /*
     * Backend:
     *
     * DELETE /api/memories/{id}
     */

    await deleteMemoryApi(numericId);

    setMemories((current) =>
      current.filter((memory) => memory.id !== memoryId),
    );
  }, []);

  /* =======================================================
     GET FROM CURRENT STATE
  ======================================================= */

  const getMemoryById = useCallback(
    (memoryId: string) => memories.find((memory) => memory.id === memoryId),
    [memories],
  );

  /* =======================================================
     GET FROM BACKEND
  ======================================================= */

  const getBackendMemoryById = useCallback(async (memoryId: number) => {
    return getMemoryByIdApi(memoryId);
  }, []);

  /* =======================================================
     UPLOAD MEDIA
  ======================================================= */

  const uploadMemoryFile = useCallback(
    async (memoryId: number, file: File, mediaType: MemoryType) => {
      /*
       * Backend:
       *
       * POST /api/media/memory/{id}/upload
       */

      await uploadMemoryMediaApi(memoryId, file, mediaType);

      /*
       * Reload memory list after
       * successful upload.
       */

      await refreshMemories();
    },
    [refreshMemories],
  );

  /* =======================================================
     GET MEDIA
  ======================================================= */

  const getMemoryMediaFiles = useCallback((memoryId: number) => {
    return getMemoryMediaApi(memoryId);
  }, []);
  /* =======================================================
     GET UNLOCKED
  ======================================================= */

  const getUnlockedMemoryList = useCallback(async () => {
    if (!user?.id) {
      return [];
    }

    const userId = Number(user.id);

    if (!Number.isFinite(userId)) {
      return [];
    }

    return getUnlockedMemoriesApi(userId);
  }, [user?.id]);

  /* =======================================================
     GET LOCKED TIME CAPSULES
  ======================================================= */

  const getLockedTimeCapsuleList = useCallback(async () => {
    if (!user?.id) {
      return [];
    }

    const userId = Number(user.id);

    if (!Number.isFinite(userId)) {
      return [];
    }

    return getLockedTimeCapsulesApi(userId);
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

  const value = useMemo<MemoryContextValue>(
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
