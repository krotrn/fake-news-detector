import OpenAI from "openai";
import { cache } from "react";

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

export const fetchNewsArticles = cache(async(): Promise<TrendingProps[]> =>{
  const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.OPENAI_API_KEY,
  });

  let responseContent: string;

  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates examples of trending news articles, including fake, questionable, and verified ones, with detailed information.",
        },
        {
          role: "user",
          content: `Please generate a list of 6 trending news articles with recent dates (e.g., "2 hours ago", "5 hours ago", "1 day ago"). Include at least one fake, one questionable, and one verified article. Each article should have the following fields:
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
  },
  {
    "id": 2,
    "title": "New study links common food additive to health concerns",
    "source": "Health News Network",
    "date": "5 hours ago",
    "status": "questionable",
    "votes": { "up": 87, "down": 92 },
    "excerpt": "The article cites a preliminary study with a small sample size. While the study exists, its findings are preliminary and have not been peer-reviewed or replicated in larger studies."
  },
  {
    "id": 3,
    "title": "Major tech company announces significant layoffs amid restructuring",
    "source": "Tech Insider",
    "date": "1 day ago",
    "status": "verified",
    "votes": { "up": 245, "down": 18 },
    "excerpt": "This news has been confirmed through official company statements and multiple reliable sources. The numbers and timeline reported are accurate."
  },
  {
    "id": 4,
    "title": "Government secretly implementing new surveillance program",
    "source": "Freedom Watch",
    "date": "3 hours ago",
    "status": "fake",
    "votes": { "up": 56, "down": 203 },
    "excerpt": "The article makes claims without any credible sources or evidence. Official government sources have denied these claims, and no reputable news outlets have corroborated this information."
  },
  {
    "id": 5,
    "title": "Celebrity announces shocking career change",
    "source": "Entertainment Today",
    "date": "12 hours ago",
    "status": "questionable",
    "votes": { "up": 112, "down": 89 },
    "excerpt": "While the celebrity mentioned has made statements about exploring new opportunities, the specific career change claimed in the article has not been confirmed by the celebrity or their representatives."
  },
  {
    "id": 6,
    "title": "New legislation passed to address climate change",
    "source": "Policy News",
    "date": "2 days ago",
    "status": "verified",
    "votes": { "up": 189, "down": 42 },
    "excerpt": "The legislation described has been officially passed and the details reported match the official government records and statements from multiple officials."
  }
]
\`\`\`
Please generate 6 articles in this exact format.`,
        },
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    if (!response.choices || !response.choices[0].message.content) {
      throw new Error("Error generating news: Response content is empty");
    }
    responseContent = response.choices[0].message.content;
  } catch (error) {
    throw new Error("Error during API call: " + error);
  }

  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const jsonMatch = responseContent.match(jsonRegex);
  if (!jsonMatch) {
    throw new Error("Invalid response format: JSON array not found in the response");
  }

  try {
    return JSON.parse(jsonMatch[1]);
  } catch (parseError) {
    throw new Error("Error parsing JSON: " + parseError);
  }
})
