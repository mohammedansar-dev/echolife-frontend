import sessionApi from "../../api/sessionAxios";

import type {
  SessionRecord,
  SessionResponse,
  StartSessionRequest,
} from "./session.types";

/* =========================================================
   START SESSION
   Backend:
   POST http://localhost:8082/api/v1/sessions
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
   Backend:
   GET http://localhost:8082/api/v1/sessions/{sessionId}
   ========================================================= */

export async function getSession(sessionId: string): Promise<SessionRecord> {
  const response = await sessionApi.get<SessionRecord>(
    `/api/v1/sessions/${sessionId}`,
  );

  return response.data;
}

/* =========================================================
   END SESSION
   Backend:
   POST http://localhost:8082/api/v1/sessions/{sessionId}/end
   ========================================================= */

export async function endSession(sessionId: string): Promise<SessionResponse> {
  const response = await sessionApi.post<SessionResponse>(
    `/api/v1/sessions/${sessionId}/end`,
  );

  return response.data;
}
