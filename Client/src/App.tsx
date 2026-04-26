import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LandingLayout from './layouts/LandingLayout';
import SwipePage from './pages/App/SwipePage';
import ExplorePage from './pages/App/ExplorePage';
import BacklogPage from './pages/App/BacklogPage';
import Top5Page from './pages/App/Top5Page';
import ProfilePage from './pages/App/ProfilePage';
import Aurora from './components/reactbits/Aurora';
import HomePage from './pages/Landing/HomePage';
import DownloadPage from './pages/Landing/DownloadPage';
import LoginPage from './pages/Auth/login';
import RegisterPage from './pages/Auth/register';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminRoute from './auth/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminUsuarios from './pages/Admin/AdminUsuarios';
import AdminJuegos from './pages/Admin/AdminJuegos';
import AdminColecciones from './pages/Admin/AdminColecciones';
import OnboardingPage from './pages/Onboarding/OnboardingPage';
import NotFoundPage from './pages/Error/NotFoundPage';
import UnauthorizedPage from './pages/Error/UnauthorizedPage';

import './index.css';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<LandingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/descarga" element={<DownloadPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="/401" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/usuarios" replace />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="juegos" element={<AdminJuegos />} />
              <Route path="colecciones" element={<AdminColecciones />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={
              <>
                <div className="app-aurora-bg">
                  <Aurora
                    colorStops={['#0047AB', '#08cbee', '#0047AB']}
                    amplitude={1.0}
                    blend={0.5}
                    speed={1.5}
                  />
                </div>
                <AppLayout />
              </>
            }>
              <Route index element={<Navigate to="/app/swipe" replace />} />
              <Route path="swipe" element={<SwipePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="backlog" element={<BacklogPage />} />
              <Route path="top5" element={<Top5Page />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
