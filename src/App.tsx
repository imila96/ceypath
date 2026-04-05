import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PackageListPage from './pages/PackageListPage';
import PackageDetailPage from './pages/PackageDetailPage';
import CustomizePage from './pages/CustomizePage';
import VehiclesPage from './pages/VehiclesPage';
import DestinationPage from './pages/DestinationPage';
import HotelsPage from './pages/HotelsPage';
import HotelPage from './pages/HotelPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import RequireAdmin from './pages/admin/RequireAdmin';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPackagesPage from './pages/admin/AdminPackagesPage';
import AdminDestinationsPage from './pages/admin/AdminDestinationsPage';
import AdminVehiclesPage from './pages/admin/AdminVehiclesPage';
import AdminMediaPage from './pages/admin/AdminMediaPage';
import AdminHotelsPage from './pages/admin/AdminHotelsPage';
import AdminActivitiesPage from './pages/admin/AdminActivitiesPage';
import AdminTestimonialsPage from './pages/admin/AdminTestimonialsPage';
import CatalogRemoteSync from './components/CatalogRemoteSync';

export default function App() {
  return (
    <BrowserRouter>
      <CatalogRemoteSync />
      <AdminAuthProvider>
        <CurrencyProvider>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<RequireAdmin />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="packages" element={<AdminPackagesPage />} />
              <Route path="destinations" element={<AdminDestinationsPage />} />
              <Route path="vehicles" element={<AdminVehiclesPage />} />
              <Route path="hotels" element={<AdminHotelsPage />} />
              <Route path="activities" element={<AdminActivitiesPage />} />
              <Route path="testimonials" element={<AdminTestimonialsPage />} />
              <Route path="media" element={<AdminMediaPage />} />
            </Route>

            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="packages" element={<PackageListPage />} />
              <Route path="packages/:id" element={<PackageDetailPage />} />
              <Route path="customize" element={<CustomizePage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="destinations/:slug" element={<DestinationPage />} />
              <Route path="hotels" element={<HotelsPage />} />
              <Route path="hotels/:id" element={<HotelPage />} />
              <Route path="confirmation" element={<ConfirmationPage />} />
              {/* Redirect placeholder routes to home */}
              <Route path="about" element={<Navigate to="/" replace />} />
              <Route path="contact" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </CurrencyProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
