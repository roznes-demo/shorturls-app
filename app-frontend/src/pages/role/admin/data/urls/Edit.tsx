// src/pages/role/admin/data/urls/Edit.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_URL_BACKEND;

interface UrlItem {
  id: number;
  full_url: string;
  code: string;
  status: "active" | "inactive" | string;
  created_at: string;
  updated_at: string;
}

const Edit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const id = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("id");
  }, [location.search]);

  const [item, setItem] = useState<UrlItem | null>(null);
  const [fullUrl, setFullUrl] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Admin - Edit URL";
  }, []);

  useEffect(() => {
    if (!id) {
      setErrorMsg("Missing id");
      setLoading(false);
      return;
    }
    fetchOne(id);
    // ZzZ: eslint
  }, [id]);

  async function fetchOne(rowId: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await axios.get(`${API_BASE}/api/role/admin/urls/${rowId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.status === "success") {
        const row = (res.data.data?.[0] ?? res.data.data ?? null) as UrlItem | null;
        if (!row) throw new Error("Not found");
        setItem(row);
        setFullUrl(row.full_url);
        setCode(row.code);
        setStatus((row.status as "active" | "inactive") ?? "active");
      } else {
        throw new Error(res.data?.message || "Failed to fetch");
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const payload: Partial<UrlItem> = {
        full_url: fullUrl,
        code,
        status,
      };

      const res = await axios.put(`${API_BASE}/api/role/admin/urls/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.status === "success") {
        setSuccessMsg("Saved successfully");
        const row = (res.data.data?.[0] ?? res.data.data ?? null) as UrlItem | null;
        if (row) {
          setItem(row);
          setFullUrl(row.full_url);
          setCode(row.code);
          setStatus((row.status as "active" | "inactive") ?? "active");
        }
      } else {
        throw new Error(res.data?.message || "Save failed");
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div>
          <h2 className="text-xl font-bold mb-4">Edit URL</h2>
          <p className="text-red-600 mb-4">{errorMsg || "Not found"}</p>
          <button
            onClick={() => navigate("/admin/data/urls/list")}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Edit URL #{item.id}
        </h2>

        {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm mb-2">{successMsg}</p>}

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <input
              type="text"
              value={fullUrl}
              onChange={(e) => setFullUrl(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Full URL"
              required
            />
          </div>

          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Code"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Short URL: {`${API_BASE}/short-url/${code}`}
            </p>
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              className="border p-2 rounded w-full"
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/data/urls/list")}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
