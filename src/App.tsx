import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ParkingLots } from './components/ParkingLots';
import { ParkingLotDetail } from './components/ParkingLotDetail';

function MainApp() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'parking-lots'>('dashboard');
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-500 text-2xl font-bold tracking-wider animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar currentView={currentView} onViewChange={(view) => {
        setCurrentView(view);
        setSelectedLot(null);
      }} />

      <main className="flex-1 overflow-auto">
        {selectedLot ? (
          <ParkingLotDetail
            lot={selectedLot}
            onBack={() => setSelectedLot(null)}
          />
        ) : currentView === 'dashboard' ? (
          <Dashboard />
        ) : (
          <ParkingLots onSelectLot={setSelectedLot} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
