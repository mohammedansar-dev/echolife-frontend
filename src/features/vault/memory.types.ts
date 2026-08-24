/* =========================================================
   MEMORY TYPES
   EchoLife Backend Integration
========================================================= */

export type MemoryType = "photo" | "video" | "audio" | "document";

/* =========================================================
   MEMORY CATEGORY
========================================================= */

export type MemoryCategory = string;

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
}

/* =========================================================
   CREATE MEMORY REQUEST
========================================================= */

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
   BACKEND MEDIA
========================================================= */

export interface BackendMemoryMedia {
  id: number;

  fileUrl: string;

  mediaType: string;
}

/* =========================================================
   MEDIA UPLOAD RESPONSE
========================================================= */

export interface MemoryMediaUploadResponse {
  id?: number;

  fileUrl?: string;

  mediaType?: string;

  [key: string]: unknown;
}

/* =========================================================
   FRONTEND MEMORY
========================================================= */

export interface Memory {
  id: string;
  backendId?: number;

  title: string;

  description: string;

  type: MemoryType;

  fileName: string;

  fileData?: string;

  /*
   * Used by older upload/mock components.
   */
  file?: File;

  date: string;

  category: MemoryCategory;

  people: string[];

  size: string;

  thumbnail?: string;

  isTimeCapsule?: boolean;

  unlockDate?: string;

  /*
   * Optional because older mock memories
   * don't contain createdAt.
   */
  createdAt?: string;

  aiReflectionSummary?: string;

  emotionalTone?: string;

  media?: BackendMemoryMedia[];
}
