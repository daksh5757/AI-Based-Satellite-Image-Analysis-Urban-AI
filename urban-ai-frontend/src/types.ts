export interface AIMetrics {
  green_space_percentage: number;
  building_density: number;
  water_bodies_percentage: number;
  transportation_network_score: number;
  air_quality_index: number;
  heat_island_risk: string;
}

export interface AIRecommendation {
  title: string;
  priority: string;
  impact: string;
  description: string;
}

export interface AIAnalysisResult {
  sustainability_score: number;
  vegetation_ratio: number;
  urban_density: number;
  metrics: AIMetrics;
  recommendations: AIRecommendation[];
  overlays: {
    vegetation: string;
    water: string;
    edges: string;
  };
}
