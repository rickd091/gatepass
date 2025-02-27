import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const SupabaseTest = () => {
  const [status, setStatus] = useState<"loading" | "connected" | "error">(
    "loading",
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from("branches")
          .select("*")
          .limit(1);

        if (error) throw error;
        console.log("Supabase connection test:", { data });
        setStatus("connected");
      } catch (e) {
        console.error("Supabase connection error:", e);
        setStatus("error");
        setError(e.message);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-4 rounded-lg border">
      <h2 className="text-lg font-semibold mb-2">Supabase Connection Status</h2>
      {status === "loading" && (
        <p className="text-blue-600">Testing connection...</p>
      )}
      {status === "connected" && (
        <p className="text-green-600">Successfully connected to Supabase!</p>
      )}
      {status === "error" && (
        <div className="text-red-600">
          <p>Failed to connect to Supabase</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};
