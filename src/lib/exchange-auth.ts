import { supabase } from "@/lib/supabase";

interface ExchangeAuthResponse {
  success: boolean;
  user?: {
    username: string;
    email: string;
    displayName: string;
  };
  error?: string;
}

export const exchangeAuth = {
  async login(
    username: string,
    password: string,
  ): Promise<ExchangeAuthResponse> {
    try {
      // Make request to your Exchange server authentication endpoint
      const response = await fetch("/api/exchange-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      // Store the session in Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.user.email,
        password: password, // You might want to use a different password strategy
      });

      if (signInError) throw signInError;

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
