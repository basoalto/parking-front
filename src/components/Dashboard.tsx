import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Car, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCarByPlate, redeemPrizeByPlate } from '../services/parking';
import { getPrizes, Prize } from '../services/prize';

interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  todayVehicles: number;
  totalVehicles: number;
  activeParkingLots: number;
  currentlyParked: number;
}

export function Dashboard() {
    const [showPrizes, setShowPrizes] = useState(false);
    const [prizes, setPrizes] = useState<Prize[]>([]);
    const [prizesLoading, setPrizesLoading] = useState(false);
    const [prizesError, setPrizesError] = useState('');
    const [redeemSuccess, setRedeemSuccess] = useState('');

    const handleShowPrizes = async () => {
      setPrizesLoading(true);
      setPrizesError('');
      setRedeemSuccess('');
      try {
        let data = await getPrizes();
        if (!Array.isArray(data)) data = [];
        setPrizes(data);
        setShowPrizes(true);
      } catch {
        setPrizesError('Error al cargar premios');
      }
      setPrizesLoading(false);
    };
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
  const [searchPlate, setSearchPlate] = useState('');
  const [carData, setCarData] = useState<any | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
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
        {/* ...existing code... */}
        <div className="bg-zinc-900/50 border-2 border-orange-500/30 rounded-lg p-6 relative overflow-hidden group hover:border-orange-500/60 transition-all">
          {/* ...existing code... */}
        </div>
        <div className="bg-zinc-900/50 border-2 border-yellow-500/30 rounded-lg p-6 relative overflow-hidden group hover:border-yellow-500/60 transition-all">
          {/* ...existing code... */}
        </div>
        <div className="bg-zinc-900/50 border-2 border-orange-500/30 rounded-lg p-6 relative overflow-hidden group hover:border-orange-500/60 transition-all">
          {/* ...existing code... */}
        </div>
        <div className="bg-zinc-900/50 border-2 border-yellow-500/30 rounded-lg p-6 relative overflow-hidden group hover:border-yellow-500/60 transition-all">
          {/* ...existing code... */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-black via-zinc-900 to-orange-900 border-2 border-orange-500/50 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-extrabold text-orange-400 mb-6 tracking-wide uppercase font-nfs">Buscador de autos por patente</h2>
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              value={searchPlate}
              onChange={e => setSearchPlate(e.target.value.toUpperCase())}
              placeholder="Ingresa la patente..."
              className="w-full px-6 py-3 rounded-lg bg-zinc-800 text-orange-400 font-bold text-xl border-2 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-nfs"
              style={{letterSpacing: '0.2em', fontFamily: 'Orbitron, sans-serif'}}
              maxLength={8}
            />
            <button
              onClick={async () => {
                setSearchLoading(true);
                setSearchError('');
                setCarData(null);
                try {
                  const data = await getCarByPlate(searchPlate);
                  if (!data) {
                    setSearchError('No se encontró un auto con esa patente');
                  } else {
                    setCarData(data);
                  }
                } catch (err) {
                  setSearchError('Error al buscar la patente');
                }
                setSearchLoading(false);
              }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-extrabold text-xl shadow-nfs hover:scale-105 transition-transform"
              style={{fontFamily: 'Orbitron, sans-serif'}}
              disabled={searchLoading || !searchPlate}
            >
              {searchLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {searchError && (
            <div className="text-red-500 font-bold mb-4 text-center">{searchError}</div>
          )}
          {carData && (
            <>
              <div
                className="mt-4 p-6 rounded-xl bg-black/60 border-2 border-orange-500 shadow-nfs flex flex-col items-center animate-fade-in cursor-pointer hover:bg-orange-950/80 transition"
                title="Ver premios disponibles"
                onClick={handleShowPrizes}
                style={{userSelect: 'none'}}
              >
                <div className="flex items-center gap-6 mb-4">
                  <Car className="w-16 h-16 text-orange-500 drop-shadow-nfs" />
                  <div>
                    <p className="text-3xl font-extrabold text-orange-400 tracking-widest" style={{fontFamily: 'Orbitron, sans-serif'}}>{carData.placa}</p>
                    <p className="text-lg text-gray-300 font-bold">{carData.marca} {carData.modelo}</p>
                    <p className="text-md text-orange-300">Color: <span className="font-bold">{carData.color}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Puntaje:</span>
                  <span className="text-2xl font-bold text-yellow-400">{carData.puntaje}</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <div className="mt-2 text-xs text-orange-300">Haz clic para canjear premios</div>
              </div>
              {showPrizes && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                  <div className="bg-zinc-900 border-2 border-orange-500 rounded-xl p-8 max-w-lg w-full relative animate-fade-in">
                    <button
                      className="absolute top-2 right-2 text-orange-400 hover:text-orange-200 text-2xl font-bold"
                      onClick={() => setShowPrizes(false)}
                      title="Cerrar"
                    >×</button>
                    <h3 className="text-2xl font-bold text-orange-400 mb-4 text-center">Premios disponibles</h3>
                    {prizesLoading ? (
                      <div className="text-orange-400 text-center">Cargando premios...</div>
                    ) : prizesError ? (
                      <div className="text-red-500 text-center">{prizesError}</div>
                    ) : (
                      <div className="space-y-4">
                        {prizes.length === 0 ? (
                          <div className="text-gray-400 text-center">No hay premios disponibles.</div>
                        ) : (
                          prizes.map(prize => (
                            <div key={prize.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-zinc-800/80 border border-orange-500/20 rounded-lg p-4">
                              <div>
                                <div className="text-lg font-bold text-orange-300">{prize.name}</div>
                                <div className="text-yellow-400 font-bold">{prize.pointsRequired} puntos</div>
                                <div className="text-gray-300 text-sm">{prize.description}</div>
                              </div>
                              <button
                                className={`px-4 py-2 rounded-lg font-bold text-black transition-all ${carData.puntaje >= prize.pointsRequired ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:scale-105' : 'bg-gray-500 cursor-not-allowed'}`}
                                disabled={carData.puntaje < prize.pointsRequired}
                                onClick={async () => {
                                  try {
                                    const updatedCar = await redeemPrizeByPlate(carData.placa, prize.id);
                                    setCarData(updatedCar);
                                    setRedeemSuccess(`¡Premio "${prize.name}" canjeado para ${updatedCar.placa}!`);
                                  } catch {
                                    setRedeemSuccess('Error al canjear el premio');
                                  }
                                }}
                              >
                                Canjear
                              </button>
                            </div>
                          ))
                        )}
                        {redeemSuccess && <div className="text-green-400 font-bold text-center mt-4">{redeemSuccess}</div>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="bg-zinc-900/50 border-2 border-yellow-500/30 rounded-lg p-6">
          {/* ...existing code... */}
        </div>
      </div>
    </div>
  );
}
