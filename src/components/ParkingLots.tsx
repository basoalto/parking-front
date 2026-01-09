import { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, DollarSign, Users, X, Pencil } from 'lucide-react';
import { getParkingLots, createParkingLot, updateParkingLot } from '../services/parking';

interface ParkingLotsProps {
  onSelectLot: (lot: any) => void;
}

export function ParkingLots({ onSelectLot }: ParkingLotsProps) {
  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editLot, setEditLot] = useState<any | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    getParkingLots().then(setParkingLots).catch(() => setParkingLots([]));
  }, []);

  // Generador simple de UUID
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const handleCreateLot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: any = {
      nombre: formData.get('name') as string,
      direccion: formData.get('address') as string,
      tarifaPorHora: parseFloat(formData.get('hourly_rate') as string),
    };
    const tarifaMinima = formData.get('minimum_rate');
    if (tarifaMinima && tarifaMinima !== '') {
      payload.tarifaMinima = parseFloat(tarifaMinima as string);
    }
    try {
      const newLot = await createParkingLot(payload);
      setParkingLots([newLot, ...parkingLots]);
      setShowCreateForm(false);
    } catch (err) {
      alert('Error al crear el estacionamiento');
    }
  };

  const handleEditLot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editLot) return;
    const formData = new FormData(e.currentTarget);
    const payload: any = {
      nombre: formData.get('name') as string,
      direccion: formData.get('address') as string,
      tarifaPorHora: parseFloat(formData.get('hourly_rate') as string),
    };
    const tarifaMinima = formData.get('minimum_rate');
    if (tarifaMinima && tarifaMinima !== '') {
      payload.tarifaMinima = parseFloat(tarifaMinima as string);
    }
    try {
      await updateParkingLot(editLot.id, payload);
      // Refrescar lista
      const lots = await getParkingLots();
      setParkingLots(lots);
      setShowEditForm(false);
      setEditLot(null);
    } catch (err) {
      alert('Error al editar el estacionamiento');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2">
            ESTACIONAMIENTOS
          </h1>
          <p className="text-gray-400 tracking-wide">Administra tus ubicaciones de estacionamiento</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white font-bold rounded-lg shadow-lg shadow-orange-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>CREAR ESTACIONAMIENTO</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border-2 border-orange-500/30 rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowCreateForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-orange-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-orange-400 mb-6 tracking-wide">CREAR NUEVO ESTACIONAMIENTO</h2>

            <form onSubmit={handleCreateLot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-400 mb-2">NOMBRE</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Centro Parking"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-400 mb-2">DIRECCIÓN</label>
                <input
                  type="text"
                  name="address"
                  required
                  className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Ej: Av. Principal 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-400 mb-2">TARIFA POR HORA</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    step="0.01"
                    required
                    defaultValue="5.00"
                    className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-400 mb-2">TARIFA MÍNIMA (opcional)</label>
                  <input
                    type="number"
                    name="minimum_rate"
                    step="0.01"
                    className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-all"
                    placeholder="10.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-400 mb-2">CAPACIDAD</label>
                  <input
                    type="number"
                    name="capacity"
                    required
                    defaultValue="20"
                    className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white font-bold rounded-lg shadow-lg transition-all"
              >
                CREAR
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editLot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border-2 border-orange-500/30 rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => { setShowEditForm(false); setEditLot(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-orange-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-orange-400 mb-6 tracking-wide">EDITAR ESTACIONAMIENTO</h2>
            <form onSubmit={handleEditLot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-400 mb-2">NOMBRE</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editLot.nombre}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Centro Parking"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-400 mb-2">DIRECCIÓN</label>
                <input
                  type="text"
                  name="address"
                  required
                  defaultValue={editLot.direccion}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Ej: Av. Principal 123"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-400 mb-2">TARIFA POR HORA</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    step="0.01"
                    required
                    defaultValue={editLot.tarifaPorHora}
                    className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-400 mb-2">TARIFA MÍNIMA (opcional)</label>
                  <input
                    type="number"
                    name="minimum_rate"
                    step="0.01"
                    defaultValue={editLot.tarifaMinima || ''}
                    className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-all"
                    placeholder="10.00"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white font-bold rounded-lg shadow-lg transition-all"
              >
                GUARDAR CAMBIOS
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkingLots.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">Aún no hay estacionamientos</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              Crea tu primer estacionamiento
            </button>
          </div>
        ) : (
          parkingLots.map((lot) => (
            <button
              key={lot.id}
              onClick={() => onSelectLot(lot)}
              className="bg-zinc-900/50 border-2 border-orange-500/30 rounded-lg p-6 text-left hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/20 transition-all group relative"
            >
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  className="p-2 rounded-full bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 hover:text-white transition-all"
                  onClick={e => { e.stopPropagation(); setEditLot(lot); setShowEditForm(true); }}
                  title="Editar"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-all">
                  <Building2 className="w-6 h-6 text-orange-500" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                {lot.nombre}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{lot.direccion}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span>${lot.tarifaPorHora}/hora</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-orange-500/20">
                <span className="text-orange-400 text-sm font-medium group-hover:text-orange-300 transition-colors">
                  VER DETALLES →
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
