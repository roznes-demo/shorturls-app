// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/home/Home'));

// user
const UserRegister = lazy(() => import('./pages/role/user/Register'));
const UserLogin = lazy(() => import('./pages/role/user/Login'));
const UserDashboard = lazy(() => import('./pages/role/user/Dashboard'));
const UserShortenUrl = lazy(() => import('./pages/role/user/ShortenUrl'));

// admin
const AdminRegister = lazy(() => import('./pages/role/admin/Register'));
const AdminLogin = lazy(() => import('./pages/role/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/role/admin/Dashboard'));
const AdminDataUrlsList = lazy(() => import('./pages/role/admin/data/urls/List'));
const AdminDataUrlsEdit = lazy(() => import('./pages/role/admin/data/urls/Edit'));

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Suspense fallback={<div className="text-gray-700 text-center p-10">Loading...</div>}>
          <Routes>
            {/* home */}
            <Route path="/" element={<Home />} />

            {/* user */}
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/shorten-url" element={<UserShortenUrl />} />

            {/* admin */}
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/data/urls/list" element={<AdminDataUrlsList />} />
            <Route path="/admin/data/urls/edit" element={<AdminDataUrlsEdit />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
