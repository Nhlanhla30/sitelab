export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          company_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "owner" | "admin" | "member";
          plan: "starter" | "pro" | "business" | "enterprise";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          company_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "owner" | "admin" | "member";
          plan?: "starter" | "pro" | "business" | "enterprise";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          company_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "owner" | "admin" | "member";
          plan?: "starter" | "pro" | "business" | "enterprise";
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          contact_person: string;
          email: string;
          phone: string;
          address: string | null;
          city: string | null;
          province: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          contact_person: string;
          email: string;
          phone: string;
          address?: string | null;
          city?: string | null;
          province?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          contact_person?: string;
          email?: string;
          phone?: string;
          address?: string | null;
          city?: string | null;
          province?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          quote_number: string;
          user_id: string;
          client_id: string;
          title: string;
          description: string | null;
          subtotal: number;
          vat_amount: number;
          total: number;
          include_vat: boolean;
          valid_until: string;
          terms: string | null;
          notes: string | null;
          status: "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";
          sent_at: string | null;
          viewed_at: string | null;
          responded_at: string | null;
          signature_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote_number?: string;
          user_id: string;
          client_id: string;
          title: string;
          description?: string | null;
          subtotal?: number;
          vat_amount?: number;
          total?: number;
          include_vat?: boolean;
          valid_until: string;
          terms?: string | null;
          notes?: string | null;
          status?: "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";
          sent_at?: string | null;
          viewed_at?: string | null;
          responded_at?: string | null;
          signature_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          subtotal?: number;
          vat_amount?: number;
          total?: number;
          include_vat?: boolean;
          valid_until?: string;
          terms?: string | null;
          notes?: string | null;
          status?: "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";
          sent_at?: string | null;
          viewed_at?: string | null;
          responded_at?: string | null;
          signature_url?: string | null;
          updated_at?: string;
        };
      };
      quote_line_items: {
        Row: {
          id: string;
          quote_id: string;
          description: string;
          category: "labour" | "material" | "equipment" | "other";
          quantity: number;
          unit: string;
          unit_price: number;
          total: number;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote_id: string;
          description: string;
          category?: "labour" | "material" | "equipment" | "other";
          quantity?: number;
          unit?: string;
          unit_price?: number;
          total?: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          description?: string;
          category?: "labour" | "material" | "equipment" | "other";
          quantity?: number;
          unit?: string;
          unit_price?: number;
          total?: number;
          sort_order?: number;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          client_id: string;
          quote_id: string | null;
          name: string;
          description: string | null;
          address: string;
          city: string;
          province: string | null;
          status: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
          start_date: string | null;
          end_date: string | null;
          budget: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          client_id: string;
          quote_id?: string | null;
          name: string;
          description?: string | null;
          address: string;
          city: string;
          province?: string | null;
          status?: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
          start_date?: string | null;
          end_date?: string | null;
          budget?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string;
          quote_id?: string | null;
          name?: string;
          description?: string | null;
          address?: string;
          city?: string;
          province?: string | null;
          status?: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
          start_date?: string | null;
          end_date?: string | null;
          budget?: number;
          updated_at?: string;
        };
      };
      project_milestones: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          percent_complete: number;
          due_date: string | null;
          completed_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          percent_complete?: number;
          due_date?: string | null;
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          percent_complete?: number;
          due_date?: string | null;
          completed_at?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
