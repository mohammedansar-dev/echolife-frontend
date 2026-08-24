import api from "./api";

/* =====================================================
   TYPES
===================================================== */

export interface BackendMemory {
  id: number;

  title: string;

  description: string | null;

  memoryDate: string | null;

  isTimeCapsule: boolean;

  unlockDate: string | null;

  prompt: unknown | null;

  aiReflectionSummary: string | null;

  emotionalTone: string | null;

  user: unknown;
}

export interface CreateMemoryRequest {
  title: string;

  description?: string;

  memoryDate?: string;

  isTimeCapsule?: boolean;

  unlockDate?: string;

  emotionalTone?: string;
}

/* =====================================================
   CREATE MEMORY
===================================================== */

export async function createMemory(
  userId: number,
  data: CreateMemoryRequest,
): Promise<BackendMemory> {
  const response = await api.post<BackendMemory>(
    `/api/memories/user/${userId}`,
    data,
  );

  return response.data;
}

/* =====================================================
   CREATE MEMORY FROM PROMPT
===================================================== */

export async function createMemoryFromPrompt(
  userId: number,
  promptId: number,
  data: CreateMemoryRequest,
): Promise<BackendMemory> {
  const response = await api.post<BackendMemory>(
    `/api/memories/user/${userId}/prompt/${promptId}`,
    data,
  );

  return response.data;
}

/* =====================================================
   GET ALL MEMORIES
===================================================== */

export async function getAllMemories(): Promise<BackendMemory[]> {
  const response = await api.get<BackendMemory[]>("/api/memories");

  return response.data;
}

/* =====================================================
   GET USER MEMORIES
===================================================== */

export async function getUserMemories(
  userId: number,
): Promise<BackendMemory[]> {
  const response = await api.get<BackendMemory[]>(
    `/api/memories/user/${userId}`,
  );

  return response.data;
}

/* =====================================================
   GET UNLOCKED MEMORIES
===================================================== */

export async function getUnlockedMemories(
  userId: number,
): Promise<BackendMemory[]> {
  const response = await api.get<BackendMemory[]>(
    `/api/memories/user/${userId}/unlocked`,
  );

  return response.data;
}

/* =====================================================
   GET TIME CAPSULES
===================================================== */

export async function getTimeCapsules(
  userId: number,
): Promise<BackendMemory[]> {
  const response = await api.get<BackendMemory[]>(
    `/api/memories/user/${userId}/time-capsules`,
  );

  return response.data;
}

/* =====================================================
   GET SINGLE MEMORY
===================================================== */

export async function getMemory(memoryId: number): Promise<BackendMemory> {
  const response = await api.get<BackendMemory>(`/api/memories/${memoryId}`);

  return response.data;
}

/* =====================================================
   DELETE MEMORY
===================================================== */

export async function deleteMemory(memoryId: number): Promise<string> {
  const response = await api.delete<string>(`/api/memories/${memoryId}`);

  return response.data;
}
