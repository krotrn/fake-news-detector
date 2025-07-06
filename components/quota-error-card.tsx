"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ExternalLink,
  CreditCard,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { isQuotaError } from "@/lib/error-utils";

interface QuotaErrorCardProps {
  errorMessage: string;
}

export default function QuotaErrorCard({ errorMessage }: QuotaErrorCardProps) {
  if (!isQuotaError(errorMessage)) {
    return null;
  }

  return (
    <Card className="border border-orange-500 bg-orange-50 dark:bg-orange-950/10 mb-6">
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
        <CardTitle className="text-orange-600 text-lg">
          OpenAI Quota Limit Reached
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-orange-700 dark:text-orange-300">
          Your OpenAI account has reached its usage or billing limit. This is
          not an issue with LegitFact.
        </p>

        <Alert className="border-orange-200 bg-orange-100 dark:bg-orange-900/20">
          <HelpCircle className="h-4 w-4" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>Quick Fix:</strong> Visit your OpenAI dashboard to add
            credits or upgrade your plan.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-semibold text-orange-700 dark:text-orange-300">
            What you can do:
          </h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-900/20"
              onClick={() =>
                window.open(
                  "https://platform.openai.com/account/billing",
                  "_blank"
                )
              }
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Check Billing & Add Credits
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-900/20"
              onClick={() =>
                window.open("https://platform.openai.com/usage", "_blank")
              }
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              View Usage Dashboard
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-900/20"
              onClick={() =>
                window.open(
                  "https://platform.openai.com/docs/guides/rate-limits",
                  "_blank"
                )
              }
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Learn About Rate Limits
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20 p-3 rounded">
          <strong>Note:</strong> If you&apos;re on the free tier, you may need to
          upgrade to a paid plan or wait for your quota to reset.
        </div>
      </CardContent>
    </Card>
  );
}
