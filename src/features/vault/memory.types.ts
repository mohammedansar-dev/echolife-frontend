/* =========================================================
   ECHOLIFE MEMORY TYPES
   Backend-connected Memory domain
========================================================= */

/* =========================================================
   FRONTEND MEMORY TYPES
========================================================= */

export type MemoryType = "photo" | "video" | "audio" | "document";

/**
 * Backend currently returns/accepts category values as strings.
 * Keep this flexible so the existing Vault UI can use its
 * own category labels without TypeScript conflicts.
 */
export type MemoryCategory = string;

/* =========================================================
   BACKEND USER
========================================================= */

export interface BackendMemoryUser {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

/* =========================================================
   BACKEND PROMPT
========================================================= */

export interface BackendPrompt {
  id: number;
  question: string;
  category: string;
  active: boolean;
}

/* =========================================================
   BACKEND MEMORY
========================================================= */

export interface BackendMemory {
  id: number;

  title: string;

  description: string;

  memoryDate: string;

  isTimeCapsule: boolean;

  unlockDate: string | null;

  prompt: BackendPrompt | null;

  aiReflectionSummary: string;

  emotionalTone: string;

  user: BackendMemoryUser;

  /*
   * These fields are supported by some versions of the
   * EchoLife backend / governance integration.
   *
   * They remain optional because your verified Memory
   * endpoint does not currently require them.
   */
  aiReflection?: string | null;

  personaId?: number | null;

  responseMode?: string | null;

  createdAt?: string;

  updatedAt?: string;
}

/* =========================================================
   BACKEND CREATE MEMORY REQUEST
========================================================= */

/**
 * IMPORTANT:
 *
 * This is intentionally based on the backend request that
 * you successfully tested in Swagger.
 *
 * Do not send frontend-only fields such as:
 * - id
 * - user
 * - password
 * - createdAt
 * - updatedAt
 */
export interface CreateMemoryRequest {
  title: string;

  description: string;

  memoryDate: string;

  isTimeCapsule: boolean;

  unlockDate: string | null;

  prompt: BackendPrompt | null;

  aiReflectionSummary: string;

  emotionalTone: string;
}

/* =========================================================
   BACKEND UPDATE REQUEST
========================================================= */

export interface UpdateMemoryRequest {
  title?: string;

  description?: string;

  memoryDate?: string;

  isTimeCapsule?: boolean;

  unlockDate?: string | null;

  prompt?: BackendPrompt | null;

  aiReflectionSummary?: string;

  emotionalTone?: string;
}

/* =========================================================
   BACKEND MEMORY MEDIA
========================================================= */

export interface BackendMemoryMedia {
  id: number;

  fileUrl: string;

  mediaType: string;
}

/* =========================================================
   MEDIA COMPATIBILITY TYPES
========================================================= */

export interface MemoryMedia {
  id: number;

  fileUrl: string;

  mediaType: string;
}

export interface MemoryMediaUploadResponse {
  id?: number;

  fileUrl?: string;

  mediaType?: string;

  [key: string]: unknown;
}

export interface MemoryUploadResult {
  id?: number;

  fileUrl?: string;

  mediaType?: string;

  [key: string]: unknown;
}

/* =========================================================
   FRONTEND MEMORY
========================================================= */

/**
 * This is the model used by the existing Memory Vault UI.
 *
 * BackendMemory and Memory are intentionally different:
 *
 * BackendMemory = API representation
 * Memory        = UI representation
 */
export interface Memory {
  /**
   * String ID used by existing frontend components.
   *
   * Example:
   * "memory-1"
   * "backend-5"
   */
  id: string;

  /**
   * Actual backend database ID.
   */
  backendId?: number;

  title: string;

  description: string;

  type: MemoryType;

  fileName: string;

  /**
   * Local browser file/object URL.
   */
  fileData?: string;

  /**
   * Existing frontend uses `date`.
   * Backend uses `memoryDate`.
   */
  date: string;

  /**
   * Original backend date.
   */
  memoryDate?: string;

  /**
   * Frontend category.
   */
  category: MemoryCategory;

  /**
   * Existing frontend metadata.
   *
   * The current backend Memory response does not provide
   * a people[] field, so this is frontend-only.
   */
  people: string[];

  /**
   * Human-readable file size.
   */
  size: string;

  thumbnail?: string;

  isTimeCapsule?: boolean;

  unlockDate?: string | null;

  createdAt?: string;

  updatedAt?: string;

  aiReflection?: string | null;

  aiReflectionSummary?: string;

  emotionalTone?: string;

  personaId?: number | null;

  responseMode?: string | null;

  media?: BackendMemoryMedia[];
}

/* =========================================================
   FRONTEND CREATE INPUT
========================================================= */

export interface CreateMemoryInput {
  title: string;

  description: string;

  date: string;

  category: MemoryCategory;

  people: string[];

  type: MemoryType;

  fileName: string;

  size: string;

  thumbnail?: string;

  /**
   * Original browser file.
   *
   * This is frontend-only and is NOT sent as part of
   * the JSON memory creation request.
   */
  file?: File;

  isTimeCapsule?: boolean;

  unlockDate?: string | null;

  aiReflection?: string | null;

  aiReflectionSummary?: string;

  emotionalTone?: string;

  personaId?: number | null;

  responseMode?: string | null;
}

/* =========================================================
   FRONTEND UPDATE INPUT
========================================================= */

export interface UpdateMemoryInput {
  title?: string;

  description?: string;

  date?: string;

  category?: MemoryCategory;

  people?: string[];

  type?: MemoryType;

  fileName?: string;

  size?: string;

  thumbnail?: string;

  fileData?: string;

  file?: File;

  isTimeCapsule?: boolean;

  unlockDate?: string | null;

  aiReflection?: string | null;

  aiReflectionSummary?: string;

  emotionalTone?: string;

  personaId?: number | null;

  responseMode?: string | null;
}

/* =========================================================
   MEMORY API RESULT TYPES
========================================================= */

export interface MemoryListResponse extends Array<BackendMemory> {}

export interface MemoryResponse extends BackendMemory {}
