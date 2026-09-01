import api from "../../api/axios";

/* =========================================================
   CONSENT TYPES
========================================================= */

export type ConsentType = "TERMS" | "MEMORY_PROCESSING" | "AI_INTERACTION";

export interface ConsentItem {
  type: ConsentType;
  accepted: boolean;
}

export interface SubmitConsentRequest {
  consents: ConsentItem[];
}

export interface ConsentResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

/* =========================================================
   GET CONSENTS
   Backend:
   GET /api/v1/consents/{personaId}
========================================================= */

export async function getConsents(personaId: string): Promise<ConsentResponse> {
  const response = await api.get<ConsentResponse>(
    `/api/v1/consents/${encodeURIComponent(personaId)}`,
  );

  return response.data;
}

/* =========================================================
   SUBMIT / UPDATE CONSENTS
   Backend:
   POST /api/v1/consents

   NOTE:
   The exact request contract must match the S1 backend.
   Keep this function isolated so only this file needs
   changing if Basavaraj provides a different DTO.
========================================================= */

export async function submitConsents(
  payload: SubmitConsentRequest,
): Promise<ConsentResponse> {
  const response = await api.post<ConsentResponse>("/api/v1/consents", payload);

  return response.data;
}

/* =========================================================
   WITHDRAW CONSENT
   Backend:
   POST /api/v1/consents/{personaId}/withdraw
========================================================= */

export async function withdrawConsent(
  personaId: string,
): Promise<ConsentResponse> {
  const response = await api.post<ConsentResponse>(
    `/api/v1/consents/${encodeURIComponent(personaId)}/withdraw`,
  );

  return response.data;
}

/* =========================================================
   ERASURE
   Backend:
   POST /api/v1/consents/{personaId}/erasure
========================================================= */

export async function requestConsentErasure(
  personaId: string,
): Promise<ConsentResponse> {
  const response = await api.post<ConsentResponse>(
    `/api/v1/consents/${encodeURIComponent(personaId)}/erasure`,
  );

  return response.data;
}
