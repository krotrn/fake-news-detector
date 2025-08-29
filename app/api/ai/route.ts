import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🚀 AI API route called");
  try {
    const body = await request.json();

    // Extract API key from Authorization header
    const authHeader = request.headers.get("authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    console.log("📝 Request details:", {
      hasBody: !!body,
      hasAuthHeader: !!authHeader,
      hasApiKey: !!apiKey,
      bodyKeys: Object.keys(body || {}),
    });

    if (!apiKey) {
      console.log("❌ No API key provided");
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Forward the request to Gemini's OpenAI-compatible endpoint
    console.log("🌐 Forwarding to Gemini API...");
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log("📨 Gemini API response:", {
      status: response.status,
      ok: response.ok,
      hasData: !!data,
      errorMessage: data.error?.message || "No error",
    });

    if (!response.ok) {
      console.log("❌ Gemini API error:", data);
      return NextResponse.json(
        { error: data.error || "Request failed" },
        { status: response.status }
      );
    }

    console.log("✅ Request successful");
    return NextResponse.json(data);
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
