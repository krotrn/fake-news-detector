interface ErrorSuppressor {
  originalError: typeof console.error;
  suppressed: boolean;
}

let errorSuppressor: ErrorSuppressor | null = null;

export function suppressOpenAIErrors(): void {
  if (errorSuppressor) return;

  errorSuppressor = {
    originalError: console.error,
    suppressed: true,
  };

  console.error = (...args: unknown[]) => {
    const errorMessage = args.join(" ").toLowerCase();

    if (
      errorMessage.includes("openai") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("billing") ||
      errorMessage.includes("api key") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("rate limit")
    ) {
      errorSuppressor!.originalError(
        "OpenAI API Error (suppressed from dev tools):",
        ...args
      );
      return;
    }

    errorSuppressor!.originalError(...args);
  };
}

export function restoreConsoleError(): void {
  if (errorSuppressor) {
    console.error = errorSuppressor.originalError;
    errorSuppressor = null;
  }
}

export async function withErrorSuppression<T>(
  operation: () => Promise<T>
): Promise<T> {
  suppressOpenAIErrors();
  try {
    return await operation();
  } finally {
    restoreConsoleError();
  }
}

export interface CleanError {
  message?: string;
  toString?: () => string;
}

export function cleanErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred";

  const errObj = error as CleanError;
  const message =
    errObj.message ||
    (typeof errObj.toString === "function" ? errObj.toString() : String(error));

  const cleanMessage = message.split("\n")[0];

  return cleanMessage
    .replace(/^Error:\s*/, "")
    .replace(/^APIError:\s*/, "")
    .replace(/^OpenAI_API_ERROR:\s*/, "")
    .trim();
}

export interface OpenAIError {
  message?: string;
  toString?: () => string;
}

export function isOpenAIError(error: unknown): boolean {
  if (!error) return false;

  const errObj = error as OpenAIError;
  const message = (
    errObj.message ||
    (typeof errObj.toString === "function" ? errObj.toString() : String(error))
  ).toLowerCase();

  return (
    message.includes("openai") ||
    message.includes("quota") ||
    message.includes("billing") ||
    message.includes("api key") ||
    message.includes("unauthorized") ||
    message.includes("rate limit") ||
    message.includes("429") ||
    message.includes("401") ||
    message.includes("403")
  );
}
