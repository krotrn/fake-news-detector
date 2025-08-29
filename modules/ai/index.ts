/**
 * Centralized AI Module
 *
 * This module provides a unified interface for all AI operations across the application.
 * It centralizes OpenAI API interactions, error handling, and response parsing.
 *
 * Usage:
 * ```typescript
 * import { AIService, createAIService } from '@/modules/ai';
 *
 * const aiService = createAIService(apiKey);
 * const result = await aiService.generateSearchResults(query);
 * ```
 */

// Export types
export type { AIErrorType, AIError, AIResult, AIModel } from "./client";

export type { AIConfig } from "./config";

export type {
  SearchResultItem,
  TrendingArticleItem,
  ArchivedNewsItem,
} from "./service";

// Export main functionality
export {
  createAIClient,
  validateApiKey,
  verifyAPIKey,
  safeAICall,
  mapToAIError,
  createChatCompletion,
} from "./client";

export { AIService, createAIService, getAIServiceFromStorage } from "./service";

export { AI_CONFIG } from "./config";

// Re-export for convenience
export { verifyAPIKey as verifyApiKey } from "./client";
