import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database.types";
import { withErrorHandling } from "@/lib/utils/error-handler";

type AssetRequest = Database["public"]["Tables"]["asset_requests"]["Row"];
type AssetRequestInsert =
  Database["public"]["Tables"]["asset_requests"]["Insert"];

export const requestService = {
  async createRequest(request: AssetRequestInsert) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("asset_requests")
        .insert(request)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, "Failed to create request");
  },

  async getRequestById(id: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("asset_requests")
        .select("*, assets(*), departments(*), branches(*), approvals(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    }, `Failed to fetch request with ID: ${id}`);
  },

  async duplicateRequest(
    requestId: string,
    newDates?: { startDate: string; endDate: string },
  ) {
    return withErrorHandling(async () => {
      // Fetch the original request with all related data
      const originalRequest = await this.getRequestById(requestId);

      if (!originalRequest) {
        throw new Error("Original request not found");
      }

      // Create new request with data from original
      const newRequest: AssetRequestInsert = {
        asset_id: originalRequest.asset_id,
        requester_id: originalRequest.requester_id,
        requester_type: originalRequest.requester_type,
        purpose: originalRequest.purpose,
        purpose_category: originalRequest.purpose_category,
        justification: originalRequest.justification,
        start_date: newDates?.startDate || new Date().toISOString(),
        end_date:
          newDates?.endDate ||
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        branch_id: originalRequest.branch_id,
        department_id: originalRequest.department_id,
      };

      // Create the duplicated request
      const { data: newRequestData, error } = await supabase
        .from("asset_requests")
        .insert(newRequest)
        .select()
        .single();

      if (error) throw error;

      // Create initial approvals for the new request
      await Promise.all([
        supabase.from("approvals").insert({
          request_id: newRequestData.id,
          approver_id: "department_head",
          approver_role: "department_head",
          status: "pending",
        }),
        supabase.from("approvals").insert({
          request_id: newRequestData.id,
          approver_id: "ict_officer",
          approver_role: "ict",
          status: "pending",
        }),
      ]);

      return newRequestData;
    }, "Failed to duplicate request");
  },

  async cancelRequest(id: string) {
    return withErrorHandling(async () => {
      // First check if the request can be cancelled
      const { data: request } = await supabase
        .from("asset_requests")
        .select("status")
        .eq("id", id)
        .single();

      if (request?.status !== "pending") {
        throw new Error("Only pending requests can be cancelled");
      }

      // Cancel the request
      const { data, error } = await supabase
        .from("asset_requests")
        .update({ status: "cancelled" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Cancel any pending approvals
      await supabase
        .from("approvals")
        .update({ status: "cancelled" })
        .eq("request_id", id)
        .eq("status", "pending");

      return data;
    }, "Failed to cancel request");
  },
};
