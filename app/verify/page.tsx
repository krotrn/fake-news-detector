"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  QueryResponse,
  searchNews,
  ErrorType,
} from "@/action/queries";
import Testimonials from "@/components/testimonials";
import PendingCard from "@/components/pending";
import ResultCard from "@/components/result-card";
import ErrorCard from "@/components/error-page";
import QuotaErrorCard from "@/components/quota-error-card";
import ApiKeySetup from "@/components/api-key-setup";
import { useApiKey } from "@/components/api-key-provider";
import ErrorBoundary from "@/components/error-boundary";

export default function VerifyPage() {
  const { isApiKeyValid, isLoading } = useApiKey();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResult] = useState<null | QueryResponse[]>(null);
  const [error, setError] = useState<{
    message: string;
    type: ErrorType;
    canRetry: boolean;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isApiKeyValid) {
    return <ApiKeySetup />;
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setResult(null);

    if (!query.trim()) {
      setError({
        message: "Please enter a news headline to verify.",
        type: "validation",
        canRetry: false,
      });
      return;
    }
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      setError({
        message: "API key not found. Please set up your OpenAI API key.",
        type: "auth",
        canRetry: false,
      });
      return;
    }

    startTransition(async () => {
      const result = await searchNews(query);

      if (result.success && result.data) {
        setResult(result.data);
        setError(null); // Clear any previous errors on success
      } else if (result.error) {
        setError(result.error);
        setResult(null); // Clear any previous results on error
      }
    });
  };

  const handleRetry = () => {
    if (query.trim()) {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      handleVerify(submitEvent as unknown as React.FormEvent);
    }
  };

  const isQuotaError = (errorType: ErrorType): boolean => {
    return errorType === "quota";
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">News Verification Tool</h1>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Verify News</CardTitle>
              <CardDescription>
                Enter a news headline to verify its credibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleVerify}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Input
                  placeholder="Enter news Headline"
                  name="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                  disabled={isPending}
                />
                <Button type="submit" disabled={isPending || !query.trim()}>
                  {isPending ? "Verifying..." : "Verify"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isPending && <PendingCard />}
          {error && (
            <>
              {isQuotaError(error.type) && (
                <QuotaErrorCard errorMessage={error.message} />
              )}
              {!isQuotaError(error.type) && (
                <ErrorCard
                  errorMessage={error.message}
                  onRetry={error.canRetry ? handleRetry : undefined}
                />
              )}
            </>
          )}

          {results &&
            !error &&
            results.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          <Testimonials />
        </div>
      </div>
    </ErrorBoundary>
  );
}
