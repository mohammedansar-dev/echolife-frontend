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
