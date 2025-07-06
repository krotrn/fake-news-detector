"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  isApiKeyValid: boolean;
  setIsApiKeyValid: (valid: boolean) => void;
  isLoading: boolean;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};

interface ApiKeyProviderProps {
  children: ReactNode;
}

export const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const loadApiKey = () => {
      try {
        const storedApiKey = localStorage.getItem("openai_api_key");
        const storedValidStatus = localStorage.getItem("openai_api_key_valid");
        const hasSeenWelcome = localStorage.getItem("has_seen_welcome");

        if (storedApiKey) {
          setApiKeyState(storedApiKey);
          const isValid = storedValidStatus === "true";
          setIsApiKeyValid(isValid);

          if (isValid && hasSeenWelcome !== "true") {
            setShowWelcome(true);
          }
        }
      } catch (error) {
        console.error("Error loading API key from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, []);

  const setApiKey = (key: string) => {
    try {
      setApiKeyState(key);
      localStorage.setItem("openai_api_key", key);
    } catch (error) {
      console.error("Error storing API key:", error);
    }
  };

  const clearApiKey = () => {
    try {
      setApiKeyState(null);
      setIsApiKeyValid(false);
      setShowWelcome(false);
      localStorage.removeItem("openai_api_key");
      localStorage.removeItem("openai_api_key_valid");
      localStorage.removeItem("has_seen_welcome");
    } catch (error) {
      console.error("Error clearing API key:", error);
    }
  };

  const handleSetIsApiKeyValid = (valid: boolean) => {
    try {
      setIsApiKeyValid(valid);
      localStorage.setItem("openai_api_key_valid", valid.toString());

      if (valid && !localStorage.getItem("has_seen_welcome")) {
        setShowWelcome(true);
      }
    } catch (error) {
      console.error("Error storing API key validation status:", error);
    }
  };

  const handleSetShowWelcome = (show: boolean) => {
    setShowWelcome(show);
    if (!show) {
      try {
        localStorage.setItem("has_seen_welcome", "true");
      } catch (error) {
        console.error("Error storing welcome status:", error);
      }
    }
  };

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        setApiKey,
        clearApiKey,
        isApiKeyValid,
        setIsApiKeyValid: handleSetIsApiKeyValid,
        isLoading,
        showWelcome,
        setShowWelcome: handleSetShowWelcome,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};
