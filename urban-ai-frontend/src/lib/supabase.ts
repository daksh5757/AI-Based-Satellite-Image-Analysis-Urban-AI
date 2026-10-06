import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      analysis_projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          location: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          location?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          location?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      satellite_images: {
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          image_name: string;
          upload_date: string;
          metadata: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          image_name: string;
          upload_date?: string;
          metadata?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_url?: string;
          image_name?: string;
          upload_date?: string;
          metadata?: Record<string, unknown>;
        };
      };
      ai_analysis_results: {
        Row: {
          id: string;
          image_id: string;
          analysis_type: string;
          results: Record<string, unknown>;
          sustainability_score: number;
          recommendations: Array<unknown>;
          analyzed_at: string;
        };
        Insert: {
          id?: string;
          image_id: string;
          analysis_type: string;
          results?: Record<string, unknown>;
          sustainability_score?: number;
          recommendations?: Array<unknown>;
          analyzed_at?: string;
        };
        Update: {
          id?: string;
          image_id?: string;
          analysis_type?: string;
          results?: Record<string, unknown>;
          sustainability_score?: number;
          recommendations?: Array<unknown>;
          analyzed_at?: string;
        };
      };
      urban_metrics: {
        Row: {
          id: string;
          analysis_id: string;
          green_space_percentage: number;
          building_density: number;
          transportation_network_score: number;
          water_bodies_percentage: number;
          heat_island_risk: string;
          air_quality_index: number;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          green_space_percentage?: number;
          building_density?: number;
          transportation_network_score?: number;
          water_bodies_percentage?: number;
          heat_island_risk?: string;
          air_quality_index?: number;
        };
        Update: {
          id?: string;
          analysis_id?: string;
          green_space_percentage?: number;
          building_density?: number;
          transportation_network_score?: number;
          water_bodies_percentage?: number;
          heat_island_risk?: string;
          air_quality_index?: number;
        };
      };
    };
  };
};
