export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      approvals: {
        Row: {
          approver_id: string
          approver_role: string
          comments: string | null
          created_at: string
          id: string
          request_id: string
          status: string
        }
        Insert: {
          approver_id: string
          approver_role: string
          comments?: string | null
          created_at?: string
          id?: string
          request_id: string
          status?: string
        }
        Update: {
          approver_id?: string
          approver_role?: string
          comments?: string | null
          created_at?: string
          id?: string
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "asset_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_requests: {
        Row: {
          asset_id: string
          branch_id: string
          created_at: string
          department_id: string
          end_date: string
          id: string
          justification: string
          purpose: string
          purpose_category: string
          requester_id: string
          requester_type: string
          start_date: string
          status: string
        }
        Insert: {
          asset_id: string
          branch_id: string
          created_at?: string
          department_id: string
          end_date: string
          id?: string
          justification: string
          purpose: string
          purpose_category: string
          requester_id: string
          requester_type: string
          start_date: string
          status?: string
        }
        Update: {
          asset_id?: string
          branch_id?: string
          created_at?: string
          department_id?: string
          end_date?: string
          id?: string
          justification?: string
          purpose?: string
          purpose_category?: string
          requester_id?: string
          requester_type?: string
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_requests_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_requests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_requests_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          branch_id: string
          condition: string
          created_at: string
          department_id: string
          id: string
          model: string
          name: string
          serial_number: string
          specifications: string | null
          status: string
          tag_number: string
          type: string
        }
        Insert: {
          branch_id: string
          condition: string
          created_at?: string
          department_id: string
          id?: string
          model: string
          name: string
          serial_number: string
          specifications?: string | null
          status?: string
          tag_number: string
          type: string
        }
        Update: {
          branch_id?: string
          condition?: string
          created_at?: string
          department_id?: string
          id?: string
          model?: string
          name?: string
          serial_number?: string
          specifications?: string | null
          status?: string
          tag_number?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          head_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          head_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          head_id?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      security_verifications: {
        Row: {
          created_at: string
          floor_guard_name: string
          floor_guard_signature: string
          gate_guard_name: string
          gate_guard_signature: string
          id: string
          request_id: string
          status: string
          verification_type: string
        }
        Insert: {
          created_at?: string
          floor_guard_name: string
          floor_guard_signature: string
          gate_guard_name: string
          gate_guard_signature: string
          id?: string
          request_id: string
          status?: string
          verification_type: string
        }
        Update: {
          created_at?: string
          floor_guard_name?: string
          floor_guard_signature?: string
          gate_guard_name?: string
          gate_guard_signature?: string
          id?: string
          request_id?: string
          status?: string
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_verifications_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "asset_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
