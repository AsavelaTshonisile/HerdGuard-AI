import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ContactPage from './pages/public/ContactPage';

// Farmer & Shared Authenticated Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmsPage from './pages/farmer/FarmsPage';
import LivestockPage from './pages/farmer/LivestockPage';
import AnimalProfilePage from './pages/farmer/AnimalProfilePage';
import HealthReportsPage from './pages/farmer/HealthReportsPage';
import SubmitReportPage from './pages/farmer/SubmitReportPage';
import ReportDetailPage from './pages/farmer/ReportDetailPage';
import VaccinationsPage from './pages/farmer/VaccinationsPage';
import DiseaseMapPage from './pages/farmer/DiseaseMapPage';
import AIAssistantPage from './pages/farmer/AIAssistantPage';
import KnowledgeBasePage from './pages/farmer/KnowledgeBasePage';
import NotificationsPage from './pages/farmer/NotificationsPage';
import ProfilePage from './pages/farmer/ProfilePage';

// Professional Portal
import ProfessionalDashboard from './pages/professional/ProfessionalDashboard';

// Admin Portal
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminIncidentsPage from './pages/admin/AdminIncidentsPage';
import AdminKnowledgePage from './pages/admin/AdminKnowledgePage';
import AdminActivityLogsPage from './pages/admin/AdminActivityLogsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Authenticated routes (Farmers, Vets, Admins) */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Farmer Primary Views */}
            <Route path="/dashboard" element={<FarmerDashboard />} />
            <Route path="/farms" element={<FarmsPage />} />
            <Route path="/animals" element={<LivestockPage />} />
            <Route path="/animals/:id" element={<AnimalProfilePage />} />
            <Route path="/health-reports" element={<HealthReportsPage />} />
            <Route path="/health-reports/new" element={<SubmitReportPage />} />
            <Route path="/health-reports/:id" element={<ReportDetailPage />} />
            <Route path="/vaccinations" element={<VaccinationsPage />} />
            <Route path="/disease-map" element={<DiseaseMapPage />} />
            <Route path="/assistant" element={<AIAssistantPage />} />
            <Route path="/knowledge" element={<KnowledgeBasePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Professional Portal */}
            <Route
              path="/professional"
              element={
                <ProtectedRoute allowedRoles={['professional', 'admin']}>
                  <ProfessionalDashboard />
                </ProtectedRoute>
              }
            />

            {/* Administrator Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/incidents"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminIncidentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/knowledge"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminKnowledgePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/activity-logs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminActivityLogsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
