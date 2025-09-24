import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_URL_BACKEND;

export interface AuthAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export function useAuthAdmin() {
  const [admin, setAdmin] = useState<AuthAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const refresh = useCallback(async () => {
    if (!token) {
      setAdmin(null);
      setError("No token");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.role === "0") {
        setAdmin(res.data);
      } else {
        setError("Not an admin");
        setAdmin(null);
      }
    } catch (err: any) {
      setAdmin(null);
      setError(err.response?.data?.message || "Unauthorized");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await axios.post(
          `${API_BASE}/api/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("expires_at");
      setAdmin(null);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { admin, loading, error, refresh, logout };
}

export default useAuthAdmin;
