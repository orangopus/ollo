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
      layouts: {
        Row: {
          id: string
          posts: Json | null
          profile: Json | null
          socials: Json | null
        }
        Insert: {
          id: string
          posts?: Json | null
          profile?: Json | null
          socials?: Json | null
        }
        Update: {
          id?: string
          posts?: Json | null
          profile?: Json | null
          socials?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "layouts_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "posts_with_likes"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "layouts_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: number
          post_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          post_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          avatar: string | null
          content: string | null
          created_at: string | null
          discord_id: string | null
          id: number
          published_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar?: string | null
          content?: string | null
          created_at?: string | null
          discord_id?: string | null
          id?: number
          published_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar?: string | null
          content?: string | null
          created_at?: string | null
          discord_id?: string | null
          id?: number
          published_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "posts_with_likes"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          background: string | null
          background_url: string | null
          bio: string | null
          css: string | null
          discord_id: string | null
          displayname: string | null
          html: string | null
          id: string
          mod: boolean | null
          paypal: string | null
          pro: boolean | null
          social: Json
          spotify: Json | null
          staff: boolean | null
          username: string | null
          verified: boolean | null
        }
        Insert: {
          avatar?: string | null
          background?: string | null
          background_url?: string | null
          bio?: string | null
          css?: string | null
          discord_id?: string | null
          displayname?: string | null
          html?: string | null
          id?: string
          mod?: boolean | null
          paypal?: string | null
          pro?: boolean | null
          social?: Json
          spotify?: Json | null
          staff?: boolean | null
          username?: string | null
          verified?: boolean | null
        }
        Update: {
          avatar?: string | null
          background?: string | null
          background_url?: string | null
          bio?: string | null
          css?: string | null
          discord_id?: string | null
          displayname?: string | null
          html?: string | null
          id?: string
          mod?: boolean | null
          paypal?: string | null
          pro?: boolean | null
          social?: Json
          spotify?: Json | null
          staff?: boolean | null
          username?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      replies: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          post_id: number | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          post_id?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          post_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_likes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "vw_posts_with_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      posts_with_likes: {
        Row: {
          author_id: string | null
          avatar: string | null
          content: string | null
          displayname: string | null
          id: number | null
          likes: number | null
          published_at: string | null
          username: string | null
        }
        Relationships: []
      }
      vw_posts_with_user: {
        Row: {
          avatar: string | null
          content: string | null
          displayname: string | null
          id: number | null
          published_at: string | null
          social: Json | null
          staff: boolean | null
          user_id: string | null
          username: string | null
          verified: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "posts_with_likes"
            referencedColumns: ["author_id"]
          },
        ]
      }
    }
    Functions: {
      increment: {
        Args: {
          x: number
          row_id: number
        }
        Returns: undefined
      }
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
