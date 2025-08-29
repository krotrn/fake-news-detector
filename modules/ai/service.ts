import {
  createAIClient,
  safeAICall,
  mapToAIError,
  createChatCompletion,
  AIResult,
  validateApiKey,
} from "./client";

// Types for AI responses
export interface SearchResultItem {
  id: number;
  title: string;
  source: string;
  date: string;
  category: string;
  status: "verified" | "questionable" | "fake";
  excerpt: string;
}

export interface TrendingArticleItem {
  id: number;
  title: string;
  source: string;
  date: string;
  status: "fake" | "questionable" | "verified";
  votes: {
    up: number;
    down: number;
  };
  excerpt: string;
}

export interface ArchivedNewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  status: "verified" | "questionable" | "fake";
  summary: string;
}

/**
 * Centralized AI Service for all AI operations
 * Provides a unified interface for different AI operations across the app
 */
export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey || !validateApiKey(apiKey)) {
      throw new Error("Valid API key is required");
    }
    this.apiKey = apiKey;
  }

  /**
   * Validates the API key is properly formatted and accessible
   */
  static async validateKey(
    apiKey: string
  ): Promise<{ isValid: boolean; error?: string }> {
    if (!apiKey || apiKey.trim().length === 0) {
      return {
        isValid: false,
        error: "Please enter your Gemini API key",
      };
    }

    if (!validateApiKey(apiKey)) {
      return {
        isValid: false,
        error:
          "Invalid API key format. Gemini API keys typically start with AIza",
      };
    }

    // For now, just return true if format is valid
    // The actual API validation happens in the client
    return { isValid: true };
  }

  /**
   * Generic method for AI chat completions with standardized error handling
   */
  private async performChatCompletion<T>(
    systemPrompt: string,
    userPrompt: string,
    parseResponse: (content: string) => T
  ): Promise<AIResult<T>> {
    const client = createAIClient(this.apiKey);

    const result = await safeAICall(async () => {
      return createChatCompletion(client, systemPrompt, userPrompt);
    });

    if (!result.success) {
      return {
        success: false,
        error: mapToAIError(result.error || "Unknown error"),
      };
    }

    if (!result.data?.choices?.[0]?.message?.content) {
      return {
        success: false,
        error: {
          type: "generic",
          message: "No response content received from OpenAI API",
          retryable: true,
        },
      };
    }

    try {
      const parsedData = parseResponse(result.data.choices[0].message.content);
      return {
        success: true,
        data: parsedData,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return {
        success: false,
        error: {
          type: "validation",
          message: "Failed to parse response data",
          retryable: true,
        },
      };
    }
  }

  /**
   * Generate search results for news verification
   */
  async generateSearchResults(
    query: string
  ): Promise<AIResult<SearchResultItem[]>> {
    const systemPrompt =
      "You are a helpful assistant that generates examples of news articles.";
    const userPrompt = `I need to verify the following news headline: "${query}". 

Please provide 8 related news articles that would help with fact-checking. Include a mix of:
- 2-3 articles supporting the claim
- 2-3 articles contradicting or debunking the claim  
- 2-3 neutral/analytical articles

For each article, provide:
- id (number)
- title (string)
- source (string)
- date (string)
- category (string)
- status ("verified", "questionable", or "fake")
- excerpt (string - brief description)

Format the response as a JSON array starting with \`\`\`json and ending with \`\`\`.`;

    return this.performChatCompletion(systemPrompt, userPrompt, (content) => {
      // Extract JSON from markdown code block
      const cleanContent = content.substring(7, content.length - 4);
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Invalid response format: JSON array not found");
      }
      return JSON.parse(cleanContent);
    });
  }

  /**
   * Generate trending misinformation articles
   */
  async generateTrendingArticles(): Promise<AIResult<TrendingArticleItem[]>> {
    const systemPrompt =
      "You are a helpful assistant that generates examples of trending news articles, including fake, questionable, and verified ones, with detailed information.";
    const userPrompt = `Please generate a list of 8 trending news articles from the past week. Include a mix of fake, questionable, and verified articles. Each article should have:

- id (number)
- title (string)
- source (string) 
- date (string from past week)
- status ("fake", "questionable", or "verified")
- votes: { up: number, down: number }
- excerpt (string - brief summary)

Format as JSON array with \`\`\`json wrapper.`;

    return this.performChatCompletion(systemPrompt, userPrompt, (content) => {
      const cleanContent = content.substring(7, content.length - 4);
      return JSON.parse(cleanContent);
    });
  }

  /**
   * Generate archived news articles
   */
  async generateArchivedNews(): Promise<AIResult<ArchivedNewsItem[]>> {
    const systemPrompt =
      "You are a helpful assistant that generates examples of archived news articles, including fake, questionable, and verified ones, with detailed information.";
    const userPrompt = `Please generate a list of 8 archived news articles with dates from the past few months. Include at least two fake, two questionable, and two verified articles. Each article should have:

- id (number)
- title (string)
- category (string)
- date (string)
- status ("verified", "questionable", or "fake")
- summary (string)

Format as JSON array with \`\`\`json wrapper.`;

    return this.performChatCompletion(systemPrompt, userPrompt, (content) => {
      const cleanContent = content.substring(7, content.length - 4);
      return JSON.parse(cleanContent);
    });
  }
}

/**
 * Factory function to create AIService instance
 */
export function createAIService(apiKey: string): AIService {
  return new AIService(apiKey);
}

/**
 * Convenience function to get API key from localStorage and create service
 */
export function getAIServiceFromStorage(): AIService | null {
  if (typeof window === "undefined") return null;

  try {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) return null;

    return createAIService(apiKey);
  } catch (error) {
    console.error("Failed to create AI service from storage:", error);
    return null;
  }
}
