import OpenAI from "openai";
import { AI_CONFIG, AIModel } from "./config";
import {
  withErrorSuppression,
  cleanErrorMessage,
} from "@/lib/error-suppression";

export type { AIModel } from "./config";

/**
 * Creates a configured OpenAI client instance for Gemini API
 */
export function createAIClient(apiKey: string): OpenAI {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("API key is required");
  }

  // Use full URL for the API endpoint - OpenAI SDK will append /chat/completions
  const baseURL =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/ai`
      : "http://localhost:3000/api/ai";

  const client = new OpenAI({
    apiKey: apiKey.trim(),
    baseURL,
    ...AI_CONFIG.browser,
  });

  return client;
}

/**
 * Standard error types for AI operations
 */
export type AIErrorType =
  | "quota"
  | "auth"
  | "network"
  | "validation"
  | "generic";

export interface AIError {
  type: AIErrorType;
  message: string;
  retryable: boolean;
}

export interface AIResult<T> {
  success: boolean;
  data?: T;
  error?: AIError;
}

/**
 * Validates a Gemini API key format
 * Gemini API keys typically start with "AIza" and are around 39 characters long
 */
export function validateApiKey(apiKey: string): boolean {
  return Boolean(
    apiKey &&
      apiKey.trim().length > 10 &&
      (apiKey.trim().startsWith("AIza") || apiKey.trim().startsWith("sk-"))
  );
}

/**
 * Safe AI API call wrapper with standardized error handling
 */
export async function safeAICall<T>(
  operation: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
  return withErrorSuppression(async () => {
    try {
      const data = await operation();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: cleanErrorMessage(error),
      };
    }
  });
}

/**
 * Maps raw error messages to standardized AI errors
 */
export function mapToAIError(errorMessage: string): AIError {
  const message = errorMessage.toLowerCase();

  if (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("billing")
  ) {
    return {
      type: "quota",
      message:
        "Gemini API quota exceeded. Please check your plan and billing details at console.cloud.google.com",
      retryable: false,
    };
  }

  if (message.includes("401") || message.includes("unauthorized")) {
    return {
      type: "auth",
      message:
        "Invalid API key. Please check your Gemini API key is correct and active.",
      retryable: false,
    };
  }

  if (message.includes("403") || message.includes("forbidden")) {
    return {
      type: "auth",
      message: "Access denied. Please check your API key permissions.",
      retryable: false,
    };
  }

  if (message.includes("rate limit")) {
    return {
      type: "quota",
      message: "Rate limit exceeded. Please wait a moment and try again.",
      retryable: true,
    };
  }

  if (
    message.includes("network") ||
    message.includes("timeout") ||
    message.includes("connect")
  ) {
    return {
      type: "network",
      message:
        "Network error. Please check your internet connection and try again.",
      retryable: true,
    };
  }

  return {
    type: "generic",
    message: "An unexpected error occurred. Please try again.",
    retryable: true,
  };
}

/**
 * Creates a standardized AI chat completion request
 */
export async function createChatCompletion(
  client: OpenAI,
  systemPrompt: string,
  userPrompt: string,
  model: AIModel = AI_CONFIG.models.primary
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const result = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model,
  });

  return result;
}

/**
 * Validates API key by making a test request to local API route
 */
export async function verifyAPIKey(
  apiKey: string
): Promise<{ isValid: boolean; error?: string }> {
  try {
    if (!validateApiKey(apiKey)) {
      return {
        isValid: false,
        error:
          "Invalid API key format. Gemini API keys typically start with AIza",
      };
    }

    // Use local API route for verification to avoid CORS
    const response = await fetch("/api/verify-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API key verification failed:", error);
    return {
      isValid: false,
      error:
        "Network error. Please check your internet connection and try again.",
    };
  }
}
