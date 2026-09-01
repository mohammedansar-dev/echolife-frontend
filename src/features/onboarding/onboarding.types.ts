export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email?: string;
}

export interface PersonaData {
  id?: string;
  name: string;
  relationship: string;
  language: string;
  tone: string;
}

export interface ConsentState {
  terms: boolean;
  memoryProcessing: boolean;
  aiInteraction: boolean;
}

export interface OnboardingData {
  displayName: string;
  language: string;

  familyMembers: FamilyMember[];

  persona: PersonaData;

  consent: ConsentState;

  firstMemory?: {
    fileName: string;
    fileType: string;
  };
}

export const initialOnboardingData: OnboardingData = {
  displayName: "",

  language: "English",

  familyMembers: [],

  persona: {
    id: undefined,
    name: "",
    relationship: "",
    language: "English",
    tone: "Warm",
  },

  consent: {
    terms: false,
    memoryProcessing: false,
    aiInteraction: false,
  },
};
