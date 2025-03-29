"use server";

import OpenAI from "openai";
import { cache } from "react";

export interface QueryResponse {
  id: string;
  title: string;
  source: string;
  status: "fake" | "questionable" | "verified";
  confidence: number;
  summary: string;
  sources: { name: string; url: string }[];
}

export const searchNews = async (query: string): Promise<QueryResponse[]> => {
  if (!query.trim()) {
    throw new Error("empty query");
  }
  try {
    const articles = await generateSearchResults(query);
    return articles;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("something went wrong.");
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

async function generateSearchResults(query: string): Promise<QueryResponse[]> {
  const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = buildPrompt(query);

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that generates examples of news articles.",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-4o",
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
  });

  if (!response.choices[0].message.content) {
    throw new Error("Error generating News");
  }

  const content = response.choices[0].message.content.substring(
    7,
    response.choices[0].message.content.length - 4
  );
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Invalid response format: JSON array not found");
  }

  try {
    return JSON.parse(content);
  } catch (err) {
    throw new Error("Failed to parse JSON output from OpenAI");
  }
}
