"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Search,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { QueryResponse, searchNews } from "@/action/queries";

export default function VerifyPage() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResult] = useState<null | QueryResponse[]>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      startTransition(async () => {
        const response = await searchNews(query);
        setResult(response);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status: "fake" | "questionable" | "verified") => {
    switch (status) {
      case "fake":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
              <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-300" />
            </div>
            <Badge variant="destructive" className="text-sm px-3">
              Fake
            </Badge>
          </div>
        );
      case "questionable":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
              <HelpCircle className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
            </div>
            <Badge className="text-sm px-3 bg-yellow-500 hover:bg-yellow-600">
              Questionable
            </Badge>
          </div>
        );
      case "verified":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-300" />
            </div>
            <Badge className="text-sm px-3 bg-green-500 hover:bg-green-600">
              Verified
            </Badge>
          </div>
        );
    }
  };

  const getStatusColor = (status: "fake" | "questionable" | "verified") => {
    switch (status) {
      case "fake":
        return "bg-red-500";
      case "questionable":
        return "bg-yellow-500";
      case "verified":
        return "bg-green-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">News Verification Tool</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verify News</CardTitle>
            <CardDescription>
              Enter a news headline or URL to verify its credibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleVerify}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Input
                placeholder="Enter news article URL"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isPending && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-pulse mb-4">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Verifying content...
                </h3>
                <p className="text-muted-foreground mb-4">
                  This may take a few moments
                </p>
                <Progress value={45} className="w-full max-w-md" />
              </div>
            </CardContent>
          </Card>
        )}

        {results &&
          results.map((result) => (
            <Card key={result.id} className="mb-8 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{result.title}</CardTitle>
                <CardDescription>Source: {result.source}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-col items-center justify-center py-6 mb-6">
                  {getStatusBadge(result.status)}
                  <div className="w-full max-w-md mt-6">
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Fake</span>
                      <span>Questionable</span>
                      <span>Verified</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStatusColor(
                          result.status
                        )} transition-all duration-500 ease-in-out`}
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-sm text-muted-foreground">
                        Confidence: {result.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Analysis Summary</h3>
                  <p>{result.summary}</p>

                  <h3 className="font-medium text-lg mt-6">Verified Against</h3>
                  <ul className="space-y-2">
                    {result.sources.map((source, index) => (
                      <li key={index}>
                        <a
                          href={source.url}
                          className="text-primary hover:underline"
                        >
                          {source.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Was this verification helpful?
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Helpful
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Not Helpful
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              How Our Verification Works
            </h2>
            <p className="text-muted-foreground mb-6">
              Our news verification system uses a combination of AI analysis,
              trusted source verification, and crowdsourced feedback to
              determine the credibility of news articles.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our AI system analyzes the content, language patterns, and
                    claims made in the article.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Source Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We cross-reference information with trusted sources and
                    fact-checking organizations.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Crowd Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    User feedback helps improve our verification system and
                    provides additional context.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">
                  How accurate is the verification?
                </h3>
                <p className="text-muted-foreground">
                  Our system achieves over 85% accuracy in identifying fake
                  news, with continuous improvements through machine learning
                  and user feedback.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  Can I verify social media posts?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can verify social media posts by pasting the URL or
                  copying the content into the headline field.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  How can I contribute to the platform?
                </h3>
                <p className="text-muted-foreground">
                  You can contribute by providing feedback on verifications,
                  submitting articles for review, and sharing the platform with
                  others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
