import api from "../../api/axios";

import type {
  CreateMemoryInput,
  Memory,
  UpdateMemoryInput,
} from "./memory.types";

/* =========================================================
   HELPERS
========================================================= */

function normalizeMemory(data: any): Memory {
  const backendId = typeof data?.id === "number" ? data.id : Number(data?.id);

  const date =
    data?.memoryDate || data?.date || new Date().toISOString().slice(0, 10);

  return {
    id: String(backendId),

    backendId: Number.isFinite(backendId) ? backendId : undefined,

    title: data?.title || "",

    description: data?.description || "",

    type:
      data?.type === "video" ||
      data?.type === "audio" ||
      data?.type === "document"
        ? data.type
        : "photo",

    fileName: data?.fileName || "",

    fileData: data?.fileData,

    date,

    memoryDate: data?.memoryDate || date,

    category: data?.category || "Other",

    people: Array.isArray(data?.people) ? data.people : [],

    size: data?.size || "",

    thumbnail: data?.thumbnail,

    isTimeCapsule: Boolean(data?.isTimeCapsule),

    unlockDate: data?.unlockDate ?? null,

    createdAt: data?.createdAt,

    updatedAt: data?.updatedAt,

    aiReflectionSummary: data?.aiReflectionSummary,

    emotionalTone: data?.emotionalTone,

    media: Array.isArray(data?.media) ? data.media : [],
  };
}

/* =========================================================
   GET MEMORIES
========================================================= */

export async function getMemories(userId: number): Promise<Memory[]> {
  const response = await api.get(`/api/memories/user/${userId}`);

  const data = response.data;

  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.memories)
      ? data.memories
      : [];

  return list.map(normalizeMemory);
}

/* =========================================================
   GET SINGLE MEMORY
========================================================= */

export async function getMemoryById(id: string | number): Promise<Memory> {
  const response = await api.get(`/api/memories/${id}`);

  return normalizeMemory(response.data);
}

/* =========================================================
   CREATE MEMORY
========================================================= */

export async function createMemory(
  userId: number,
  input: CreateMemoryInput,
): Promise<Memory> {
  const payload = {
    title: input.title.trim(),

    description: input.description.trim(),

    memoryDate: input.date,

    isTimeCapsule: input.isTimeCapsule ?? false,

    unlockDate: input.unlockDate ?? null,

    emotionalTone: input.emotionalTone || "",

    aiReflectionSummary: input.aiReflectionSummary || "",
  };

  const response = await api.post(`/api/memories/user/${userId}`, payload);

  return normalizeMemory(response.data);
}

/* =========================================================
   UPDATE MEMORY
========================================================= */

export async function updateMemory(
  id: string | number,
  input: UpdateMemoryInput,
): Promise<Memory> {
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) {
    payload.title = input.title.trim();
  }

  if (input.description !== undefined) {
    payload.description = input.description.trim();
  }

  if (input.date !== undefined) {
    payload.memoryDate = input.date;
  }

  if (input.category !== undefined) {
    payload.category = input.category;
  }

  if (input.isTimeCapsule !== undefined) {
    payload.isTimeCapsule = input.isTimeCapsule;
  }

  if (input.unlockDate !== undefined) {
    payload.unlockDate = input.unlockDate;
  }

  if (input.aiReflectionSummary !== undefined) {
    payload.aiReflectionSummary = input.aiReflectionSummary;
  }

  if (input.emotionalTone !== undefined) {
    payload.emotionalTone = input.emotionalTone;
  }

  const response = await api.put(`/api/memories/${id}`, payload);

  return normalizeMemory(response.data);
}

/* =========================================================
   DELETE MEMORY
========================================================= */

export async function deleteMemory(id: string | number): Promise<void> {
  await api.delete(`/api/memories/${id}`);
}
