import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database.types";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];
type NotificationInsert =
  Database["public"]["Tables"]["notifications"]["Insert"];

const NOTIFICATION_TYPES = {
  REQUEST_CREATED: "request_created",
  REQUEST_APPROVED: "request_approved",
  REQUEST_REJECTED: "request_rejected",
  REQUEST_CANCELLED: "request_cancelled",
  APPROVAL_NEEDED: "approval_needed",
  RETURN_REMINDER: "return_reminder",
  OVERDUE_REMINDER: "overdue_reminder",
} as const;

export const notificationService = {
  async createNotification(notification: NotificationInsert) {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
