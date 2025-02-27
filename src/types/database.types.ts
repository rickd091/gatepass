export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          type: string;
          model: string;
          serial_number: string;
          tag_number: string;
          specifications: string;
          condition: string;
          status: "available" | "in_use" | "maintenance" | "disposed";
          branch_id: string;
          department_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          type: string;
          model: string;
          serial_number: string;
          tag_number: string;
          specifications?: string;
          condition: string;
          status?: "available" | "in_use" | "maintenance" | "disposed";
          branch_id: string;
          department_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          type?: string;
          model?: string;
          serial_number?: string;
          tag_number?: string;
          specifications?: string;
          condition?: string;
          status?: "available" | "in_use" | "maintenance" | "disposed";
          branch_id?: string;
          department_id?: string;
        };
      };
      asset_requests: {
        Row: {
          id: string;
          created_at: string;
          asset_id: string;
          requester_id: string;
          requester_type: "staff" | "non_staff";
          purpose: string;
          purpose_category: string;
          justification: string;
          start_date: string;
          end_date: string;
          status: "pending" | "approved" | "rejected" | "completed";
          branch_id: string;
          department_id: string;
          three_day_reminder_sent: boolean;
          one_day_reminder_sent: boolean;
          overdue_reminder_sent: boolean;
          three_day_reminder_sent: boolean;
          one_day_reminder_sent: boolean;
          overdue_reminder_sent: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          asset_id: string;
          requester_id: string;
          requester_type: "staff" | "non_staff";
          purpose: string;
          purpose_category: string;
          justification: string;
          start_date: string;
          end_date: string;
          status?: "pending" | "approved" | "rejected" | "completed";
          branch_id: string;
          department_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          asset_id?: string;
          requester_id?: string;
          requester_type?: "staff" | "non_staff";
          purpose?: string;
          purpose_category?: string;
          justification?: string;
          start_date?: string;
          end_date?: string;
          status?: "pending" | "approved" | "rejected" | "completed";
          branch_id?: string;
          department_id?: string;
        };
      };
      approvals: {
        Row: {
          id: string;
          created_at: string;
          request_id: string;
          approver_id: string;
          approver_role: "department_head" | "ict" | "security";
          status: "pending" | "approved" | "rejected";
          comments: string | null;
          reminder_sent: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          request_id: string;
          approver_id: string;
          approver_role: "department_head" | "ict" | "security";
          status?: "pending" | "approved" | "rejected";
          comments?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          request_id?: string;
          approver_id?: string;
          approver_role?: "department_head" | "ict" | "security";
          status?: "pending" | "approved" | "rejected";
          comments?: string | null;
        };
      };
      departments: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          head_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          head_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          head_id?: string;
        };
      };
      branches: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          location: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          location: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          location?: string;
        };
      };
      security_verifications: {
        Row: {
          id: string;
          created_at: string;
          request_id: string;
          floor_guard_name: string;
          floor_guard_signature: string;
          gate_guard_name: string;
          gate_guard_signature: string;
          verification_type: "outgoing" | "incoming";
          status: "pending" | "verified";
        };
        Insert: {
          id?: string;
          created_at?: string;
          request_id: string;
          floor_guard_name: string;
          floor_guard_signature: string;
          gate_guard_name: string;
          gate_guard_signature: string;
          verification_type: "outgoing" | "incoming";
          status?: "pending" | "verified";
        };
        Update: {
          id?: string;
          created_at?: string;
          request_id?: string;
          floor_guard_name?: string;
          floor_guard_signature?: string;
          gate_guard_name?: string;
          gate_guard_signature?: string;
          verification_type?: "outgoing" | "incoming";
          status?: "pending" | "verified";
        };
      };
      request_attachments: {
        Row: {
          id: string;
          created_at: string;
          request_id: string;
          file_url: string;
          file_type: string;
          file_name: string;
          file_size: number;
          uploaded_by: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          request_id: string;
          file_url: string;
          file_type: string;
          file_name: string;
          file_size: number;
          uploaded_by: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          request_id?: string;
          file_url?: string;
          file_type?: string;
          file_name?: string;
          file_size?: number;
          uploaded_by?: string;
        };
      };
      asset_movements: {
        Row: {
          id: string;
          created_at: string;
          request_id: string;
          asset_id: string;
          origin_location: string;
          destination_location: string;
          movement_type: "outgoing" | "incoming" | "transfer" | "disposal";
          movement_status: "pending" | "in_transit" | "completed";
          verified_by: string | null;
          verification_timestamp: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          request_id: string;
          asset_id: string;
          origin_location: string;
          destination_location: string;
          movement_type: "outgoing" | "incoming" | "transfer" | "disposal";
          movement_status?: "pending" | "in_transit" | "completed";
          verified_by?: string | null;
          verification_timestamp?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          request_id?: string;
          asset_id?: string;
          origin_location?: string;
          destination_location?: string;
          movement_type?: "outgoing" | "incoming" | "transfer" | "disposal";
          movement_status?: "pending" | "in_transit" | "completed";
          verified_by?: string | null;
          verification_timestamp?: string | null;
          notes?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          title: string;
          message: string;
          type: "request" | "approval" | "security" | "system";
          read: boolean;
          link: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          title: string;
          message: string;
          type: "request" | "approval" | "security" | "system";
          read?: boolean;
          link?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: "request" | "approval" | "security" | "system";
          read?: boolean;
          link?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
