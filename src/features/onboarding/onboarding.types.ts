export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email?: string;
}

export interface PersonaData {
  name: string;
  relationship: string;
  language: string;
  tone: string;
}

export interface OnboardingData {
  displayName: string;
  language: string;

  familyMembers: FamilyMember[];

  persona: PersonaData;

  consentTerms: boolean;
  consentMemoryProcessing: boolean;
  consentAiInteraction: boolean;

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
    name: "",
    relationship: "",
    language: "English",
    tone: "Warm",
  },

  consentTerms: false,
  consentMemoryProcessing: false,
  consentAiInteraction: false,
};
