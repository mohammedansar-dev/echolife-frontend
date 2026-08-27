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
   LOCAL PERSONA STORAGE
========================================================= */

const PERSONA_STORAGE_KEY = "echolife_persona_configuration";

/* =========================================================
   SAVE PERSONA
========================================================= */

export async function savePersonaConfiguration(
  configuration: PersonaConfiguration,
): Promise<PersonaConfigurationResponse> {
  localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(configuration));

  return {
    success: true,
    message: "Persona configuration saved.",
    data: configuration,
  };
}

/* =========================================================
   GET PERSONA
========================================================= */

export async function getPersonaConfiguration(): Promise<PersonaConfigurationResponse> {
  const stored = localStorage.getItem(PERSONA_STORAGE_KEY);

  if (!stored) {
    return {
      success: true,
      message: "No Persona configuration found.",
      data: undefined,
    };
  }

  try {
    const configuration = JSON.parse(stored) as PersonaConfiguration;

    return {
      success: true,
      message: "Persona configuration loaded.",
      data: configuration,
    };
  } catch {
    localStorage.removeItem(PERSONA_STORAGE_KEY);

    return {
      success: true,
      message: "No valid Persona configuration found.",
      data: undefined,
    };
  }
}

/* =========================================================
   RESET PERSONA
========================================================= */

export async function resetPersonaConfiguration(): Promise<PersonaConfigurationResponse> {
  localStorage.removeItem(PERSONA_STORAGE_KEY);

  return {
    success: true,
    message: "Persona configuration reset.",
  };
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
