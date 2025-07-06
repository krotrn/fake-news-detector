"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, TrendingUp, Archive } from "lucide-react";
import TrendingMisinformation from "@/components/trending-misinformation";
import ApiKeySetup from "@/components/api-key-setup";
import WelcomeScreen from "@/components/welcome-screen";
import { useApiKey } from "@/components/api-key-provider";

export default function Home() {
  const { isApiKeyValid, isLoading, showWelcome, setShowWelcome } = useApiKey();

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

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
            Legit<span className="text-primary">Fact</span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Verify news articles, discover trending misinformation, and access
            legit-fact reports.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/verify" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">
              <Search className="mr-2 h-4 w-4" /> Verify News
            </Button>
          </Link>
          <Link href="/trending" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" /> Trending Misinformation
            </Button>
          </Link>
          <Link href="/archive" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              <Archive className="mr-2 h-4 w-4" /> Legit-fact Archive
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Trending Misinformation
          </h2>
          <Link href="/trending">
            <Button variant="ghost">View all</Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <TrendingMisinformation />
        </div>
      </section>

      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">How It Works</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Input News</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Enter a news headline to begin the verification process.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI system analyzes the content using trusted sources and
                verification algorithms.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Get Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Receive a truth rating with detailed explanation and source
                verification.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
