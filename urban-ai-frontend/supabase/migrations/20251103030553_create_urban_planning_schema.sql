/*
  # Urban Planning Satellite Imagery Analysis Schema

  1. New Tables
    - `analysis_projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - Project name
      - `description` (text) - Project description
      - `location` (text) - Geographic location
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `satellite_images`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references analysis_projects)
      - `image_url` (text) - URL to stored image
      - `image_name` (text) - Original filename
      - `upload_date` (timestamptz)
      - `metadata` (jsonb) - Image metadata (coordinates, date taken, etc.)
    
    - `ai_analysis_results`
      - `id` (uuid, primary key)
      - `image_id` (uuid, references satellite_images)
      - `analysis_type` (text) - Type of analysis performed
      - `results` (jsonb) - Analysis results and metrics
      - `sustainability_score` (numeric) - Overall sustainability rating
      - `recommendations` (jsonb) - AI recommendations
      - `analyzed_at` (timestamptz)
    
    - `urban_metrics`
      - `id` (uuid, primary key)
      - `analysis_id` (uuid, references ai_analysis_results)
      - `green_space_percentage` (numeric)
      - `building_density` (numeric)
      - `transportation_network_score` (numeric)
      - `water_bodies_percentage` (numeric)
      - `heat_island_risk` (text)
      - `air_quality_index` (numeric)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS analysis_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  location text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE analysis_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON analysis_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON analysis_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON analysis_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON analysis_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS satellite_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES analysis_projects(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  image_name text NOT NULL,
  upload_date timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE satellite_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view images from own projects"
  ON satellite_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM analysis_projects
      WHERE analysis_projects.id = satellite_images.project_id
      AND analysis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload images to own projects"
  ON satellite_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM analysis_projects
      WHERE analysis_projects.id = satellite_images.project_id
      AND analysis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images from own projects"
  ON satellite_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM analysis_projects
      WHERE analysis_projects.id = satellite_images.project_id
      AND analysis_projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS ai_analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id uuid REFERENCES satellite_images(id) ON DELETE CASCADE NOT NULL,
  analysis_type text NOT NULL,
  results jsonb DEFAULT '{}'::jsonb,
  sustainability_score numeric DEFAULT 0,
  recommendations jsonb DEFAULT '[]'::jsonb,
  analyzed_at timestamptz DEFAULT now()
);

ALTER TABLE ai_analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analysis from own images"
  ON ai_analysis_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM satellite_images
      JOIN analysis_projects ON analysis_projects.id = satellite_images.project_id
      WHERE satellite_images.id = ai_analysis_results.image_id
      AND analysis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create analysis for own images"
  ON ai_analysis_results FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM satellite_images
      JOIN analysis_projects ON analysis_projects.id = satellite_images.project_id
      WHERE satellite_images.id = ai_analysis_results.image_id
      AND analysis_projects.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS urban_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES ai_analysis_results(id) ON DELETE CASCADE NOT NULL,
  green_space_percentage numeric DEFAULT 0,
  building_density numeric DEFAULT 0,
  transportation_network_score numeric DEFAULT 0,
  water_bodies_percentage numeric DEFAULT 0,
  heat_island_risk text DEFAULT 'low',
  air_quality_index numeric DEFAULT 0
);

ALTER TABLE urban_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view metrics from own analysis"
  ON urban_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_analysis_results
      JOIN satellite_images ON satellite_images.id = ai_analysis_results.image_id
      JOIN analysis_projects ON analysis_projects.id = satellite_images.project_id
      WHERE ai_analysis_results.id = urban_metrics.analysis_id
      AND analysis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create metrics for own analysis"
  ON urban_metrics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_analysis_results
      JOIN satellite_images ON satellite_images.id = ai_analysis_results.image_id
      JOIN analysis_projects ON analysis_projects.id = satellite_images.project_id
      WHERE ai_analysis_results.id = urban_metrics.analysis_id
      AND analysis_projects.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON analysis_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_images_project_id ON satellite_images(project_id);
CREATE INDEX IF NOT EXISTS idx_analysis_image_id ON ai_analysis_results(image_id);
CREATE INDEX IF NOT EXISTS idx_metrics_analysis_id ON urban_metrics(analysis_id);