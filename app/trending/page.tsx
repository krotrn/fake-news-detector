"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingProps, fetchTrendingArticles } from "@/services/trending";
import { useState, useEffect, useCallback } from "react";
import { useApiKey } from "@/components/api-key-provider";
import ApiKeySetup from "@/components/api-key-setup";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorCard from "@/components/error-page";
import QuotaErrorCard from "@/components/quota-error-card";
import ErrorBoundary from "@/components/error-boundary";

type ErrorType = "quota" | "auth" | "network" | "validation" | "generic";

export default function TrendingPage() {
  const { isApiKeyValid } = useApiKey();
  const [trendingArticles, setTrendingArticles] = useState<TrendingProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    type: ErrorType;
    retryable: boolean;
  } | null>(null);

  const loadTrendingArticles = useCallback(async () => {
    if (!isApiKeyValid) return;

    try {
      setIsLoading(true);
      setError(null);

      const apiKey = localStorage.getItem("gemini_api_key");
      if (!apiKey) {
        setError({
          message: "API key not found. Please set up your Gemini API key.",
          type: "auth",
          retryable: false,
        });
        return;
      }

      const result = await fetchTrendingArticles(apiKey);

      if (result.success && result.data) {
        setTrendingArticles(result.data);
        setError(null);
      } else if (result.error) {
        setError({
          message: result.error.message,
          type: result.error.type as ErrorType,
          retryable: result.error.retryable,
        });
        setTrendingArticles([]);
      }
    } catch (error) {
      console.error("Unexpected error in loadTrendingArticles:", error);

      setError({
        message: "An unexpected error occurred. Please try again.",
        type: "generic",
        retryable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isApiKeyValid, setTrendingArticles, setError]);

  useEffect(() => {
    loadTrendingArticles();
  }, [loadTrendingArticles]);

  const handleRetry = () => {
    loadTrendingArticles();
  };

  const isQuotaError = (errorType: ErrorType): boolean => {
    return errorType === "quota";
  };

  if (!isApiKeyValid) {
    return <ApiKeySetup />;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Trending Misinformation</h1>
        </div>

        <p className="text-muted-foreground mb-8 max-w-3xl">
          Stay informed about the latest news stories that are being legit-fact.
          This page shows trending articles that have been verified by our
          system and community.
        </p>

        {error && (
          <div className="mb-8">
            {isQuotaError(error.type) && (
              <QuotaErrorCard errorMessage={error.message} />
            )}
            {!isQuotaError(error.type) && (
              <ErrorCard
                errorMessage={error.message}
                onRetry={error.retryable ? handleRetry : undefined}
              />
            )}
          </div>
        )}

        {isLoading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="pb-3">
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && trendingArticles.length > 0 && (
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="fake">Fake</TabsTrigger>
              <TabsTrigger value="questionable">Questionable</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trendingArticles.map((item) => (
                  <TrendingCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="fake">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trendingArticles
                  .filter((item) => item.status === "fake")
                  .map((item) => (
                    <TrendingCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="questionable">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trendingArticles
                  .filter((item) => item.status === "questionable")
                  .map((item) => (
                    <TrendingCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="verified">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trendingArticles
                  .filter((item) => item.status === "verified")
                  .map((item) => (
                    <TrendingCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!isLoading && !error && trendingArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No trending articles available at the moment.
            </p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

function TrendingCard({ item }: { item: TrendingProps; }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "fake":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Fake
          </Badge>
        );
      case "questionable":
        return (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600"
          >
            <HelpCircle className="h-3 w-3" />
            Questionable
          </Badge>
        );
      case "verified":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
          >
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">
            {item.title}
          </CardTitle>
          {getStatusBadge(item.status)}
        </div>
        <CardDescription className="pt-2">
          {item.source} • {item.date}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {item.excerpt}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              <span>{item.votes.up}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
              <span>{item.votes.down}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
