
export function getCleanErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again.";
  }

  const message = error.message;

  if (message.includes("429") || message.includes("quota")) {
    return "OpenAI API quota exceeded. Please check your billing and usage limits.";
  }

  if (message.includes("401") || message.includes("Unauthorized")) {
    return "Invalid API key. Please check your OpenAI API key.";
  }

  if (message.includes("403") || message.includes("Forbidden")) {
    return "Access denied. Please check your API key permissions.";
  }

  if (message.includes("network") || message.includes("fetch")) {
    return "Network error. Please check your internet connection and try again.";
  }

  if (message.includes("billing")) {
    return "OpenAI billing issue. Please check your account status.";
  }

  const cleanMessage = message
    .split("\n")[0] 
    .replace(/webpack-internal:\/\/.*/, "") 
    .replace(/at\s+.*/, "") 
    .replace(/\s+eval\s+.*/, "") 
    .trim();

  if (
    !cleanMessage ||
    cleanMessage.includes("webpack") ||
    cleanMessage.includes("eval") ||
    cleanMessage.length < 10
  ) {
    return "Something went wrong. Please try again.";
  }

  return cleanMessage;
}

export function isQuotaError(errorMessage: string): boolean {
  return (
    errorMessage.includes("quota") ||
    errorMessage.includes("billing") ||
    errorMessage.includes("exceeded") ||
    errorMessage.includes("plan") ||
    errorMessage.includes("429")
  );
}

export function isApiKeyError(errorMessage: string): boolean {
  return (
    errorMessage.includes("401") ||
    errorMessage.includes("Unauthorized") ||
    errorMessage.includes("Invalid API key") ||
    errorMessage.includes("API key not found")
  );
}
