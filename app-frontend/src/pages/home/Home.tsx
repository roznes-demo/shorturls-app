// src/pages/home/Home.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="space-y-8">
        {/* Section 1 - User */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">User</h2>
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={() => navigate("/user/register")}
              className="w-64 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              User Register
            </button>
            <button
              onClick={() => navigate("/user/login")}
              className="w-64 bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              User Login
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-300" />

        {/* Section 2 - Admin */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">Admin</h2>
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={() => navigate("/admin/register")}
              className="w-64 bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
            >
              Admin Register
            </button>
            <button
              onClick={() => navigate("/admin/login")}
              className="w-64 bg-red-600 text-white p-2 rounded hover:bg-red-700"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
