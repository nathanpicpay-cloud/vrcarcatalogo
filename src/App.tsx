/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import React, { useEffect } from 'react';

// Placeholders for views
import CatalogLayout from './layouts/CatalogLayout';
import AdminLayout from './layouts/AdminLayout';
import CatalogHome from './pages/catalog/CatalogHome';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductsList from './pages/admin/products/ProductsList';
import ImportPDF from './pages/admin/imports/ImportPDF';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  // Enforce dark mode on body by default for the premium VR CAR feel
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.className = 'bg-black text-white antialiased selection:bg-red-600 selection:text-white';
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Catalog Routes */}
        <Route path="/" element={<CatalogLayout />}>
          <Route index element={<CatalogHome />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="imports" element={<ImportPDF />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
