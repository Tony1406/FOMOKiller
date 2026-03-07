import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LandingLayout from './layouts/LandingLayout';
import SwipePage from './pages/App/SwipePage';
import ExplorePage from './pages/App/ExplorePage';
import BacklogPage from './pages/App/BacklogPage';
import Top5Page from './pages/App/Top5Page';
import ProfilePage from './pages/App/ProfilePage';
import ChatPage from './pages/App/ChatPage';
import Aurora from './components/Aurora/Aurora';
import HomePage from './pages/Landing/Home';
import MissionPage from './pages/Landing/Mission';

import DownloadPage from './pages/Landing/Download';
import ContactPage from './pages/Landing/Contact';

import './index.css';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing – comparte PS2 bg, nav y footer */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mision" element={<MissionPage />} />

          <Route path="/descarga" element={<DownloadPage />} />
          <Route path="/contacto" element={<ContactPage />} />

        </Route>

        {/* App funcional */}
        <Route path="/app" element={
          <>
            <div className="app-aurora-bg">
              <Aurora
                colorStops={['#0047AB', '#071C3A', '#0047AB']}
                amplitude={0.9}
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
      </Routes>
    </BrowserRouter>
  );
}
