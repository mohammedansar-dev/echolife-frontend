import api from "../../api/axios";

import { startSession, getSession, endSession } from "../session/session.api";

import type {
  SessionMode,
  SessionChannel,
  SessionRecord,
  SessionResponse,
} from "../session/session.types";

/* =========================================================
   PERSONA CONFIGURATION
========================================================= */

export interface PersonaConfiguration {
  name: string;
  tone: string;
  selectedMemoryIds: string[];
}

export interface PersonaConfigurationResponse {
  success: boolean;
  message: string;
  data?: PersonaConfiguration;
}

/* =========================================================
   PERSONA CONVERSATION
========================================================= */

export interface PersonaConversationRequest {
  message: string;
  personaName: string;
  tone: string;
  memoryIds: string[];
}

export interface PersonaConversationResponse {
  success: boolean;
  message: string;
  data?: {
    response: string;
  };
}

/* =========================================================
   PERSONA SESSION
========================================================= */

export interface PersonaSessionRequest {
  personaId: string;
  mode: SessionMode;
  inputChannel: SessionChannel;
  outputChannel: SessionChannel;
  clientType: string;
}

/* =========================================================
   SAVE PERSONA
========================================================= */

export async function savePersonaConfiguration(
  configuration: PersonaConfiguration,
): Promise<PersonaConfigurationResponse> {
  const response = await api.post<PersonaConfigurationResponse>(
    "/api/persona/configuration",
    configuration,
  );

  return response.data;
}

/* =========================================================
   GET PERSONA
========================================================= */

export async function getPersonaConfiguration(): Promise<PersonaConfigurationResponse> {
  const response = await api.get<PersonaConfigurationResponse>(
    "/api/persona/configuration",
  );

  return response.data;
}

/* =========================================================
   RESET PERSONA
========================================================= */

export async function resetPersonaConfiguration(): Promise<PersonaConfigurationResponse> {
  const response = await api.delete<PersonaConfigurationResponse>(
    "/api/persona/configuration",
  );

  return response.data;
}

/* =========================================================
   SEND PERSONA MESSAGE
========================================================= */

export async function sendPersonaMessage(
  request: PersonaConversationRequest,
): Promise<PersonaConversationResponse> {
  const response = await api.post<PersonaConversationResponse>(
    "/api/persona/conversation",
    request,
  );

  return response.data;
}

/* =========================================================
   START PERSONA SESSION
========================================================= */

export async function startPersonaSession(
  request: PersonaSessionRequest,
): Promise<SessionResponse> {
  return startSession(request);
}

/* =========================================================
   GET PERSONA SESSION
========================================================= */

export async function getPersonaSession(
  sessionId: string,
): Promise<SessionRecord> {
  return getSession(sessionId);
}

/* =========================================================
   END PERSONA SESSION
========================================================= */

export async function endPersonaSession(
  sessionId: string,
): Promise<SessionResponse> {
  return endSession(sessionId);
}
