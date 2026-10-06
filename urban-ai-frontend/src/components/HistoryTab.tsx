import { useEffect, useState } from "react";
import { fetchHistory } from "../lib/api";
import { AIAnalysisResult } from "../types";

interface Props {
  onSelect: (data: AIAnalysisResult) => void;
}

export default function HistoryTab({ onSelect }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory()
      .then(setRows)
      .catch((err) => console.error("Database connection error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleRowClick = (row: any) => {
    console.log("Opening record:", row.name || "Satellite Image");

    const parsedResult = row.result;

    if (!parsedResult) {
      console.error("No result data found for this record.");
      return;
    }

    const cleanData: AIAnalysisResult = {
      ...parsedResult,
      sustainability_score: row.score ?? parsedResult.sustainability_score ?? 0,
    };

    onSelect(cleanData);
  };

  if (loading) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-600 font-bold animate-pulse">Synchronizing Urban Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Analysis History</h2>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase">
          {rows.length} Records Found
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="p-20 text-center border-2 border-dashed rounded-3xl bg-white shadow-sm">
          <p className="text-gray-400 font-medium">No records found in the fresh database.</p>
          <p className="text-sm text-gray-300">New analyses will appear here after upload.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rows.map((r) => (
            <div
              key={r.id}
              onClick={() => handleRowClick(r)}
              className="p-6 bg-white border-2 border-transparent rounded-2xl cursor-pointer hover:border-emerald-500 hover:shadow-xl transition-all flex justify-between items-center group"
            >
              <div className="flex-1">
                <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors truncate max-w-md">
                  {r.name}
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    {new Date(r.date).toLocaleString()}
                  </p>
                  <span className="text-[9px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md font-black uppercase">
                    {r.land_use || "Processed"}
                  </span>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-[10px] font-black text-gray-300 uppercase mb-1 tracking-widest">Score</p>
                <p className="text-4xl font-black text-emerald-600 leading-none">
                  {(r.score ?? 0).toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}