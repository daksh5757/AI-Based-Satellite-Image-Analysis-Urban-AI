import { useEffect, useState } from "react";
import { fetchStats } from "../lib/api";
import { TrendingUp, TreePine, Building2, Activity } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-500">Loading Dashboard Data...</div>;
  if (!stats) return <div className="p-10 text-center text-red-500">Could not connect to backend.</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Sustainability Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard label="Total Analyses" value={stats.total} icon={Activity} color="bg-blue-500" />
        <DashboardCard label="Avg Sustainability" value={`${stats.avg_score}%`} icon={TrendingUp} color="bg-emerald-500" />
        <DashboardCard label="Avg Green Space" value={`${stats.avg_green?.toFixed(1)}%`} icon={TreePine} color="bg-green-500" />
        <DashboardCard label="Avg Urban Density" value={`${stats.avg_urban?.toFixed(1)}%`} icon={Building2} color="bg-orange-500" />
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Recent Urban Insights</h3>
        <div className="space-y-4">
          {stats.recent?.map((r: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div>
                <p className="font-bold text-gray-800">{r.name}</p>
                <p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</p>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">{r.land_use}</span>
              </div>
              <div className="text-2xl font-black text-emerald-600">{r.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center space-x-4">
      <div className={`${color} p-3 rounded-xl text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}