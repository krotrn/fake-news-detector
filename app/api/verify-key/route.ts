import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { isValid: false, error: "API key is required" },
        { status: 400 }
      );
    }

    // Validate API key format
    if (!apiKey.startsWith("AIza") && !apiKey.startsWith("sk-")) {
      return NextResponse.json({
        isValid: false,
        error:
          "Invalid API key format. Gemini API keys typically start with AIza",
      });
    }

    // Test the API key by making a simple request to Gemini
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/models",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      return NextResponse.json({ isValid: true });
    }

    if (response.status === 401) {
      return NextResponse.json({
        isValid: false,
        error:
          "Invalid API key. Please check your Gemini API key and try again.",
      });
    }

    if (response.status === 429) {
      return NextResponse.json({
        isValid: false,
        error: "Rate limit exceeded. Please try again in a few minutes.",
      });
    }

    if (response.status === 403) {
      return NextResponse.json({
        isValid: false,
        error: "Access denied. Please check your API key permissions.",
      });
    }

    return NextResponse.json({
      isValid: false,
      error: "Failed to verify API key. Please try again.",
    });
  } catch (error) {
    console.error("API key verification error:", error);
    return NextResponse.json({
      isValid: false,
      error:
        "Network error. Please check your internet connection and try again.",
    });
  }
}
