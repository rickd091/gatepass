import { supabase } from "@/lib/supabase";
import { withErrorHandling } from "@/lib/utils/error-handler";

export const movementService = {
  async createMovement({
    requestId,
    assetId,
    originLocation,
    destinationLocation,
    movementType,
    notes,
  }: {
    requestId: string;
    assetId: string;
    originLocation: string;
    destinationLocation: string;
    movementType: "outgoing" | "incoming" | "transfer" | "disposal";
    notes?: string;
  }) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("asset_movements")
        .insert({
          request_id: requestId,
          asset_id: assetId,
          origin_location: originLocation,
          destination_location: destinationLocation,
          movement_type: movementType,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }, "Failed to create asset movement record");
  },

  async getMovements(requestId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("asset_movements")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }, "Failed to fetch asset movements");
  },

  async verifyMovement(movementId: string, verifiedBy: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("asset_movements")
        .update({
          movement_status: "completed",
          verified_by: verifiedBy,
          verification_timestamp: new Date().toISOString(),
        })
        .eq("id", movementId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, "Failed to verify asset movement");
  },

  async updateMovementStatus(
    movementId: string,
    status: "pending" | "in_transit" | "completed",
  ) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("asset_movements")
        .update({ movement_status: status })
        .eq("id", movementId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, "Failed to update movement status");
  },
};
