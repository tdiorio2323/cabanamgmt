export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_emails: {
        Row: {
          added_at: string | null
          email: string
        }
        Insert: {
          added_at?: string | null
          email: string
        }
        Update: {
          added_at?: string | null
          email?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          operation: string
          record_id: string
          table_name: string
          user_agent: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          record_id: string
          table_name: string
          user_agent?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          record_id?: string
          table_name?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string | null
          deposit_paid_at: string | null
          deposit_status: Database["public"]["Enums"]["deposit_status"] | null
          id: string
          interview_status:
            | Database["public"]["Enums"]["interview_status"]
            | null
          nda_signed: boolean | null
          notes: string | null
          payment_intent_id: string | null
          slot: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deposit_paid_at?: string | null
          deposit_status?: Database["public"]["Enums"]["deposit_status"] | null
          id?: string
          interview_status?:
            | Database["public"]["Enums"]["interview_status"]
            | null
          nda_signed?: boolean | null
          notes?: string | null
          payment_intent_id?: string | null
          slot?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deposit_paid_at?: string | null
          deposit_status?: Database["public"]["Enums"]["deposit_status"] | null
          id?: string
          interview_status?:
            | Database["public"]["Enums"]["interview_status"]
            | null
          nda_signed?: boolean | null
          notes?: string | null
          payment_intent_id?: string | null
          slot?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string
          handle: string
          id: string
          links: Json | null
          products: Json | null
          theme: Json | null
          tipjar_title: string | null
          tipjar_url: string | null
          video_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          handle: string
          id?: string
          links?: Json | null
          products?: Json | null
          theme?: Json | null
          tipjar_title?: string | null
          tipjar_url?: string | null
          video_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          handle?: string
          id?: string
          links?: Json | null
          products?: Json | null
          theme?: Json | null
          tipjar_title?: string | null
          tipjar_url?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      invite_redemptions: {
        Row: {
          id: string
          invite_id: string
          ip: unknown | null
          redeemed_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          id?: string
          invite_id: string
          ip?: unknown | null
          redeemed_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          id?: string
          invite_id?: string
          ip?: unknown | null
          redeemed_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invite_redemptions_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "invites"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          email: string | null
          expires_at: string
          id: string
          note: string | null
          role: string
          status: string
          token: string | null
          uses_allowed: number
          uses_remaining: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          note?: string | null
          role: string
          status?: string
          token?: string | null
          uses_allowed?: number
          uses_remaining?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          note?: string | null
          role?: string
          status?: string
          token?: string | null
          uses_allowed?: number
          uses_remaining?: number
        }
        Relationships: []
      }
      kv_store_09ebf32b: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_1f678723: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: number
          title: string
        }
        Insert: {
          id?: never
          title: string
        }
        Update: {
          id?: never
          title?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          id: string
          key: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
        }
        Relationships: []
      }
      signup_requests: {
        Row: {
          created_at: string | null
          email: string
          id: number
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
        }
        Relationships: []
      }
      stripe_events: {
        Row: {
          created_at: string
          event_id: string
          id: string
          processed_at: string
          type: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          processed_at?: string
          type: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          processed_at?: string
          type?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          dob: string | null
          email: string
          full_name: string
          id: string
          license_id: string | null
          phone: string | null
          screening_status:
            | Database["public"]["Enums"]["screening_status"]
            | null
          selfie_url: string | null
          updated_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          created_at?: string | null
          dob?: string | null
          email: string
          full_name: string
          id?: string
          license_id?: string | null
          phone?: string | null
          screening_status?:
            | Database["public"]["Enums"]["screening_status"]
            | null
          selfie_url?: string | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          created_at?: string | null
          dob?: string | null
          email?: string
          full_name?: string
          id?: string
          license_id?: string | null
          phone?: string | null
          screening_status?:
            | Database["public"]["Enums"]["screening_status"]
            | null
          selfie_url?: string | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: []
      }
      vip_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          metadata: Json
          role: string
          uses_allowed: number
          uses_remaining: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          metadata?: Json
          role: string
          uses_allowed?: number
          uses_remaining?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          metadata?: Json
          role?: string
          uses_allowed?: number
          uses_remaining?: number
        }
        Relationships: []
      }
      vip_passes: {
        Row: {
          active: boolean
          code: string
          expires_at: string | null
          id: string
        }
        Insert: {
          active?: boolean
          code: string
          expires_at?: string | null
          id?: string
        }
        Update: {
          active?: boolean
          code?: string
          expires_at?: string | null
          id?: string
        }
        Relationships: []
      }
      vip_redemptions: {
        Row: {
          code_id: string
          id: string
          ip: unknown | null
          redeemed_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          code_id: string
          id?: string
          ip?: unknown | null
          redeemed_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          code_id?: string
          id?: string
          ip?: unknown | null
          redeemed_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vip_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "vip_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
          instagram: string | null
          name: string | null
          ref_code: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          instagram?: string | null
          name?: string | null
          ref_code?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          instagram?: string | null
          name?: string | null
          ref_code?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          idempotency_key: string
          processed_at: string
          provider: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          idempotency_key: string
          processed_at?: string
          provider: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          idempotency_key?: string
          processed_at?: string
          provider?: string
        }
        Relationships: []
      }
    }
    Views: {
      security_dashboard: {
        Row: {
          description: string | null
          metric: string | null
          value: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrement_uses: {
        Args: { p_code_id: string }
        Returns: undefined
      }
      get_app_setting: {
        Args: { k: string }
        Returns: string
      }
      get_setting: {
        Args: { k: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { user_email: string }
        Returns: boolean
      }
      list_users_basic: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          id: string
        }[]
      }
      mint_vip_code: {
        Args:
          | {
              p_code?: string
              p_days?: number
              p_metadata?: Json
              p_role?: string
              p_uses?: number
            }
          | {
              p_code?: string
              p_expires_at?: string
              p_metadata?: Json
              p_role?: string
              p_uses?: number
            }
        Returns: {
          code: string
          expires_at: string
          role: string
          uses_allowed: number
          uses_remaining: number
        }[]
      }
      redeem_vip_code: {
        Args: { p_code: string; p_ip?: unknown; p_user_agent?: string }
        Returns: string
      }
    }
    Enums: {
      deposit_status: "pending" | "paid" | "failed" | "refunded"
      interview_status: "pending" | "scheduled" | "completed" | "failed"
      screening_status: "pending" | "clear" | "flagged"
      verification_status: "pending" | "verified" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      deposit_status: ["pending", "paid", "failed", "refunded"],
      interview_status: ["pending", "scheduled", "completed", "failed"],
      screening_status: ["pending", "clear", "flagged"],
      verification_status: ["pending", "verified", "failed"],
    },
  },
} as const
