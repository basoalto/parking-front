import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Gauge } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Solo login, no sign up
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-black to-yellow-600/10"></div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-pulse"></div>

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-zinc-900/90 backdrop-blur-xl border-2 border-orange-500/30 rounded-lg shadow-2xl shadow-orange-500/20 p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <Gauge className="w-16 h-16 text-orange-500" strokeWidth={2} />
              <div className="absolute inset-0 blur-xl bg-orange-500/50"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
            PARKING SYSTEM
          </h1>
          <p className="text-center text-gray-400 mb-8 text-sm tracking-wider">
            Ingrese con las credenciales:<br/>admin@lucas.com<br/>Clave: needforspeed
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-orange-400 mb-2 tracking-wide">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-400 mb-2 tracking-wide">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border-2 border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white font-bold rounded-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider"
            >
              {loading ? 'PROCESSING...' : 'LOGIN'}
            </button>
          </form>

          {/* No sign up option */}
        </div>

        <div className="mt-4 text-center text-xs text-gray-600">
          <p>Solo se permite el usuario admin@lucas.com</p>
        </div>
      </div>
    </div>
  );
}
