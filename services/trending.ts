import { createAIService } from "@/modules/ai";

export interface TrendingProps {
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

interface TrendingResult {
  success: boolean;
  data?: TrendingProps[];
  error?: {
    type: "quota" | "auth" | "network" | "validation" | "generic";
    message: string;
    retryable: boolean;
  };
}

export async function fetchTrendingArticles(
  apiKey: string
): Promise<TrendingResult> {
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      error: {
        type: "auth",
        message: "Please enter your Gemini API key",
        retryable: false,
      },
    };
  }

  try {
    const aiService = createAIService(apiKey);
    const result = await aiService.generateTrendingArticles();

    if (!result.success) {
      return {
        success: false,
        error: {
          type: result.error?.type || "generic",
          message: result.error?.message || "Failed to fetch trending articles",
          retryable: result.error?.retryable || true,
        },
      };
    }

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: {
          type: "generic",
          message: "No trending articles found",
          retryable: true,
        },
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching trending articles:", error);
    return {
      success: false,
      error: {
        type: "generic",
        message:
          "An unexpected error occurred while fetching trending articles",
        retryable: true,
      },
    };
  }
}
