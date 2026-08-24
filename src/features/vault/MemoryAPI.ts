import api from "../../api/axios";

import type {
  BackendMemory,
  BackendMemoryMedia,
  CreateMemoryRequest,
  MemoryMediaUploadResponse,
  MemoryType,
} from "./memory.types";

/* =========================================================
   GET USER MEMORIES
========================================================= */

export async function getMemoriesByUserIdApi(
  userId: number,
): Promise<BackendMemory[]> {
  const response = await api.get<BackendMemory[]>(
    `/api/memories/user/${userId}`,
  );

  return response.data;
}

/* =========================================================
   CREATE MEMORY
========================================================= */

export async function createMemoryApi(
  userId: number,
  payload: CreateMemoryRequest,
): Promise<BackendMemory> {
  const response = await api.post<BackendMemory>(
    `/api/memories/user/${userId}`,
    payload,
  );

  return response.data;
}

/* =========================================================
   GET MEMORY
========================================================= */

export async function getMemoryByIdApi(
  memoryId: number,
): Promise<BackendMemory> {
  const response = await api.get<BackendMemory>(`/api/memories/${memoryId}`);

  return response.data;
}

/* =========================================================
   DELETE MEMORY
========================================================= */

export async function deleteMemoryApi(memoryId: number): Promise<void> {
  await api.delete(`/api/memories/${memoryId}`);
}

/* =========================================================
   GET UNLOCKED MEMORIES
========================================================= */

export async function getUnlockedMemoriesApi(
  userId: number,
): Promise<BackendMemory[]> {
  const response = await api.get<BackendMemory[]>(
    `/api/memories/user/${userId}/unlocked`,
  );

  return response.data;
}

/* =========================================================
   GET LOCKED TIME CAPSULES
========================================================= */

export async function getLockedTimeCapsulesApi(
  userId: number,
): Promise<BackendMemory[]> {
  const response = await api.get<BackendMemory[]>(
    `/api/memories/user/${userId}/time-capsules`,
  );

  return response.data;
}

/* =========================================================
   UPLOAD MEDIA
========================================================= */

export async function uploadMemoryMediaApi(
  memoryId: number,
  file: File,
  mediaType: MemoryType,
): Promise<MemoryMediaUploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<MemoryMediaUploadResponse>(
    `/api/media/memory/${memoryId}/upload`,
    formData,
    {
      params: {
        mediaType,
      },
    },
  );

  return response.data;
}

/* =========================================================
   GET MEMORY MEDIA
========================================================= */

export async function getMemoryMediaApi(
  memoryId: number,
): Promise<BackendMemoryMedia[]> {
  const response = await api.get<BackendMemoryMedia[]>(
    `/api/media/memory/${memoryId}`,
  );

  return response.data;
}

/* =========================================================
   MEDIA FILE URL
========================================================= */

export function getMediaFileUrl(fileUrl: string): string {
  if (!fileUrl) {
    return "";
  }

  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  return `${baseUrl}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
}
