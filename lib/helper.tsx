import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

export const getStatusBadge = (status: "fake" | "questionable" | "verified") => {
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

export const getStatusColor = (status: "fake" | "questionable" | "verified") => {
  switch (status) {
    case "fake":
      return "bg-red-500";
    case "questionable":
      return "bg-yellow-500";
    case "verified":
      return "bg-green-500";
  }
};