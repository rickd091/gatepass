import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database.types";
import { withErrorHandling } from "@/lib/utils/error-handler";

type Asset = Database["public"]["Tables"]["assets"]["Row"];
type AssetInsert = Database["public"]["Tables"]["assets"]["Insert"];

export const assetService = {
  async getAssets() {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*, departments(*), branches(*)");

      if (error) throw error;
      return data;
    }, "Failed to fetch assets");
  },

  async getAssetById(id: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*, departments(*), branches(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    }, `Failed to fetch asset with ID: ${id}`);
  },

  async createAsset(asset: AssetInsert) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("assets")
        .insert(asset)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, "Failed to create asset");
  },

  async updateAsset(id: string, asset: Partial<Asset>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("assets")
        .update(asset)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, `Failed to update asset with ID: ${id}`);
  },
};
