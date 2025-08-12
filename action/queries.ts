"use client";

import OpenAI from "openai";
import {
  cleanErrorMessage,
  withErrorSuppression,
} from "@/lib/error-suppression";

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

  const apiKey = localStorage.getItem("openai_api_key");
  if (!apiKey) {
    return {
      success: false,
      error: {
        message: "API key not found. Please set up your OpenAI API key.",
        type: "auth",
        canRetry: false,
      },
    };
  }

  try {
    const result = await generateSearchResults(query, apiKey);

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

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    // This catch block should now only handle truly unexpected errors
    // since generateSearchResults returns status objects for all user-facing errors
    console.error("Unexpected error in searchNews:", error);

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

function buildPrompt(query: string): string {
  let statusInstruction =
    "Include articles with statuses 'fake', 'questionable', and 'verified'";

  if (/fake/i.test(query)) {
    statusInstruction =
      "Focus on generating articles with statuses 'fake' or 'questionable' (with an explanation why they are flagged as fake or misleading)";
  } else if (/real|verified|true/i.test(query)) {
    statusInstruction =
      "Focus on generating articles with a 'verified' status (with explanations about their authenticity and multiple sources confirming the information)";
  } else statusInstruction = "";

  return `Please generate a list of 5 news articles related to "${query}". ${statusInstruction}. Each article should have the following fields:
- id (number)
- title (string)
- source (string)
- status (string: "fake", "questionable", or "verified")
- confidence (number)
- summary (string)
- sources: an array of objects, where each object has a "name" (string) and a "url" (string).

Ensure the output is a valid JSON array.



Example format:
\`\`\`json
[
  {
    title: headline || "Climate scientists discover alarming new data on sea level rise",
    source: url || "example.com/climate-news",
    status: "questionable",
    confidence: 65,
    summary:
      "The article contains some factual information about climate change and sea level rise, but exaggerates the timeline and potential impact. While sea levels are rising, the rate mentioned in the article is not supported by current scientific consensus.",
    sources: [
      { name: "IPCC Climate Report 2023", url: link of article },
      { name: "NASA Sea Level Monitoring", url: link of article },
      { name: "National Geographic Climate Data", url: link of article },
    ]
  }
]
\`\`\`

Generate 5 articles related to "${query}".`;
}

interface GenerateSearchResultsResponse {
  success: boolean;
  data?: QueryResponse[];
  error?: {
    type: "quota" | "auth" | "network" | "validation" | "generic";
    message: string;
    retryable: boolean;
  };
}

async function safeOpenAICall(
  client: OpenAI,
  prompt: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  return withErrorSuppression(async () => {
    try {
      const response = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates examples of news articles.",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-5",
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      // Clean the error message for user display
      return {
        success: false,
        error: cleanErrorMessage(error),
      };
    }
  });
}

async function generateSearchResults(
  query: string,
  apiKey: string
): Promise<GenerateSearchResultsResponse> {
  // Note: dangerouslyAllowBrowser is required for client-side usage
  // The API key is provided by the user and stored locally in their browser
  // It's never transmitted to our servers, only directly to OpenAI's API
  const client = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const prompt = buildPrompt(query);

  // Use the safe wrapper to prevent raw errors from reaching Next.js dev tools
  const result = await safeOpenAICall(client, prompt);

  if (!result.success) {
    // Handle specific OpenAI API errors with clean messages
    if (result.error) {
      if (
        result.error.includes("429") ||
        result.error.includes("quota") ||
        result.error.includes("billing")
      ) {
        return {
          success: false,
          error: {
            type: "quota",
            message:
              "OpenAI API quota exceeded. Please check your plan and billing details at platform.openai.com",
            retryable: false,
          },
        };
      }
      if (
        result.error.includes("401") ||
        result.error.includes("Unauthorized")
      ) {
        return {
          success: false,
          error: {
            type: "auth",
            message:
              "Invalid API key. Please check your OpenAI API key is correct and active.",
            retryable: false,
          },
        };
      }
      if (result.error.includes("403") || result.error.includes("Forbidden")) {
        return {
          success: false,
          error: {
            type: "auth",
            message: "Access denied. Please check your API key permissions.",
            retryable: false,
          },
        };
      }
      if (result.error.includes("rate limit")) {
        return {
          success: false,
          error: {
            type: "quota",
            message: "Rate limit exceeded. Please wait a moment and try again.",
            retryable: true,
          },
        };
      }

      // For network errors or other API issues
      if (
        result.error.includes("network") ||
        result.error.includes("timeout") ||
        result.error.includes("connect")
      ) {
        return {
          success: false,
          error: {
            type: "network",
            message:
              "Network error. Please check your internet connection and try again.",
            retryable: true,
          },
        };
      }
    }

    // For any other unexpected errors
    return {
      success: false,
      error: {
        type: "generic",
        message:
          "Failed to verify news. Please try again or check your API key.",
        retryable: true,
      },
    };
  }

  const response = result.data;

  if (!response.choices[0].message.content) {
    return {
      success: false,
      error: {
        type: "generic",
        message: "No response content received from OpenAI API",
        retryable: true,
      },
    };
  }

  const content = response.choices[0].message.content.substring(
    7,
    response.choices[0].message.content.length - 4
  );
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return {
      success: false,
      error: {
        type: "validation",
        message: "Invalid response format: JSON array not found",
        retryable: true,
      },
    };
  }

  try {
    const data = JSON.parse(content);
    return {
      success: true,
      data,
    };
  } catch (parseError) {
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
