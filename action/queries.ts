"use client";

import { createAIService } from "@/modules/ai";

export interface QueryResponse {
  id: string;
  title: string;
  source: string;
  status: "fake" | "questionable" | "verified";
  confidence: number;
  summary: string;
  sources: { name: string; url: string }[];
}

export type ErrorType = "quota" | "auth" | "network" | "generic" | "validation";

export interface SearchResult {
  success: boolean;
  data?: QueryResponse[];
  error?: {
    message: string;
    type: ErrorType;
    canRetry: boolean;
  };
}

export const searchNews = async (query: string): Promise<SearchResult> => {
  if (!query.trim()) {
    return {
      success: false,
      error: {
        message: "Please enter a news headline to verify.",
        type: "validation",
        canRetry: false,
      },
    };
  }

  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    return {
      success: false,
      error: {
        message: "API key not found. Please set up your Gemini API key.",
        type: "auth",
        canRetry: false,
      },
    };
  }

  try {
    const aiService = createAIService(apiKey);
    const result = await aiService.generateSearchResults(query);

    if (!result.success) {
      return {
        success: false,
        error: {
          message: result.error?.message || "Failed to verify news",
          type: result.error?.type || "generic",
          canRetry: result.error?.retryable || true,
        },
      };
    }

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: {
          message: "No results found for your query",
          type: "generic",
          canRetry: true,
        },
      };
    }

    const transformedData: QueryResponse[] = result.data.map((item, index) => ({
      id: `${index + 1}`,
      title: item.title,
      source: item.source,
      status: item.status,
      confidence:
        item.status === "verified" ? 90 : item.status === "fake" ? 10 : 50,
      summary: item.excerpt,
      sources: [{ name: item.source, url: "#" }],
    }));

    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      success: false,
      error: {
        message: "An unexpected error occurred. Please try again.",
        type: "generic",
        canRetry: true,
      },
    };
  }
};
