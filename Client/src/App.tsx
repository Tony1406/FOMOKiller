import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SwipePage from './pages/SwipePage';
import ExplorePage from './pages/ExplorePage';
import BacklogPage from './pages/BacklogPage';
import Top5Page from './pages/Top5Page';
import ProfilePage from './pages/ProfilePage';
import { ChatPage, FriendsPage } from './pages/ComingSoonPage';
import Aurora from './components/Aurora/Aurora';
import logoSimple from './assets/Logo_simple.png';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      {/* ── Aurora Background ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}>
        <Aurora
          colorStops={['#0047AB', '#071C3A', '#0047AB']}
          amplitude={0.7}
          blend={0.8}
          speed={0.4}
        />
      </div>

      <div className="app-layout">
        <Navbar />

        <div className="app-main">
          {/* ── Top Header (Mobile Only via CSS) ── */}
          <header className="app-header">
            <div className="app-logo">
              <img src={logoSimple} alt="FOMOKiller" className="app-logo-img" />
              <span className="app-logo-text">FOMOKiller</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>SlayerX</span>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--cobalt), var(--cyan))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}>🎮</div>
            </div>
          </header>

          {/* ── Page Content ── */}
          <main className="app-content">
            <Routes>
              <Route path="/" element={<SwipePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/backlog" element={<BacklogPage />} />
              <Route path="/top5" element={<Top5Page />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/friends" element={<FriendsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
