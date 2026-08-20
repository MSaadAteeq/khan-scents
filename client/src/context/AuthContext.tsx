import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { adminLogin, adminMe, getAdminToken, setAdminToken } from '../lib/api';

interface AuthContextValue {
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  username: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }
    adminMe()
      .then((data) => setUsername(data.username))
      .catch(() => setAdminToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (user: string, password: string) => {
    const data = await adminLogin(user, password);
    setAdminToken(data.token);
    setUsername(data.username);
  };

  const logout = () => {
    setAdminToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
