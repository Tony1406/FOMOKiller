import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SwipePage from './pages/SwipePage';
import ExplorePage from './pages/ExplorePage';
import BacklogPage from './pages/BacklogPage';
import Top5Page from './pages/Top5Page';
import ProfilePage from './pages/ProfilePage';
import { ChatPage, FriendsPage } from './pages/ComingSoonPage';
import Aurora from './components/Aurora/Aurora';
import Header from './components/Header';
import './index.css';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-aurora-bg">
        <Aurora
          colorStops={['#0047AB', '#071C3A', '#0047AB']}
          amplitude={0.9}
          blend={0.5}
          speed={1.5}
        />
      </div>

      <div className="app-layout">
        <Navbar />

        <div className="app-main">
          {/* solo para moviles */}
          <Header />

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
