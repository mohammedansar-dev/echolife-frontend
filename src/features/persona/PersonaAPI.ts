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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/* =========================================================
   RESPONSE HANDLER
========================================================= */

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}.`,
    );
  }

  return data as T;
}

/* =========================================================
   SAVE CONFIGURATION
========================================================= */

export async function savePersonaConfiguration(
  configuration: PersonaConfiguration,
): Promise<PersonaConfigurationResponse> {
  const response = await fetch(`${API_BASE_URL}/persona/configuration`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify(configuration),
  });

  return handleResponse<PersonaConfigurationResponse>(response);
}

/* =========================================================
   GET CONFIGURATION
========================================================= */

export async function getPersonaConfiguration(): Promise<PersonaConfigurationResponse> {
  const response = await fetch(`${API_BASE_URL}/persona/configuration`, {
    method: "GET",

    credentials: "include",
  });

  return handleResponse<PersonaConfigurationResponse>(response);
}

/* =========================================================
   RESET CONFIGURATION
========================================================= */

export async function resetPersonaConfiguration(): Promise<PersonaConfigurationResponse> {
  const response = await fetch(`${API_BASE_URL}/persona/configuration`, {
    method: "DELETE",

    credentials: "include",
  });

  return handleResponse<PersonaConfigurationResponse>(response);
}

/* =========================================================
   SEND MESSAGE
========================================================= */

export async function sendPersonaMessage(
  request: PersonaConversationRequest,
): Promise<PersonaConversationResponse> {
  const response = await fetch(`${API_BASE_URL}/persona/conversation`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify(request),
  });

  return handleResponse<PersonaConversationResponse>(response);
}
