import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getPersonaConfiguration,
  resetPersonaConfiguration,
  savePersonaConfiguration,
  sendPersonaMessage,
  type PersonaConfiguration,
} from "./PersonaAPI";

/* =========================================================
   MESSAGE
========================================================= */

export interface PersonaMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

/* =========================================================
   CONTEXT TYPE
========================================================= */

interface PersonaContextValue {
  configuration: PersonaConfiguration | null;
  messages: PersonaMessage[];

  hydrated: boolean;
  loading: boolean;
  saving: boolean;
  sending: boolean;

  error: string | null;

  saveConfiguration: (configuration: PersonaConfiguration) => Promise<void>;

  resetConfiguration: () => Promise<void>;

  sendMessage: (message: string) => Promise<void>;

  clearMessages: () => void;
  clearError: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const PersonaContext = createContext<PersonaContextValue | undefined>(
  undefined,
);

/* =========================================================
   PROVIDER
========================================================= */

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [configuration, setConfiguration] =
    useState<PersonaConfiguration | null>(null);

  const [messages, setMessages] = useState<PersonaMessage[]>([]);

  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     LOAD PERSONA
  ======================================================= */

  useEffect(() => {
    let active = true;

    async function loadPersona() {
      setLoading(true);
      setError(null);

      try {
        const response = await getPersonaConfiguration();

        if (!active) {
          return;
        }

        if (response.success) {
          setConfiguration(response.data ?? null);
        } else {
          setConfiguration(null);
        }
      } catch (error) {
        /*
         * Do not break the complete application if the Persona
         * service is temporarily unavailable.
         *
         * The real configuration will load automatically once
         * the backend service is available.
         */
        console.warn("Persona service is currently unavailable.", error);

        if (active) {
          setConfiguration(null);
          setError(null);
        }
      } finally {
        if (active) {
          setLoading(false);
          setHydrated(true);
        }
      }
    }

    void loadPersona();

    return () => {
      active = false;
    };
  }, []);

  /* =======================================================
     SAVE PERSONA CONFIGURATION
  ======================================================= */

  const saveConfiguration = useCallback(
    async (newConfiguration: PersonaConfiguration) => {
      setSaving(true);
      setError(null);

      try {
        const response = await savePersonaConfiguration(newConfiguration);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to save Persona configuration.",
          );
        }

        setConfiguration(response.data ?? newConfiguration);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to save Persona configuration.";

        setError(message);

        throw error;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  /* =======================================================
     RESET PERSONA
  ======================================================= */

  const resetConfiguration = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await resetPersonaConfiguration();

      if (!response.success) {
        throw new Error(response.message || "Unable to reset Persona.");
      }

      setConfiguration(null);
      setMessages([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reset Persona.";

      setError(message);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================================================
     SEND PERSONA MESSAGE
  ======================================================= */

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();

      if (!trimmed) {
        return;
      }

      if (!configuration) {
        const message =
          "Please configure your Persona before starting a conversation.";

        setError(message);

        throw new Error(message);
      }

      if (sending) {
        return;
      }

      setSending(true);
      setError(null);

      const userMessage: PersonaMessage = {
        id: `user-${Date.now()}-` + Math.random().toString(36).slice(2),

        role: "user",

        content: trimmed,

        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, userMessage]);

      try {
        const response = await sendPersonaMessage({
          message: trimmed,
          personaName: configuration.name,
          tone: configuration.tone,
          memoryIds: configuration.selectedMemoryIds,
        });

        if (!response.success) {
          throw new Error(response.message || "Persona could not respond.");
        }

        const responseText = response.data?.response;

        if (!responseText) {
          throw new Error("The Persona returned an empty response.");
        }

        const assistantMessage: PersonaMessage = {
          id: `assistant-${Date.now()}-` + Math.random().toString(36).slice(2),

          role: "assistant",

          content: responseText,

          createdAt: new Date().toISOString(),
        };

        setMessages((current) => [...current, assistantMessage]);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to send message.";

        setError(message);

        throw error;
      } finally {
        setSending(false);
      }
    },
    [configuration, sending],
  );

  /* =======================================================
     CLEAR MESSAGES
  ======================================================= */

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo<PersonaContextValue>(
    () => ({
      configuration,
      messages,

      hydrated,
      loading,
      saving,
      sending,

      error,

      saveConfiguration,
      resetConfiguration,
      sendMessage,

      clearMessages,
      clearError,
    }),
    [
      configuration,
      messages,
      hydrated,
      loading,
      saving,
      sending,
      error,

      saveConfiguration,
      resetConfiguration,
      sendMessage,

      clearMessages,
      clearError,
    ],
  );

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function usePersona(): PersonaContextValue {
  const context = useContext(PersonaContext);

  if (!context) {
    throw new Error("usePersona must be used inside PersonaProvider");
  }

  return context;
}
