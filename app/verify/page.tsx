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
import { QueryResponse, searchNews } from "@/action/queries";
import Testimonials from "@/components/testimonials";
import PendingCard from "@/components/pending";
import ResultCard from "@/components/result-card";
import ErrorCard from "@/components/error-page";

export default function VerifyPage() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResult] = useState<null | QueryResponse[]>(null);
  const [error, setError] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      startTransition(async () => {
        try {
          const response = await searchNews(query);
          setResult(response);
        } catch (error) {
          setError("Something went wrong.")
        }
      });
    } catch (error) {
      console.error(error);
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
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isPending && <PendingCard />}
        {error && <ErrorCard errorMessage={error} />}

        {results && !error &&
          results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        <Testimonials />
      </div>
    </div>
  );
}
