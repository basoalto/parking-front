import { LayoutDashboard, Building2, LogOut, Gauge } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentView: 'dashboard' | 'parking-lots' | 'mantenedores';
  onViewChange: (view: 'dashboard' | 'parking-lots' | 'mantenedores') => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { signOut } = useAuth();

  return (
    <div className="w-64 bg-zinc-900 border-r-2 border-orange-500/30 flex flex-col">
      <div className="p-6 border-b border-orange-500/30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Gauge className="w-10 h-10 text-orange-500" strokeWidth={2} />
            <div className="absolute inset-0 blur-lg bg-orange-500/30"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              PARKING MISSION
            </h2>
            <p className="text-xs text-gray-500 tracking-wider">CONTROL SYSTEM</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
            currentView === 'dashboard'
              ? 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-l-4 border-orange-500 text-orange-400 shadow-lg shadow-orange-500/10'
              : 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/5'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium tracking-wide">DASHBOARD</span>
        </button>

        <button
          onClick={() => onViewChange('parking-lots')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
            currentView === 'parking-lots'
              ? 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-l-4 border-orange-500 text-orange-400 shadow-lg shadow-orange-500/10'
              : 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/5'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="font-medium tracking-wide">PARKING LOTS</span>
        </button>

        <button
          onClick={() => onViewChange('mantenedores')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
            currentView === 'mantenedores'
              ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border-l-4 border-yellow-400 text-yellow-300 shadow-lg shadow-yellow-400/10'
              : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/5'
          }`}
        >
          <span className="font-medium tracking-wide">MANTENEDORES</span>
        </button>
      </nav>

      <div className="p-4 border-t border-orange-500/30">
        <button
          onClick={() => { signOut(); }}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium tracking-wide">LOGOUT</span>
        </button>
      </div>
    </div>
  );
}
