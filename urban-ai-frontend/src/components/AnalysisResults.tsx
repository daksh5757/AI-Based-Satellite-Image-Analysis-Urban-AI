import React, { useState } from "react";
import { AIAnalysisResult } from "../types";
import {
  TreePine, Building2, Droplets, Navigation, Wind,
  ThermometerSun, Brain, BarChart2, Image as ImageIcon, Layers
} from "lucide-react";

type OverlayKey = "vegetation" | "water" | "edges" | "ndvi" | "segmented";

export default function AnalysisResults({ analysis }: { analysis: AIAnalysisResult }) {
  const [tab, setTab] = useState<OverlayKey>("vegetation");

  const overlayKeys: OverlayKey[] = ["vegetation", "water", "edges", "ndvi", "segmented"];
  const currentOverlay = analysis.overlays[tab];

  return (
    <div className="space-y-8 pb-10">

      {/* Sustainability Score */}
      <div className="bg-white p-6 rounded-xl shadow border-l-4 border-emerald-500">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Sustainability Score</h2>
        <div className="flex items-center space-x-6">
          <div className="text-6xl font-black text-emerald-600">
            {analysis.sustainability_score.toFixed(1)}
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden border">
              <div
                className="h-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${analysis.sustainability_score}%` }}
              />
            </div>
            <p className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest">
              ML Classification: {analysis.random_forest.sustainability_category}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column — ML Stats */}
        <div className="space-y-6">

          {/* CNN */}
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="text-lg font-bold mb-4 flex items-center text-purple-700">
              <Brain className="mr-2" /> CNN: {analysis.land_use.land_use_class}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Confidence: {analysis.land_use.confidence.toFixed(1)}%
            </p>
            <div className="mt-3 space-y-2">
              {analysis.land_use.top_predictions.map((p, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <span className="w-36 text-xs text-gray-600">{p.class}</span>
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: `${p.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12 text-right">
                    {p.confidence.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Random Forest */}
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="text-lg font-bold mb-4 flex items-center text-blue-700">
              <BarChart2 className="mr-2" /> Random Forest Feature Analysis
            </h3>
            <div className="space-y-3">
              {Object.entries(analysis.random_forest.feature_importance).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 mb-1">
                    <span>{key.replace("_", " ")}</span>
                    <span>{val.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* K-Means */}
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="text-lg font-bold mb-4 flex items-center text-orange-700">
              <Layers className="mr-2" /> K-Means Pixel Segmentation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(analysis.kmeans.clusters).map(([key, cluster]) => (
                <div
                  key={key}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
                >
                  <div
                    className="w-10 h-10 rounded-full border shadow flex-shrink-0"
                    style={{
                      backgroundColor: `rgb(${cluster.dominant_color_rgb[0]}, ${cluster.dominant_color_rgb[1]}, ${cluster.dominant_color_rgb[2]})`,
                    }}
                  />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">
                      {key.replace("_", " ")}
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      {cluster.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column — Vision Overlays */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-bold mb-4 flex items-center text-emerald-700">
            <ImageIcon className="mr-2" /> Vision Layers
          </h3>
          <div className="flex gap-2 mb-4 flex-wrap">
            {overlayKeys.map((o) => (
              <button
                key={o}
                onClick={() => setTab(o)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                  tab === o
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <div className="relative rounded-lg overflow-hidden border shadow-inner bg-gray-50">
            <img
              src={`data:image/png;base64,${currentOverlay}`}
              className="w-full"
              alt={tab}
            />
          </div>
        </div>

      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricItem icon={TreePine}       label="Greenery"  value={`${analysis.metrics.green_space_percentage.toFixed(1)}%`} />
        <MetricItem icon={Building2}      label="Urban"     value={`${analysis.metrics.building_density.toFixed(1)}%`} />
        <MetricItem icon={Droplets}       label="Water"     value={`${analysis.metrics.water_bodies_percentage.toFixed(1)}%`} />
        <MetricItem icon={Navigation}     label="Transit"   value={analysis.metrics.transportation_network_score.toFixed(0)} />
        <MetricItem icon={Wind}           label="AQI"       value={analysis.metrics.air_quality_index.toFixed(0)} />
        <MetricItem icon={ThermometerSun} label="Heat Risk" value={analysis.metrics.heat_island_risk.toUpperCase()} />
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">AI Recommendations</h3>
        <div className="space-y-4">
          {analysis.recommendations.map((r, i) => (
            <div key={i} className="p-4 border rounded-lg hover:shadow transition">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">{r.title}</h4>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    r.priority === "high"   ? "bg-red-100 text-red-700" :
                    r.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {r.priority}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {r.impact}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mt-2 text-sm">{r.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function MetricItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col items-center group hover:border-emerald-500 transition-colors">
      <Icon className="w-5 h-5 mb-3 text-emerald-600" />
      <p className="text-[9px] font-black text-gray-400 uppercase text-center mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}