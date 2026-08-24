import api from "./api";

/* =====================================================
   TYPES
===================================================== */

export interface BackendMemoryMedia {
  id: number;

  mediaType: string;

  mediaUrl: string;

  memory: unknown;
}

/* =====================================================
   UPLOAD MEDIA
===================================================== */

export async function uploadMemoryMedia(
  memoryId: number,
  file: File,
  mediaType: string,
): Promise<BackendMemoryMedia> {
  const formData = new FormData();

  formData.append("file", file);

  formData.append("mediaType", mediaType);

  const response = await api.post<BackendMemoryMedia>(
    `/api/media/memory/${memoryId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

/* =====================================================
   GET MEDIA FOR MEMORY
===================================================== */

export async function getMemoryMedia(
  memoryId: number,
): Promise<BackendMemoryMedia[]> {
  const response = await api.get<BackendMemoryMedia[]>(
    `/api/media/memory/${memoryId}`,
  );

  return response.data;
}

/* =====================================================
   BUILD FILE URL
===================================================== */

export function getMediaFileUrl(mediaUrl: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  /*
   * Backend currently returns a file URL.
   *
   * If it returns:
   * uploads/example.jpg
   * or
   * example.jpg
   *
   * normalize it into the backend file endpoint.
   */

  const normalized = mediaUrl.replace(/^\/+/, "").replace(/^uploads\//, "");

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  return `${baseUrl}/api/media/files/${encodeURIComponent(normalized)}`;
}
