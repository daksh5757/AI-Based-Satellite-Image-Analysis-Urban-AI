import React, { useState } from "react";
import { analyzeImage } from "../lib/api";
import { AIAnalysisResult } from "../types";

interface UploadTabProps {
  onComplete: (data: AIAnalysisResult) => void;
}

export default function UploadTab({ onComplete }: UploadTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function onAnalyze() {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const response = await analyzeImage(file);
      onComplete(response.results);
    } catch (e: any) {
      setError(e?.message || "Failed to analyze");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Upload & Analyze</h2>

      <input type="file" accept="image/*" onChange={handleFile} />

      {preview && (
        <img
          src={preview}
          className="w-full max-h-96 object-cover rounded-xl shadow border"
        />
      )}

      <button
        onClick={onAnalyze}
        disabled={!file || loading}
        className="px-6 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700"
      >
        {loading ? "Analyzing…" : "Analyze"}
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
