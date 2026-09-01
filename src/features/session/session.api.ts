import sessionApi from "../../api/sessionAxios";

import type {
  SendMessageRequest,
  SendMessageResponse,
  SessionListItem,
  SessionMessage,
  SessionRecord,
  SessionResponse,
  StartSessionRequest,
} from "./session.types";

/* =========================================================
   START SESSION

   POST /api/v1/sessions
========================================================= */

export async function startSession(
  payload: StartSessionRequest,
): Promise<SessionResponse> {
  const response = await sessionApi.post<SessionResponse>(
    "/api/v1/sessions",
    payload,
  );

  return response.data;
}

/* =========================================================
   GET SESSION

   GET /api/v1/sessions/{sessionId}
========================================================= */

export async function getSession(sessionId: string): Promise<SessionRecord> {
  const response = await sessionApi.get<SessionRecord>(
    `/api/v1/sessions/${encodeURIComponent(sessionId)}`,
  );

  return response.data;
}

/* =========================================================
   END SESSION

   POST /api/v1/sessions/{sessionId}/end
========================================================= */

export async function endSession(sessionId: string): Promise<SessionResponse> {
  const response = await sessionApi.post<SessionResponse>(
    `/api/v1/sessions/${encodeURIComponent(sessionId)}/end`,
  );

  return response.data;
}

/* =========================================================
   GET SESSION LIST

   GET /api/v1/sessions
========================================================= */

export async function getSessions(): Promise<SessionListItem[]> {
  const response = await sessionApi.get<
    SessionListItem[] | { data?: SessionListItem[] }
  >("/api/v1/sessions");

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.data ?? [];
}

/* =========================================================
   GET MESSAGE HISTORY

   GET /api/v1/sessions/{sessionId}/messages
========================================================= */

export async function getSessionMessages(
  sessionId: string,
): Promise<SessionMessage[]> {
  const response = await sessionApi.get<
    SessionMessage[] | { data?: SessionMessage[] }
  >(`/api/v1/sessions/${encodeURIComponent(sessionId)}/messages`);

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.data ?? [];
}

/* =========================================================
   SEND MESSAGE

   POST /api/v1/sessions/{sessionId}/messages
========================================================= */

export async function sendSessionMessage(
  sessionId: string,
  payload: SendMessageRequest,
): Promise<SendMessageResponse | SessionMessage> {
  const response = await sessionApi.post<SendMessageResponse | SessionMessage>(
    `/api/v1/sessions/${encodeURIComponent(sessionId)}/messages`,
    payload,
  );

  return response.data;
}
