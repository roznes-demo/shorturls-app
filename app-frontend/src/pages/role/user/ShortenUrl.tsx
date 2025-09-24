// src/pages/role/user/UserShortenUrl.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_URL_BACKEND;

// --- API helpers --- //
async function storeFullUrl(fullUrl: string, token?: string) {
  const url = `${API_BASE}/api/role/user/urls/store-full-url`;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.post(url, { full_url: fullUrl }, { headers });
  return res.data;
}

async function checkExistFullURL(fullUrl: string) {
  const url = `${API_BASE}/api/role/user/urls/check-exist-full-url-by-full-url`;
  const res = await axios.post(url, { full_url: fullUrl });
  return res.data;
}

async function getShortUrlByCode(code: string) {
  const url = `${API_BASE}/api/role/user/urls/get-short-url-by-code`;
  const res = await axios.post(url, { code });
  return res.data;
}

// --- Component --- //
const UserShortenUrl: React.FC = () => {
  const navigate = useNavigate();
  const [fullUrl, setFullUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "Shorten URL";
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/user/login");
  }, [navigate]);

  async function handleShorten(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setShortUrl(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Please login first.");
      return navigate("/user/login");
    }

    try {
      setLoading(true);

      // 1. Check if already exists
      const resCheck = await checkExistFullURL(fullUrl);
      if (resCheck?.status === "success" && resCheck?.exists) {
        const row = resCheck.data?.[0] ?? null;
        const alreadyShort =
          row?.short_url || (row?.code ? `${API_BASE}/short-url/${row.code}` : null);

        if (alreadyShort) {
          setShortUrl(alreadyShort);
          setSuccessMsg("This URL already has a short link.");
          setCopied(false);
          return;
        }
      }

      // 2. Otherwise create new
      const resCreate = await storeFullUrl(fullUrl, token);
      if (resCreate?.status !== "success") {
        throw new Error(resCreate?.message || "Failed to create short url");
      }

      const createdRow = resCreate.data?.[0] ?? resCreate.data ?? null;
      const code: string | undefined = createdRow?.code;
      if (!code) throw new Error("Invalid response: missing code");

      // 3. Fetch the short URL by code (use 3rd API)
      const resGet = await getShortUrlByCode(code);
      const builtShort: string | undefined = resGet?.data?.[0]?.short_url;

      setShortUrl(builtShort || `${API_BASE}/short-url/${code}`);
      setSuccessMsg("Short URL created successfully!");
      setCopied(false);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">Shorten URL</h2>

        <form onSubmit={handleShorten} className="space-y-3">
          <div>
            <input
              type="url"
              placeholder="Enter full URL (https://...)"
              className="border p-2 rounded w-64"
              value={fullUrl}
              onChange={(e) => setFullUrl(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

          {shortUrl && (
            <div className="space-y-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 break-words block"
              >
                {shortUrl}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => navigate("/user/dashboard")}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserShortenUrl;
