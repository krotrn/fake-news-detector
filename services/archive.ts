import { createAIService } from "@/modules/ai";

export interface ArchiveProps {
  id: number;
  title: string;
  category: string;
  date: string;
  status: "verified" | "questionable" | "fake";
  summary: string;
}

interface ArchiveResult {
  success: boolean;
  data?: ArchiveProps[];
  error?: {
    type: "quota" | "auth" | "network" | "validation" | "generic";
    message: string;
    retryable: boolean;
  };
}

export async function fetchArchivedNews(
  apiKey: string
): Promise<ArchiveResult> {
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
    const result = await aiService.generateArchivedNews();

    if (!result.success) {
      return {
        success: false,
        error: {
          type: result.error?.type || "generic",
          message: result.error?.message || "Failed to fetch archived news",
          retryable: result.error?.retryable || true,
        },
      };
    }

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: {
          type: "generic",
          message: "No archived news found",
          retryable: true,
        },
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching archived news:", error);
    return {
      success: false,
      error: {
        type: "generic",
        message: "An unexpected error occurred while fetching archived news",
        retryable: true,
      },
    };
  }
}
