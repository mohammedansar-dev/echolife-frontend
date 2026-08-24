export type PersonaTone =
  | "warm"
  | "calm"
  | "friendly"
  | "professional"
  | "reflective";

export interface PersonaProfile {
  id: string;
  name: string;
  description: string;
  personality: string;
  tone: PersonaTone;
  interests: string[];
  values: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PersonaMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface SavePersonaInput {
  name: string;
  description: string;
  personality: string;
  tone: PersonaTone;
  interests: string[];
  values: string[];
}
