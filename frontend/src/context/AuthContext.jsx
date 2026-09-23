import axios from "../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

const { createContext } = require("react");

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('user-token');
    if (!token) { setLoading(false); return; }

    axios.get('/get-user-profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);