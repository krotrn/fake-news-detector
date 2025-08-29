/**
 * Centralized AI Configuration
 * This module provides a unified interface for AI operations across the application
 * Now configured to use Gemini API with OpenAI SDK compatibility
 */

export const AI_CONFIG = {
  // Gemini model configurations (using OpenAI compatibility)
  models: {
    primary: "gemini-2.0-flash",
    fallback: "gemini-1.5-pro",
    reasoning: "gemini-2.5-flash", // For complex reasoning tasks
  },

  // Gemini API settings (OpenAI compatible endpoint)
  api: {
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    timeout: 30000, // 30 seconds
    maxRetries: 3,
    retryDelay: 1000, // 1 second
  },

  // Browser settings for client-side usage
  browser: {
    dangerouslyAllowBrowser: true,
  },

  // Gemini-specific features
  gemini: {
    reasoningEffort: {
      low: "low", // 1,024 tokens
      medium: "medium", // 8,192 tokens
      high: "high", // 24,576 tokens
      none: "none", // Disabled
    },
  },
} as const;

export type AIModel =
  | typeof AI_CONFIG.models.primary
  | typeof AI_CONFIG.models.fallback
  | typeof AI_CONFIG.models.reasoning;
export type AIConfig = typeof AI_CONFIG;
export type ReasoningEffort = keyof typeof AI_CONFIG.gemini.reasoningEffort;
