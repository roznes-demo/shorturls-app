// src/pages/role/admin/Dashboard.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthAdmin from "../../../hooks/useAuthAdmin";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { admin, loading, error, logout } = useAuthAdmin();

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token") || error) {
      navigate("/admin/login");
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p>Loading admin...</p>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">Admin Dashboard</h2>

        <div className="space-y-1 mb-4">
          <p>
            <span className="font-semibold">Name:</span> {admin.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {admin.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> Admin
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => navigate("/admin/data/urls/list")}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            View All Shortened URLs
          </button>

          <button
            onClick={async () => {
              await logout();
              navigate("/admin/login");
            }}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
