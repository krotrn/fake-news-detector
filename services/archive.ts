import OpenAI from "openai";
import { cache } from "react";
import {
  withErrorSuppression,
  cleanErrorMessage,
} from "@/lib/error-suppression";

export interface ArchiveProps {
  id: string;
  title: string;
  category: string;
  date: string;
  status: "fake" | "questionable" | "verified";
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

async function safeArchiveApiCall(apiKey: string): Promise<{
  success: boolean;
  data?: OpenAI.Chat.Completions.ChatCompletion;
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
              "You are a helpful assistant that generates examples of archived news articles, including fake, questionable, and verified ones, with detailed information.",
          },
          {
            role: "user",
            content: `Please generate a list of 8 archived news articles with dates from the past few months (e.g., "March 15, 2024", "February 28, 2024"). Include at least two fake, two questionable, and two verified articles. Each article should have the following fields:
- id (number)
- title (string)
- category (string: e.g., "Technology", "Health", "Finance", "Entertainment", "Politics", "Business")
- date (string: in "Month Day, Year" format)
- status (string: "fake", "questionable", or "verified")
- summary (string explaining why it's fake, questionable, or verified)

Ensure the output is a valid JSON array with proper JSON formatting (keys should be in double quotes).

Here is an example of the format I want:

\`\`\`json
[
  {
    "id": 1,
    "title": "5G networks cause health problems",
    "category": "Technology",
    "date": "March 15, 2024",
    "status": "fake",
    "summary": "Claims that 5G networks cause health problems have been thoroughly debunked by scientific research. Multiple studies have found no evidence of harmful effects from 5G technology."
  },
  {
    "id": 2,
    "title": "New vaccine developed with 95% efficacy rate",
    "category": "Health",
    "date": "March 10, 2024",
    "status": "verified",
    "summary": "Clinical trials have confirmed the efficacy rate of this new vaccine. The data has been peer-reviewed and published in reputable medical journals."
  },
  {
    "id": 3,
    "title": "Stock market predicted to crash next month",
    "category": "Finance",
    "date": "March 5, 2024",
    "status": "questionable",
    "summary": "While some economic indicators show potential market volatility, the specific prediction of a crash next month is not supported by consensus among economic experts."
  },
  {
    "id": 4,
    "title": "Famous celebrity secretly married in private ceremony",
    "category": "Entertainment",
    "date": "February 28, 2024",
    "status": "fake",
    "summary": "Representatives for the celebrity have officially denied this claim. No evidence has been provided to support the marriage claim."
  },
  {
    "id": 5,
    "title": "New environmental policy to reduce carbon emissions by 30%",
    "category": "Politics",
    "date": "February 20, 2024",
    "status": "verified",
    "summary": "This policy has been officially announced and the details match the government's published documents and statements."
  },
  {
    "id": 6,
    "title": "Artificial sweeteners linked to increased cancer risk",
    "category": "Health",
    "date": "February 15, 2024",
    "status": "questionable",
    "summary": "Some studies suggest a potential link, but the evidence is not conclusive and more research is needed. The article overstates the certainty of this connection."
  },
  {
    "id": 7,
    "title": "Major city implementing four-day work week for all employees",
    "category": "Business",
    "date": "February 10, 2024",
    "status": "fake",
    "summary": "City officials have confirmed this is false. While some discussions about flexible work arrangements have occurred, no policy for a universal four-day work week has been approved."
  },
  {
    "id": 8,
    "title": "New study finds correlation between exercise and improved mental health",
    "category": "Health",
    "date": "February 5, 2024",
    "status": "verified",
    "summary": "This study has been published in peer-reviewed journals and its methodology and findings are consistent with existing research in the field."
  }
]
\`\`\`

Please generate 8 articles in this exact format.`,
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

export async function fetchArchivedNews(apiKey: string): Promise<ArchiveResult> {
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

  const result = await safeArchiveApiCall(apiKey);

  if (!result.success) {
    // Handle specific OpenAI API errors with clean messages
    if (result.error) {
      if (result.error.includes("429") || result.error.includes("quota") || result.error.includes("billing")) {
        return {
          success: false,
          error: {
            type: "quota",
            message: "OpenAI API quota exceeded. Please check your plan and billing details at platform.openai.com",
            retryable: false,
          },
        };
      }
      if (result.error.includes("401") || result.error.includes("Unauthorized")) {
        return {
          success: false,
          error: {
            type: "auth",
            message: "Invalid API key. Please check your OpenAI API key is correct and active.",
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
      if (result.error.includes("network") || result.error.includes("timeout") || result.error.includes("connect")) {
        return {
          success: false,
          error: {
            type: "network",
            message: "Network error. Please check your internet connection and try again.",
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
        message: "Failed to fetch archived articles. Please try again.",
        retryable: true,
      },
    };
  }

  const response = result.data;
  
  if (!response || !response.choices || !response.choices[0].message.content) {
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
  } catch {
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

// Legacy function for backward compatibility - now uses the new API
export const fetchArchivedNewsLegacy = cache(async (): Promise<ArchiveProps[]> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key not found in environment variables");
    return [];
  }

  const result = await fetchArchivedNews(apiKey);
  return result.success ? result.data || [] : [];
});
