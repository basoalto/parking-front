import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    if (email === 'admin@lucas.com' && password === 'needforspeed') {
      setUser({ email });
      return { error: null };
    }
    return { error: { message: 'Credenciales incorrectas' } };
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
