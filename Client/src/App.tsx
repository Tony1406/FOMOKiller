import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LandingLayout from './layouts/LandingLayout';
import SwipePage from './pages/App/SwipePage';
import ExplorePage from './pages/App/ExplorePage';
import BacklogPage from './pages/App/BacklogPage';
import Top5Page from './pages/App/Top5Page';
import ProfilePage from './pages/App/ProfilePage';
import ChatPage from './pages/App/ChatPage';
import Aurora from './components/Background/Aurora';
import HomePage from './pages/Landing/HomePage';
import MissionPage from './pages/Landing/MissionPage';
import DownloadPage from './pages/Landing/DownloadPage';
import ContactPage from './pages/Landing/ContactPage';
import LoginPage from './pages/Auth/login';
import RegisterPage from './pages/Auth/register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import './index.css';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing – comparte PS2 bg, nav y footer */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/mision" element={<MissionPage />} />

            <Route path="/descarga" element={<DownloadPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* App funcional - Protegida por Auth */}
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
              <Route path="chat" element={<ChatPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
