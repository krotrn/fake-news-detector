import OpenAI from "openai";
import { cache } from "react";
import {
  withErrorSuppression,
  cleanErrorMessage,
} from "@/lib/error-suppression";

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

async function safeTrendingApiCall(apiKey: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  return withErrorSuppression(async () => {
    try {
      const client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      const response = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates examples of trending news articles, including fake, questionable, and verified ones, with detailed information.",
          },
          {
            role: "user",
            content: `Please generate a list of at least 6 trending news articles with recent dates (e.g., "2 hours ago", "5 hours ago", "1 day ago"). Include at least one fake, one questionable, and one verified article. Each article should have the following fields:
- id (number)
- title (string)
- source (string)
- date (string)
- status (string: "fake", "questionable", or "verified")
- votes (object with up and down numbers)
- excerpt (string explaining why it's fake, questionable, or verified)

Ensure the output is a valid JSON array with proper JSON formatting (keys in double quotes).

Here is an example of the format I want:
\`\`\`json
[
  {
    "id": 1,
    "title": "Scientists discover new planet that can sustain human life",
    "source": "Science Daily",
    "date": "2 hours ago",
    "status": "fake",
    "votes": { "up": 24, "down": 156 },
    "excerpt": "The article claims scientists have discovered a habitable planet just 4 light years away. This is false - while exoplanets have been discovered, none have been confirmed to be habitable for humans."
  }
]
\`\`\`
Please generate at least 6 articles in this exact format.`,
          },
        ],
        model: "gpt-4o",
        temperature: 1,
        max_tokens: 4096,
        top_p: 1,
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: cleanErrorMessage(error),
      };
    }
  });
}

export async function fetchTrendingArticles(
  apiKey: string
): Promise<TrendingResult> {
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      error: {
        type: "auth",
        message: "Please enter your OpenAI API key",
        retryable: false,
      },
    };
  }

  const result = await safeTrendingApiCall(apiKey);

  if (!result.success) {
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

    return {
      success: false,
      error: {
        type: "generic",
        message: "Failed to fetch trending articles. Please try again.",
        retryable: true,
      },
    };
  }

  const response = result.data;

  if (!response.choices || !response.choices[0].message.content) {
    return {
      success: false,
      error: {
        type: "generic",
        message: "No response content received from OpenAI API",
        retryable: true,
      },
    };
  }

  const responseContent = response.choices[0].message.content;
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const jsonMatch = responseContent.match(jsonRegex);

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
    const data = JSON.parse(jsonMatch[1]);
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
