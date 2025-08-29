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
} from "lucide-react";
import { TrendingProps, fetchTrendingArticles } from "@/services/trending";
import { useApiKey } from "@/components/api-key-provider";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import QuotaErrorCard from "@/components/quota-error-card";
import ErrorCard from "@/components/error-page";

export default function TrendingMisinformation() {
  const { apiKey } = useApiKey();
  const [trendingItems, setTrendingItems] = useState<TrendingProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    type: "quota" | "auth" | "network" | "validation" | "generic";
    message: string;
    retryable: boolean;
  } | null>(null);

  const fetchData = useCallback(async () => {
    if (!apiKey) {
      setError({
        type: "auth",
        message: "Please enter your Gemini API key",
        retryable: false,
      });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchTrendingArticles(apiKey);

      if (!result.success) {
        setError(result.error!);
        setTrendingItems([]);
      } else {
        setTrendingItems(result.data || []);
        setError(null);
      }
    } catch {
      setError({
        type: "generic",
        message: "An unexpected error occurred. Please try again.",
        retryable: true,
      });
      setTrendingItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, setTrendingItems, setError, setIsLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    fetchData();
  };

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

  if (isLoading) {
    return (

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    if (error.type === "quota") {
      return <QuotaErrorCard errorMessage={error.message} />;
    }

    return (
      <ErrorCard
        errorMessage={error.message}
        onRetry={error.retryable ? handleRetry : undefined}
      />
    );
  }

  if (trendingItems.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">No trending articles found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No trending articles are available at the moment. Please try again
              later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trendingItems.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden transition-all hover:shadow-md"
        >
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
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {item.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {item.votes.up}
              </div>
              <div className="flex items-center gap-1">
                <ThumbsDown className="h-3 w-3" />
                {item.votes.down}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
