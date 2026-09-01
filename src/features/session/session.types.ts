export type SessionMode =
  | "BLESSING"
  | "STORY"
  | "ADVICE"
  | "CHECK_IN"
  | "REFLECTION";

export type SessionChannel = "TEXT" | "VOICE" | "AVATAR";

export type SessionStatus = "ACTIVE" | "ENDED" | "EXPIRED";

export interface StartSessionRequest {
  personaId: string;
  mode: SessionMode;
  inputChannel: SessionChannel;
  outputChannel: SessionChannel;
  clientType: string;
}

export interface SessionResponse {
  sessionId: string;
  userId: string;
  personaId: string;
  mode: SessionMode;
  status: SessionStatus;
  outputChannel: SessionChannel;
  degraded: boolean;
  policyVersion: number;
}

export interface SessionRecord {
  sessionId: string;
  userId: string;
  personaId: string;
  mode: SessionMode;
  inputChannel: SessionChannel;
  outputChannel: SessionChannel;
  clientType: string;
  status: SessionStatus;
  createdAt: string;
  expiresAtEpoch: number;
  policyVersion: number;
}

/*
 * Session list item.
 *
 * Keep the backend session object as the source of truth.
 */
export type SessionListItem = SessionRecord;

/*
 * Message returned by S3.
 *
 * The backend can add additional fields without
 * breaking the frontend.
 */
export interface SessionMessage {
  id: string | number;
  sessionId?: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  createdAt: string;
}

/*
 * Send message request.
 */
export interface SendMessageRequest {
  message: string;
}

/*
 * Flexible message response wrapper.
 *
 * This allows the frontend to handle the common
 * { data: ... } response shape without generating
 * fake content.
 */
export interface SendMessageResponse {
  message?: SessionMessage;
  data?: SessionMessage;
}
