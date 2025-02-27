import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database.types";

type SecurityVerification =
  Database["public"]["Tables"]["security_verifications"]["Row"];
type SecurityVerificationInsert =
  Database["public"]["Tables"]["security_verifications"]["Insert"];

export const securityService = {
  async createVerification(verification: SecurityVerificationInsert) {
    const { data, error } = await supabase
      .from("security_verifications")
      .insert(verification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getVerifications(requestId: string) {
    const { data, error } = await supabase
      .from("security_verifications")
      .select("*")
      .eq("request_id", requestId);

    if (error) throw error;
    return data;
  },

  async updateVerification(
    id: string,
    verification: Partial<SecurityVerification>,
  ) {
    const { data, error } = await supabase
      .from("security_verifications")
      .update(verification)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
