import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { url, headline } = await request.json()

    if (!url && !headline) {
      return NextResponse.json({ error: "URL or headline is required" }, { status: 400 })
    }

    // Use the content to be verified
    const contentToVerify = url || headline

    // Generate analysis using OpenAI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the following news content for credibility:
        "${contentToVerify}"
        
        Provide a detailed fact-check analysis with the following information:
        1. A determination if the content is "fake", "questionable", or "verified"
        2. A confidence score (0-100)
        3. A summary of your analysis
        4. List of sources that support your conclusion
        
        Format your response as JSON with the following structure:
        {
          "status": "fake|questionable|verified",
          "confidence": number,
          "summary": "string",
          "sources": [{"name": "string", "url": "string"}]
        }
      `,
    })

    // Parse the response
    const analysis = JSON.parse(text)

    return NextResponse.json({
      title: headline || url,
      source: url || "Unknown source",
      ...analysis,
    })
  } catch (error) {
    console.error("Error verifying content:", error)
    return NextResponse.json({ error: "Failed to verify content" }, { status: 500 })
  }
}

