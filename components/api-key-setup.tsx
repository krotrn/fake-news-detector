"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Key, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useApiKey } from "@/components/api-key-provider";
import { verifyAPIKey } from "@/modules/ai";

const verifyApiKey = verifyAPIKey;

export default function ApiKeySetup() {
  const { setApiKey, setIsApiKeyValid, setShowWelcome } = useApiKey();
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSuccess(false);

    if (!inputKey.trim()) {
      setError("Please enter your Gemini API key");
      return;
    }

    if (!inputKey.startsWith("AIza") && !inputKey.startsWith("sk-")) {
      setError("Invalid API key format. Gemini API keys typically start with AIza");
      return;
    }

    startTransition(async () => {
      try {
        const result = await verifyApiKey(inputKey.trim());

        if (result.isValid) {
          setIsSuccess(true);
          setApiKey(inputKey.trim());

          setTimeout(() => {
            setIsApiKeyValid(true);
            setShowWelcome(true);
          }, 1000);
        } else {
          setError(
            result.error ||
            "Invalid API key. Please check your key and try again."
          );
        }
      } catch (error) {
        console.log(error);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <CheckCircle className="h-12 w-12 text-green-500 animate-pulse" />
            ) : (
              <Key className="h-12 w-12 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSuccess ? "Success!" : "Welcome to Legit"}
            <span className="text-primary">Fact</span>
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess
              ? "Your API key has been verified successfully. Redirecting to homepage..."
              : "Please enter your Gemini API key to get started with news verification"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSuccess && (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter your Gemini API key (AIza...)"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="font-mono"
                    disabled={isPending}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || !inputKey.trim()}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify & Continue
                    </>
                  )}
                </Button>
              </form>

              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">How to get your Gemini API key:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>
                    Visit{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary/80"
                    >
                      Google AI Studio
                    </a>
                  </li>
                  <li>Sign in to your Google account</li>
                  <li>Click &ldquo;Create API key&rdquo;</li>
                  <li>Copy the key and paste it here</li>
                </ol>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Your API key is stored locally in your browser and never sent
                  to our servers. It&apos;s only used to communicate directly with
                  Google&apos;s Gemini API.
                </AlertDescription>
              </Alert>
            </>
          )}

          {isSuccess && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                API key verified successfully! Welcome to LegitFact.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
