import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { getPrizes, createPrize, Prize } from '../services/prize';

export function PrizeManager() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', pointsRequired: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPrizes();
  }, []);

  const loadPrizes = async () => {
    setLoading(true);
    try {
      let data = await getPrizes();
      if (!Array.isArray(data)) data = [];
      setPrizes(data);
    } catch {
      setError('Error al cargar premios');
      setPrizes([]);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const prize = await createPrize({
        name: form.name,
        pointsRequired: Number(form.pointsRequired),
        description: form.description,
      });
      setSuccess('Premio creado exitosamente');
      setForm({ name: '', pointsRequired: '', description: '' });
      setPrizes([prize, ...prizes]);
    } catch {
      setError('Error al crear premio');
    }
    setSubmitting(false);
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold text-orange-400 mb-6">Mantenedor de Premios</h2>
      <form onSubmit={handleSubmit} className="bg-zinc-900/50 border-2 border-orange-500/30 rounded-lg p-6 space-y-4 max-w-xl mx-auto">
        <div className="flex flex-col gap-2">
          <label className="text-orange-300 font-bold">Nombre del premio</label>
          <input name="name" value={form.name} onChange={handleChange} required className="px-4 py-2 rounded bg-zinc-800 text-orange-200 border border-orange-500 focus:outline-none" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-orange-300 font-bold">Puntos requeridos</label>
          <input name="pointsRequired" value={form.pointsRequired} onChange={handleChange} required type="number" min="1" className="px-4 py-2 rounded bg-zinc-800 text-orange-200 border border-orange-500 focus:outline-none" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-orange-300 font-bold">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} required className="px-4 py-2 rounded bg-zinc-800 text-orange-200 border border-orange-500 focus:outline-none" />
        </div>
        {error && <div className="text-red-500 font-bold">{error}</div>}
        {success && <div className="text-green-500 font-bold">{success}</div>}
        <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-extrabold text-lg shadow-nfs hover:scale-105 transition-transform">
          <PlusCircle className="w-5 h-5" /> Crear Premio
        </button>
      </form>
      <div className="mt-10">
        <h3 className="text-xl font-bold text-orange-300 mb-4">Premios existentes</h3>
        {loading ? (
          <div className="text-orange-400">Cargando premios...</div>
        ) : prizes.length === 0 ? (
          <div className="text-gray-400">No hay premios registrados.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prizes.map(prize => (
              <div key={prize.id} className="bg-zinc-900/70 border-2 border-orange-500/20 rounded-lg p-6 shadow-nfs flex flex-col gap-2">
                <div className="text-2xl font-bold text-orange-400">{prize.name}</div>
                <div className="text-yellow-400 font-bold">{prize.pointsRequired} puntos</div>
                <div className="text-gray-300">{prize.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
