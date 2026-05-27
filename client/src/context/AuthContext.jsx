import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CNY: '¥',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const changeCurrency = (code) => {
    if (currencySymbols[code]) {
      setCurrency(code);
      localStorage.setItem('currency', code);
    }
  };

  const currencySymbol = currencySymbols[currency] || '$';

  const formatCurrency = (v) => {
    const num = Number(v) || 0;
    return `${currencySymbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, currency, changeCurrency, currencySymbol, formatCurrency, currencySymbols }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
