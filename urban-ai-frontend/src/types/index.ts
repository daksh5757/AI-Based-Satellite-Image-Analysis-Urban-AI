export interface Recommendation {
  title: string;
  description: string;
  impact: string;
  priority: string;
}

export interface AIAnalysisResult {
  sustainability_score: number;
  vegetation_ratio: number;
  urban_density: number;
  land_use: {
    land_use_class: string;
    confidence: number;
    top_predictions: any[];
  };
  ndvi: { score: number; class: string };
  random_forest: { 
    sustainability_category: string; 
    confidence: number;
    feature_importance: Record<string, number>; 
  };
  kmeans: { clusters: Record<string, { percentage: number; dominant_color_rgb: number[] }> };
  metrics: {
    green_space_percentage: number;
    building_density: number;
    water_bodies_percentage: number;
    transportation_network_score: number;
    air_quality_index: number;
    heat_island_risk: string;
    brightness: number;
    contrast: number;
  };
  recommendations: Recommendation[];
  overlays: {
    vegetation: string;
    water: string;
    edges: string;
    ndvi: string;
    segmented: string;
  };
}