import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hcp_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('hcp_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify token on mount
    if (token) {
      authService.getProfile()
        .then(({ data }) => { setUser(data.user); updateStorage(token, data.user); })
        .catch(() => { clearAuth(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const updateStorage = (tkn, usr) => {
    localStorage.setItem('hcp_token', tkn);
    localStorage.setItem('hcp_user', JSON.stringify(usr));
  };

  const clearAuth = () => {
    localStorage.removeItem('hcp_token');
    localStorage.removeItem('hcp_user');
    setToken(null);
    setUser(null);
  };

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    setToken(data.token);
    setUser(data.user);
    updateStorage(data.token, data.user);
    return data;
  };

  const logout = () => clearAuth();

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('hcp_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
