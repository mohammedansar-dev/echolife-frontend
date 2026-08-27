import api from "../../api/axios";

import type {
  SessionRecord,
  SessionResponse,
  StartSessionRequest,
} from "./session.types";

export async function startSession(
  payload: StartSessionRequest,
): Promise<SessionResponse> {
  const response = await api.post<SessionResponse>("/api/v1/sessions", payload);

  return response.data;
}

export async function getSession(sessionId: string): Promise<SessionRecord> {
  const response = await api.get<SessionRecord>(
    `/api/v1/sessions/${sessionId}`,
  );

  return response.data;
}

export async function endSession(sessionId: string): Promise<SessionResponse> {
  const response = await api.post<SessionResponse>(
    `/api/v1/sessions/${sessionId}/end`,
  );

  return response.data;
}
