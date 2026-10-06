import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import UploadTab from "./components/UploadTab";
import HistoryTab from "./components/HistoryTab";
import AnalysisResults from "./components/AnalysisResults";
import SettingsTab from "./components/SettingsTab";
import { AIAnalysisResult } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [latestResult, setLatestResult] = useState<AIAnalysisResult | null>(null);

  // This function is the "Glue" that connects History and Upload to the Results page
  const handleData = (data: any) => {
    console.log("App received data. Switching to results view...");
    
    // Standardize the data format from analyzer.py
    const cleanResult = data.results ? data.results : data;
    
    setLatestResult(cleanResult);
    setActiveTab("results"); // This FORCE switches the view
  };

  const renderContent = () => {
    // If we are in 'results' mode and have data, show the report
    if (activeTab === "results" && latestResult) {
      return <AnalysisResults analysis={latestResult} />;
    }

    // Otherwise, show the standard tabs
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "upload":    return <UploadTab onComplete={handleData} />;
      case "history":   return <HistoryTab onSelect={handleData} />;
      case "settings":  return <SettingsTab />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Make sure onTabChange is passed correctly */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          // If user clicks another tab, we can keep or clear the result
        }} 
        isOpen={true} 
        onClose={() => {}} 
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}