// src/pages/role/user/Dashboard.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../../../hooks/useAuthUser";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, error, logout } = useAuthUser();

  useEffect(() => {
    if (!localStorage.getItem("token") || error) {
      navigate("/user/login");
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Loading user...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">User Dashboard</h2>

        <div className="space-y-1 mb-4">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Role:</span> User</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => navigate("/user/shorten-url")}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Go to Shorten URL
          </button>

          <button
            onClick={async () => {
              await logout();
              navigate("/user/login");
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

export default UserDashboard;
