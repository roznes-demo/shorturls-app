// src/pages/role/admin/data/urls/List.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_URL_BACKEND;

interface UrlItem {
  id: number;
  full_url: string;
  code: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const List: React.FC = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    document.title = "Admin - URLs";
    fetchData(page);
    // ZzZ: eslint
  }, [page]);

  async function fetchData(pageNum: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await axios.get(`${API_BASE}/api/role/admin/urls`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNum, limit },
      });

      if (res.data?.status === "success") {
        setUrls(res.data.data || []);
        setTotal(res.data.total || 0);
      } else {
        setErrorMsg(res.data?.message || "Failed to fetch URLs");
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">All Shortened URLs</h2>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
          >
            Back to Dashboard
          </button>
        </div>

        {errorMsg && <p className="text-red-600 mb-3">{errorMsg}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Full URL</th>
                    <th className="p-2 border">Code</th>
                    <th className="p-2 border">Short URL</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Created At</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.length > 0 ? (
                    urls.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{u.id}</td>
                        <td className="p-2 border break-all">{u.full_url}</td>
                        <td className="p-2 border">{u.code}</td>
                        <td className="p-2 border">
                          <a
                            href={`${API_BASE}/short-url/${u.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-all"
                          >
                            {`${API_BASE}/short-url/${u.code}`}
                          </a>
                        </td>
                        <td className="p-2 border">{u.status}</td>
                        <td className="p-2 border">{u.created_at}</td>
                        <td className="p-2 border">
                          <button
                            onClick={() => navigate(`/admin/data/urls/edit?id=${u.id}`)}
                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                disabled={page >= totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default List;
