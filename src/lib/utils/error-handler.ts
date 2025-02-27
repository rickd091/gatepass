import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string,
    public hint?: string,
  ) {
    super(message);
    this.name = "SupabaseError";
  }
}

export const handleSupabaseError = (error: PostgrestError | Error): never => {
  if ("code" in error) {
    // Handle specific Postgres error codes
    switch (error.code) {
      case "23505":
        throw new SupabaseError(
          "This record already exists.",
          error.code,
          error.details,
        );
      case "23503":
        throw new SupabaseError(
          "Referenced record does not exist.",
          error.code,
          error.details,
        );
      case "42P01":
        throw new SupabaseError(
          "Table does not exist.",
          error.code,
          error.details,
        );
      case "42703":
        throw new SupabaseError(
          "Column does not exist.",
          error.code,
          error.details,
        );
      default:
        throw new SupabaseError(
          "Database error occurred.",
          error.code,
          error.details,
          error.hint,
        );
    }
  }
  throw new SupabaseError(error.message);
};

export const handleError = (error: unknown, customMessage?: string) => {
  console.error("Error:", error);

  if (error instanceof SupabaseError) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return error;
  }

  const message = customMessage || "An unexpected error occurred";
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
  return new Error(message);
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  customMessage?: string,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    throw handleError(error, customMessage);
  }
};
