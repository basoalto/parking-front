import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Car, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  todayVehicles: number;
  totalVehicles: number;
  activeParkingLots: number;
  currentlyParked: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    todayRevenue: 0,
    todayVehicles: 0,
    totalVehicles: 0,
    activeParkingLots: 0,
    currentlyParked: 0,
  });
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    // Supabase imports and usage removed. Replace with backend or local state logic as needed.

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-orange-500 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2">
          DASHBOARD
        </h1>
        <p className="text-gray-400 tracking-wide">Real-time parking metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 border-2 border-orange-500/30 rounded-lg p-6 relative overflow-hidden group hover:border-orange-500/60 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              ${stats.todayRevenue.toFixed(2)}
            </h3>
            <p className="text-sm text-gray-400 tracking-wide">TODAY'S REVENUE</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border-2 border-yellow-500/30 rounded-lg p-6 relative overflow-hidden group hover:border-yellow-500/60 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Car className="w-6 h-6 text-yellow-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.todayVehicles}
            </h3>
            <p className="text-sm text-gray-400 tracking-wide">TODAY'S VEHICLES</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border-2 border-orange-500/30 rounded-lg p-6 relative overflow-hidden group hover:border-orange-500/60 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              ${stats.totalRevenue.toFixed(2)}
            </h3>
            <p className="text-sm text-gray-400 tracking-wide">TOTAL REVENUE</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border-2 border-yellow-500/30 rounded-lg p-6 relative overflow-hidden group hover:border-yellow-500/60 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Building2 className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.activeParkingLots}
            </h3>
            <p className="text-sm text-gray-400 tracking-wide">ACTIVE LOTS</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border-2 border-orange-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4 tracking-wide">RECENT ACTIVITY</h2>
          <div className="space-y-3">
            {recentEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-orange-500/10 hover:border-orange-500/30 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/10 rounded">
                      <Car className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{entry.license_plate}</p>
                      <p className="text-xs text-gray-400">{entry.parking_lot_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${entry.exit_time ? 'text-green-400' : 'text-yellow-400'}`}>
                      {entry.exit_time ? 'EXITED' : 'PARKED'}
                    </p>
                    {entry.amount_paid && (
                      <p className="text-xs text-gray-400">${entry.amount_paid.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-zinc-900/50 border-2 border-yellow-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4 tracking-wide">QUICK STATS</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-yellow-500/10">
              <span className="text-gray-300">Currently Parked</span>
              <span className="text-2xl font-bold text-yellow-400">{stats.currentlyParked}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-orange-500/10">
              <span className="text-gray-300">Total Vehicles</span>
              <span className="text-2xl font-bold text-orange-400">{stats.totalVehicles}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-green-500/10">
              <span className="text-gray-300">Avg Revenue/Vehicle</span>
              <span className="text-2xl font-bold text-green-400">
                ${stats.totalVehicles > 0 ? (stats.totalRevenue / stats.totalVehicles).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
