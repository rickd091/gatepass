import { supabase } from "@/lib/supabase";
import { withErrorHandling } from "@/lib/utils/error-handler";

export const attachmentService = {
  async addAttachment({
    requestId,
    fileUrl,
    fileName,
    fileType,
    fileSize,
    uploadedBy,
  }: {
    requestId: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
  }) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("request_attachments")
        .insert({
          request_id: requestId,
          file_url: fileUrl,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          uploaded_by: uploadedBy,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }, "Failed to add attachment");
  },

  async getRequestAttachments(requestId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("request_attachments")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }, "Failed to fetch attachments");
  },
};
