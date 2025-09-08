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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      attendances: {
        Row: {
          academic_period: string
          attendance_date: string
          created_at: string | null
          created_by: string
          id: string
          is_late: boolean | null
          is_present: boolean
          observations: string | null
          student_id: string
          subject_id: string
        }
        Insert: {
          academic_period: string
          attendance_date: string
          created_at?: string | null
          created_by: string
          id?: string
          is_late?: boolean | null
          is_present: boolean
          observations?: string | null
          student_id: string
          subject_id: string
        }
        Update: {
          academic_period?: string
          attendance_date?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_late?: boolean | null
          is_present?: boolean
          observations?: string | null
          student_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendances_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      dropout_predictions: {
        Row: {
          created_at: string | null
          factors_analyzed: Json
          id: string
          is_active: boolean | null
          model_version: string | null
          prediction_date: string | null
          probability: number
          risk_level: Database["public"]["Enums"]["risk_level"]
          student_id: string
        }
        Insert: {
          created_at?: string | null
          factors_analyzed: Json
          id?: string
          is_active?: boolean | null
          model_version?: string | null
          prediction_date?: string | null
          probability: number
          risk_level: Database["public"]["Enums"]["risk_level"]
          student_id: string
        }
        Update: {
          created_at?: string | null
          factors_analyzed?: Json
          id?: string
          is_active?: boolean | null
          model_version?: string | null
          prediction_date?: string | null
          probability?: number
          risk_level?: Database["public"]["Enums"]["risk_level"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dropout_predictions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          academic_period: string
          created_at: string | null
          created_by: string
          grade: number
          grade_date: string
          grade_type: string
          id: string
          observations: string | null
          student_id: string
          subject_id: string
        }
        Insert: {
          academic_period: string
          created_at?: string | null
          created_by: string
          grade: number
          grade_date: string
          grade_type: string
          id?: string
          observations?: string | null
          student_id: string
          subject_id: string
        }
        Update: {
          academic_period?: string
          created_at?: string | null
          created_by?: string
          grade?: number
          grade_date?: string
          grade_type?: string
          id?: string
          observations?: string | null
          student_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grades_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          due_date: string | null
          id: string
          prediction_id: string | null
          priority: number
          recommendation_type: string
          status: string | null
          student_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          due_date?: string | null
          id?: string
          prediction_id?: string | null
          priority: number
          recommendation_type: string
          status?: string | null
          student_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          due_date?: string | null
          id?: string
          prediction_id?: string | null
          priority?: number
          recommendation_type?: string
          status?: string | null
          student_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "dropout_predictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          birth_date: string | null
          created_at: string | null
          created_by: string | null
          distance_to_university: number | null
          email: string | null
          enrollment_date: string
          family_income: number | null
          family_size: number | null
          first_name: string
          gender: string | null
          has_scholarship: boolean | null
          id: string
          is_first_generation: boolean | null
          last_name: string
          parents_education_level: string | null
          phone: string | null
          program: string
          semester: number
          status: Database["public"]["Enums"]["student_status"] | null
          student_code: string
          transportation_type: string | null
          updated_at: string | null
          work_hours_per_week: number | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          created_at?: string | null
          created_by?: string | null
          distance_to_university?: number | null
          email?: string | null
          enrollment_date: string
          family_income?: number | null
          family_size?: number | null
          first_name: string
          gender?: string | null
          has_scholarship?: boolean | null
          id?: string
          is_first_generation?: boolean | null
          last_name: string
          parents_education_level?: string | null
          phone?: string | null
          program: string
          semester: number
          status?: Database["public"]["Enums"]["student_status"] | null
          student_code: string
          transportation_type?: string | null
          updated_at?: string | null
          work_hours_per_week?: number | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          created_at?: string | null
          created_by?: string | null
          distance_to_university?: number | null
          email?: string | null
          enrollment_date?: string
          family_income?: number | null
          family_size?: number | null
          first_name?: string
          gender?: string | null
          has_scholarship?: boolean | null
          id?: string
          is_first_generation?: boolean | null
          last_name?: string
          parents_education_level?: string | null
          phone?: string | null
          program?: string
          semester?: number
          status?: Database["public"]["Enums"]["student_status"] | null
          student_code?: string
          transportation_type?: string | null
          updated_at?: string | null
          work_hours_per_week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "students_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          credits: number
          id: string
          name: string
          program: string
          semester: number
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          credits: number
          id?: string
          name: string
          program: string
          semester: number
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          credits?: number
          id?: string
          name?: string
          program?: string
          semester?: number
        }
        Relationships: [
          {
            foreignKeyName: "subjects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "coordinador_academico" | "docente" | "administrador"
      risk_level: "bajo" | "medio" | "alto" | "critico"
      student_status: "activo" | "inactivo" | "desertor" | "graduado"
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
      app_role: ["coordinador_academico", "docente", "administrador"],
      risk_level: ["bajo", "medio", "alto", "critico"],
      student_status: ["activo", "inactivo", "desertor", "graduado"],
    },
  },
} as const
