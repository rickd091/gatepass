import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database.types";

type Approval = Database["public"]["Tables"]["approvals"]["Row"];
type ApprovalInsert = Database["public"]["Tables"]["approvals"]["Insert"];

export const approvalService = {
  async createApproval(approval: ApprovalInsert) {
    const { data, error } = await supabase
      .from("approvals")
      .insert(approval)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getApprovals(requestId: string) {
    const { data, error } = await supabase
      .from("approvals")
      .select("*")
      .eq("request_id", requestId);

    if (error) throw error;
    return data;
  },

  async updateApproval(id: string, approval: Partial<Approval>) {
    const { data, error } = await supabase
      .from("approvals")
      .update(approval)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
