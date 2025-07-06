"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Search,
  TrendingUp,
  Archive,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "API Key Verified",
      description:
        "Your OpenAI API key has been successfully verified and secured.",
    },
    {
      icon: <Search className="h-8 w-8 text-blue-500" />,
      title: "Verify News",
      description:
        "Enter any news headline to check its credibility with AI-powered analysis.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      title: "Track Misinformation",
      description: "Stay updated with trending misinformation and fact-checks.",
    },
    {
      icon: <Archive className="h-8 w-8 text-purple-500" />,
      title: "Browse Archive",
      description: "Access our comprehensive archive of verified fact reports.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsComplete(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(timer);
  }, [steps.length]);

  const handleGetStarted = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">
            Welcome to Legit<span className="text-primary">Fact</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Your fake news detection platform is ready to use
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-500 ${
                  index <= currentStep
                    ? "border-primary/20 bg-primary/5 opacity-100"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <div
                  className={`transition-all duration-500 ${
                    index <= currentStep ? "scale-100" : "scale-75"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index <= currentStep && (
                  <CheckCircle className="h-5 w-5 text-green-500 animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {isComplete && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="flex flex-col gap-3">
                <Button onClick={handleGetStarted} className="w-full" size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Link href="/verify" className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      <Search className="mr-1 h-3 w-3" />
                      Verify
                    </Button>
                  </Link>
                  <Link href="/trending" className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Trending
                    </Button>
                  </Link>
                  <Link href="/archive" className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      <Archive className="mr-1 h-3 w-3" />
                      Archive
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
