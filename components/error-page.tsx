import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

type ErrorCardProps = {
  errorMessage: string;
  onRetry?: () => void;
};

export default function ErrorCard({ errorMessage, onRetry }: ErrorCardProps) {
  return (
    <Card className="border border-red-500 bg-red-50 dark:bg-red-950/10">
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        <CardTitle className="text-red-500 text-lg">Error</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
