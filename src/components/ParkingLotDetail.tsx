import { useState, useEffect } from 'react';
  import { ArrowLeft, Car, Plus, Clock, DollarSign, LogOut as ExitIcon, X, Pencil } from 'lucide-react';
  import { assignCarToParkingLot, getActiveAssignments, getFinishedAssignments, checkoutAssignment, updateCar, assignPersonToCar } from '../services/parking';

  interface ParkingLotDetailProps {
    lot: any;
    onBack: () => void;
  }

  export function ParkingLotDetail({ lot, onBack }: ParkingLotDetailProps) {
    const [entries, setEntries] = useState<any[]>([]);
    const [completedEntries, setCompletedEntries] = useState<any[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editCar, setEditCar] = useState<any | null>(null);
    const [showEditCarForm, setShowEditCarForm] = useState(false);
    const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
    const [checkoutEntry, setCheckoutEntry] = useState<any | null>(null);
    const [showAssignRut, setShowAssignRut] = useState(false);
    const [selectedCar, setSelectedCar] = useState<any | null>(null);
    // Formatear RUT chileno en tiempo real
    const formatRut = (value: string) => {
      // Solo dígitos y k/K
      let clean = value.replace(/[^0-9kK]/g, '').toUpperCase();
      if (clean.length === 0) return '';
      // Separar cuerpo y dígito verificador
      let cuerpo = clean.slice(0, -1);
      let dv = clean.slice(-1);
      let formatted = '';
      let i = 0;
      for (let j = cuerpo.length; j > 0; j -= 3) {
        let start = Math.max(j - 3, 0);
        let part = cuerpo.substring(start, j);
        formatted = part + (i > 0 ? '.' : '') + formatted;
        i++;
      }
      if (cuerpo.length > 0) {
        formatted += '-' + dv;
      } else {
        formatted = dv;
      }
      return formatted;
    };

    // Handler para input de RUT
    const handleRutInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9kK]/g, '');
      e.target.value = formatRut(raw);
    };

    // Asignar rut a auto
    const handleAssignRut = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!selectedCar) return;
      const formData = new FormData(e.currentTarget);
      const rut = formData.get('rut') as string;
      try {
        await assignPersonToCar(selectedCar.carId || selectedCar.id, rut);
        setShowAssignRut(false);
        setSelectedCar(null);
        alert('Rut asignado correctamente');
      } catch (err) {
        alert('Error al asignar rut');
      }
    };

    useEffect(() => {
      if (lot?.id) {
        getActiveAssignments(lot.id)
          .then((data) => {
            setEntries(
              data.map((a) => ({
                id: a.id,
                parking_lot_id: a.parkingLotId,
                license_plate: a.carId, // Puedes reemplazar por placa si el backend lo devuelve
                vehicle_type: '', // No hay tipo en la respuesta, puedes omitir o ajustar
                entry_time: a.fechaEntrada,
                exit_time: a.fechaSalida,
                amount_paid: a.tarifa,
                total: a.total,
                placa: a.placa,
                carId: a.carId,
              }))
            );
          })
          .catch(() => setEntries([]));
        getFinishedAssignments(lot.id)
          .then((data) => {
            setCompletedEntries(
              data.map((a) => ({
                id: a.id,
                parking_lot_id: a.parkingLotId,
                license_plate: a.carId, // Puedes reemplazar por placa si el backend lo devuelve
                vehicle_type: '', // No hay tipo en la respuesta, puedes omitir o ajustar
                entry_time: a.fechaEntrada,
                exit_time: a.fechaSalida,
                amount_paid: a.tarifa,
                total: a.total,
                placa: a.placa,
              }))
            );
          })
          .catch(() => setCompletedEntries([]));
      }
    }, [lot]);

    // Forzar actualización de la UI cada 5 segundos para refrescar los minutos de ACTIVE VEHICLES
    useEffect(() => {
      const interval = setInterval(() => {
        setEntries((prev) => [...prev]); // Trigger re-render
      }, 5000);
      return () => clearInterval(interval);
    }, []);
    const openCheckoutConfirm = (entry: any) => {
      setCheckoutEntry(entry);
      setShowCheckoutConfirm(true);
    };

    // Generador simple de UUID
    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      try {
        const assignment = await assignCarToParkingLot(
          formData.get('license_plate') as string,
          lot.id
        );
        const newEntry = {
          id: assignment.id,
          parking_lot_id: assignment.parkingLotId,
          license_plate: formData.get('license_plate') as string,
          vehicle_type: formData.get('vehicle_type') as string,
          entry_time: assignment.fechaEntrada,
          exit_time: null,
          amount_paid: assignment.tarifa,
        };
        setEntries([newEntry, ...entries]);
        setShowAddForm(false);
      } catch (err) {
        alert('Error al asignar el auto al estacionamiento');
      }
    };
  const confirmCheckout = async () => {
    if (!checkoutEntry) return;

    const exitTime = new Date();
    try {
      const updated = await checkoutAssignment(
        checkoutEntry.id,
        exitTime.toISOString()
      );

      setEntries(entries.map(e =>
        e.id === checkoutEntry.id
          ? { ...e, exit_time: updated.fechaSalida, amount_paid: updated.tarifa, total: updated.total }
          : e
      ));

      const completed = await getFinishedAssignments(lot.id);
      setCompletedEntries(
        completed.map((a: any) => ({
          id: a.id,
          parking_lot_id: a.parkingLotId,
          license_plate: a.carId,
          vehicle_type: '',
          entry_time: a.fechaEntrada,
          exit_time: a.fechaSalida,
          amount_paid: a.tarifa,
          total: a.total,
          placa: a.placa,
        }))
      );

      setShowCheckoutConfirm(false);
      setCheckoutEntry(null);
    } catch (err) {
      alert('Error al hacer checkout del vehículo');
    }
  };

    const handleCheckout = async (entry: any) => {
      const exitTime = new Date();
      try {
        const updated = await checkoutAssignment(entry.id, exitTime.toISOString());
        setEntries(entries.map(e =>
          e.id === entry.id
            ? { ...e, exit_time: updated.fechaSalida, amount_paid: updated.tarifa, total: updated.total }
            : e
        ));
        // Refrescar lista de completados
        const completed = await getFinishedAssignments(lot.id);
        setCompletedEntries(
          completed.map((a: any) => ({
            id: a.id,
            parking_lot_id: a.parkingLotId,
            license_plate: a.carId,
            vehicle_type: '',
            entry_time: a.fechaEntrada,
            exit_time: a.fechaSalida,
            amount_paid: a.tarifa,
            total: a.total,
          }))
        );
      } catch (err) {
        alert('Error al hacer checkout del vehículo');
      }
    };

    const handleEditCar = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editCar) return;
      const formData = new FormData(e.currentTarget);
      const placa = formData.get('placa') as string;
      try {
        await updateCar(editCar.carId, { placa });
        // Refrescar lista de activos
        const data = await getActiveAssignments(lot.id);
        setEntries(
          data.map((a) => ({
            id: a.id,
            parking_lot_id: a.parkingLotId,
            license_plate: a.carId,
            vehicle_type: '',
            entry_time: a.fechaEntrada,
            exit_time: a.fechaSalida,
            amount_paid: a.tarifa,
            total: a.total,
            placa: a.placa,
            carId: a.carId,
          }))
        );
        setShowEditCarForm(false);
        setEditCar(null);
      } catch (err) {
        alert('Error al editar la placa');
      }
    };

    const activeEntries = entries.filter(e => !e.exit_time);
    // const completedEntries = entries.filter(e => e.exit_time); // (ya está arriba como estado)

    const formatDateTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const calculateDuration = (entryTime: string, exitTime?: string | null) => {
      const start = new Date(entryTime);
      const end = exitTime ? new Date(exitTime) : new Date();
      const hours = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));
      const minutes = Math.floor(((end.getTime() - start.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    };

    // Suma de los totales de autos actualmente estacionados
    const totalCurrentlyParked = activeEntries.reduce((acc, entry) => {
      const val = Number(entry.total);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    // Suma de los totales de autos completados
    const totalCompleted = completedEntries.reduce((acc, entry) => {
      const val = Number(entry.total);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    const isToday = (dateString: string) => {
      const date = new Date(dateString);
      const today = new Date();

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };
const completedToday = completedEntries
  .filter(entry => entry.exit_time && isToday(entry.exit_time))
  .sort((a, b) =>
    new Date(b.exit_time).getTime() - new Date(a.exit_time).getTime()
  );

    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2">
              {lot.name}
            </h1>
            <p className="text-gray-400 tracking-wide">{lot.address}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white font-bold rounded-lg shadow-lg shadow-orange-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>AGREGAR VEHÍCULO</span>
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border-2 border-orange-500/30 rounded-lg p-8 max-w-md w-full relative">
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-orange-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-orange-400 mb-6 tracking-wide">REGISTRAR VEHÍCULO</h2>

              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-400 mb-2">PATENTE</label>
                  <input
                    type="text"
                    name="license_plate"
                    required
                    className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white uppercase focus:outline-none focus:border-orange-500 transition-all"
                    placeholder="ABC-1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-400 mb-2">TIPO DE VEHÍCULO</label>
                  <select
                    name="vehicle_type"
                    required
                    className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-all"
                  >
                    <option value="car">Auto</option>
                    <option value="motorcycle">Moto</option>
                    <option value="truck">Camión</option>
                    <option value="suv">SUV</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white font-bold rounded-lg shadow-lg transition-all"
                >
                  REGISTRAR
                </button>
              </form>
            </div>
          </div>
        )}

        {showEditCarForm && editCar && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border-2 border-orange-500/30 rounded-lg p-8 max-w-md w-full relative">
              <button
                onClick={() => { setShowEditCarForm(false); setEditCar(null); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-orange-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-orange-400 mb-6 tracking-wide">EDITAR PATENTE</h2>
              <form onSubmit={handleEditCar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-400 mb-2">PATENTE</label>
                  <input
                    type="text"
                    name="placa"
                    required
                    defaultValue={editCar.placa}
                    className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white uppercase focus:outline-none focus:border-orange-500 transition-all"
                    placeholder="ABC-1234"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white font-bold rounded-lg shadow-lg transition-all"
                >
                  GUARDAR
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border-2 border-orange-500/30 rounded-lg p-6">
            <h3 className="text-sm text-gray-400 mb-2">TARIFA POR HORA</h3>
            <p className="text-3xl font-bold text-orange-400">${lot.hourly_rate}</p>
          </div>
          <div className="bg-zinc-900/50 border-2 border-yellow-500/30 rounded-lg p-6">
            <h3 className="text-sm text-gray-400 mb-2">CAPACIDAD</h3>
            <p className="text-3xl font-bold text-yellow-400">{lot.capacity}</p>
          </div>
          <div className="bg-zinc-900/50 border-2 border-green-500/30 rounded-lg p-6">
            <h3 className="text-sm text-gray-400 mb-2">Total</h3>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-orange-400 mb-4 tracking-wide">VEHÍCULOS ACTIVOS</h2>
            {activeEntries.length === 0 ? (
              <div className="bg-zinc-900/50 border-2 border-orange-500/20 rounded-lg p-8 text-center">
                <Car className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No hay vehículos actualmente estacionados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-zinc-900/50 border-2 border-orange-500/30 rounded-lg p-5 hover:border-orange-500/60 transition-all relative"
                  >
                    <div className="flex items-center mb-2">
                      <button
                        className="px-3 py-1 rounded bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 hover:text-white transition-all border border-orange-400 text-xs font-bold"
                        onClick={e => { e.stopPropagation(); setSelectedCar(entry); setShowAssignRut(true); }}
                        title="Asignar RUT"
                      >
                        Asignar RUT
                      </button>
                    </div>
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 hover:text-white transition-all"
                      onClick={e => { e.stopPropagation(); setEditCar(entry); setShowEditCarForm(true); }}
                      title="Editar patente"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-500/10 rounded">
                          <Car className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">{entry.placa}</p>
                          <p className="text-xs text-gray-400 uppercase">{entry.vehicle_type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDateTime(entry.entry_time)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-yellow-400">
                        <Clock className="w-4 h-4" />
                        <span>{calculateDuration(entry.entry_time)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => openCheckoutConfirm(entry)}
                      className="w-full flex items-center justify-center space-x-2 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all"
                    >
                      <ExitIcon className="w-4 h-4" />
                      <span>SALIDA</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
  {showCheckoutConfirm && checkoutEntry && (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border-2 border-green-500/30 rounded-lg p-6 max-w-md w-full relative">

        <button
          onClick={() => { setShowCheckoutConfirm(false); setCheckoutEntry(null); }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-green-400 mb-4">
          Confirmar salida
        </h2>

        <p className="text-gray-300 mb-4">
          ¿Estás seguro que deseas dar salida a este vehículo?
        </p>

        <div className="bg-black/40 rounded-lg p-4 mb-4">
          <p className="text-white font-bold text-lg">
            {checkoutEntry.placa}
          </p>
          <p className="text-sm text-gray-400">
            Entrada: {formatDateTime(checkoutEntry.entry_time)}
          </p>
          <p className="text-sm text-yellow-400">
            Duración: {calculateDuration(checkoutEntry.entry_time)}
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => { setShowCheckoutConfirm(false); setCheckoutEntry(null); }}
            className="w-1/2 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
          >
            Cancelar
          </button>

          <button
            onClick={confirmCheckout}
            className="w-1/2 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )}

          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 tracking-wide">COMPLETADOS</h2>
            {completedToday.length === 0 ? (
              <div className="bg-zinc-900/50 border-2 border-yellow-500/20 rounded-lg p-8 text-center">
                <p className="text-gray-400">No hay registros completados aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-end text-yellow-400 font-bold text-lg mb-2">

                </div>
                {completedToday.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-zinc-900/50 border-2 border-yellow-500/20 rounded-lg p-4 flex flex-col hover:border-yellow-500/40 transition-all"
                  >
                    <div className="flex items-center mb-2">
                      <button
                        className="px-3 py-1 rounded bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-500 hover:text-white transition-all border border-yellow-400 text-xs font-bold"
                        onClick={e => { e.stopPropagation(); setSelectedCar(entry); setShowAssignRut(true); }}
                        title="Asignar RUT"
                      >
                        Asignar RUT
                      </button>
                    </div>

      {/* Modal para asignar rut */}
      {showAssignRut && selectedCar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border-2 border-orange-500/30 rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => { setShowAssignRut(false); setSelectedCar(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Asignar RUT a vehículo</h2>
            <form onSubmit={handleAssignRut} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Patente</label>
                <input type="text" value={selectedCar.placa} disabled className="w-full bg-zinc-800 text-white rounded p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">RUT de la persona a cargo</label>
                <input
                  name="rut"
                  type="text"
                  required
                  placeholder="Ej: 12.345.678-9"
                  className="w-full bg-zinc-800 text-white rounded p-2"
                  maxLength={12}
                  autoComplete="off"
                  onInput={handleRutInput}
                  inputMode="numeric"
                  pattern="[0-9.\-kK]+"
                />
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setShowAssignRut(false); setSelectedCar(null); }}
                  className="w-1/2 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all"
                >
                  Asignar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-yellow-500/10 rounded">
                        <Car className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{entry.placa}</p>
                        <p className="text-xs text-gray-400">
                          {formatDateTime(entry.entry_time)} - {entry.exit_time && formatDateTime(entry.exit_time)}
                        </p>
                        <p className="text-xs text-yellow-400">{calculateDuration(entry.entry_time, entry.exit_time)}</p>
                        <p className="text-xs text-green-400">Total: {
                          !isNaN(Number(entry.total)) ? `$${Number(entry.total).toFixed(0)}` : '-'
                        }</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-green-400 font-bold text-lg">
                        <DollarSign className="w-5 h-5" />
                        <span>{!isNaN(Number(entry.total)) ? Number(entry.total).toFixed(0) : '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }