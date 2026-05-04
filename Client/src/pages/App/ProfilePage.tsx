import { useState, useEffect, useContext } from "react";
import {
  getUserProfile,
  updateUserProfile,
  getBacklog,
  getPreferences,
  getPriorities,
} from "../../services/api";
import EditProfileModal from "../../components/modals/EditProfileModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { getPlatformIcons } from "../../utils/platformIcons";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<any>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [prefs, setPrefs] = useState<any>(null);
  const [topGame, setTopGame] = useState<string | null>(null);
  const [exploreMode, setExploreMode] = useState(() => localStorage.getItem('swipe_explore') === 'true');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [confirmOnboarding, setConfirmOnboarding] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const fetchProfileData = async () => {
    if (!user) return;
    try {
      const userData = await getUserProfile(user.id);
      setUsuario(userData);
      const backlogData = await getBacklog(user.id);
      const listaCompletados = (Array.isArray(backlogData) ? backlogData : []).filter((juego: any) => {
        if (juego.isFinished === true) return true;
        if (juego.status === "COMPLETED") return true;
        return false;
      });
      setCompletedCount(listaCompletados.length);
      const prefsData = await getPreferences(user.id);
      if (!prefsData.error) setPrefs(prefsData);
      const prioritiesData = await getPriorities(user.id);
      if (Array.isArray(prioritiesData) && prioritiesData.length > 0) {
        setTopGame(prioritiesData[0].Game?.title ?? null);
      } else {
        setTopGame(null);
      }
    } catch (error) {
      console.error("Error al cargar datos del perfil:", error);
    }
  };

  const handleToggleExplore = () => {
    const next = !exploreMode;
    setExploreMode(next);
    localStorage.setItem('swipe_explore', String(next));
    sessionStorage.removeItem('swipe_deck_v3');
    sessionStorage.removeItem('swipe_index_v3');
    showToast(
      next
        ? 'Free mode on — you\'ll see all games in random order'
        : '"For You" mode on — recommendations based on your preferences',
    );
  };

  const handleClearDeck = () => {
    sessionStorage.removeItem('swipe_deck_v3');
    sessionStorage.removeItem('swipe_index_v3');
    navigate('/app/swipe');
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleSaveProfile = async (updatedData: any) => {
    if (!user) return;
    try {
      setGuardando(true);
      const savedUser = await updateUserProfile(user.id, updatedData);
      setUsuario(savedUser);
      setIsEditModalOpen(false);
      setGuardando(false);
      showToast("Profile updated");
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      setGuardando(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const joinYear = usuario?.createdAt
    ? new Date(usuario.createdAt).getFullYear()
    : "2025";

  const WORLD_META: Record<string, { label: string; icon: string }> = {
    fantasy:   { label: "Fantasy",    icon: "fa-solid fa-hat-wizard" },
    scifi:     { label: "Sci-Fi",     icon: "fa-solid fa-rocket" },
    horror:    { label: "Horror",     icon: "fa-solid fa-skull" },
    openworld: { label: "Open World", icon: "fa-solid fa-compass" },
    realism:   { label: "Realism",    icon: "fa-solid fa-trophy" },
  };
  const worldMeta = prefs?.worldType ? (WORLD_META[prefs.worldType] ?? null) : null;

  const userPlatforms: string[] = prefs?.platforms ?? [];
  const platformIcons = getPlatformIcons(userPlatforms.map(p => ({ name: p })));

  return (
    <div className="profile-page page-enter">
      <div className="profile-inner">
        {/* Cabecera */}
        <div className="profile-topbar">
          <h2 className="profile-title">My Profile</h2>
        </div>

        {/* Bento grid */}
        <div className="profile-bento">
          {/* Tarjeta izquierda: identidad */}
          <div className="glass-card profile-card-identity">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-ring" />
              <div className="profile-avatar">
                <img
                  src={
                    usuario?.avatarUrl ||
                    "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
                  }
                  alt="Avatar"
                  className="profile-avatar-img"
                />
              </div>
            </div>

            <span className="profile-username">{usuario?.username}</span>
            <span className="profile-handle">
              @{usuario?.username?.toLowerCase()}
            </span>

            <p className="profile-bio">
              {usuario?.bio ||
                "Hey, I'm a passionate gamer using FOMOKiller."}
            </p>

            <div className="profile-identity-tags">
              {prefs?.minYear && prefs?.maxYear && (
                <div className="profile-identity-tag">
                  <span className="profile-identity-label">Preferred era</span>
                  <span className="profile-identity-value">
                    {prefs.minYear} — {prefs.maxYear}
                  </span>
                </div>
              )}
              <div className="profile-identity-tag">
                <span className="profile-identity-label">Playing now</span>
                {topGame && topGame.length > 15 ? (
                  <span className="profile-identity-value profile-marquee-wrap">
                    <span className="profile-marquee-inner">
                      {topGame}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{topGame}
                    </span>
                  </span>
                ) : (
                  <span className="profile-identity-value">{topGame ?? "..."}</span>
                )}
              </div>
            </div>

            <button
              className="profile-edit-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              <i className="fa-solid fa-pencil" />{" "}
              {guardando ? "Saving..." : "Edit profile"}
            </button>
          </div>

          {/* Columna derecha */}
          <div className="profile-right-col">
            {/* Fila de stats */}
            <div className="profile-stats-row">
              <div className="glass-card profile-stat-card">
                <span className="stat-number">{completedCount}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="glass-card profile-stat-card">
                <span className="stat-number">{joinYear}</span>
                <span className="stat-label">Member since</span>
              </div>
            </div>

            {/* Plataformas */}
            <div className="glass-card profile-platforms-card">
              <span className="platforms-label">Platforms</span>
              <div className="platforms-icons">
                {platformIcons.length > 0 ? (
                  platformIcons.map((icon, i) => (
                    <i key={i} className={`${icon} platforms-icon`} />
                  ))
                ) : (
                  <span className="profile-pref-empty">
                    Complete the questionnaire
                  </span>
                )}
              </div>
            </div>

            {/* Tarjeta de recomendaciones */}
            {prefs && (
              <div className="glass-card profile-card-actions">
                <div className="profile-rec-header">
                  <i className="fa-solid fa-wand-magic-sparkles" />
                  <span>Recommendations</span>
                </div>
                <div className="profile-rec-row">
                  <div className="profile-rec-info">
                    <span className="profile-rec-label">Free mode</span>
                    <span className="profile-rec-sub">
                      Shows all games in random order. Disable it to see
                      recommendations based on your preferences.
                    </span>
                  </div>
                  <button
                    className={`profile-toggle ${exploreMode ? "active" : ""}`}
                    onClick={handleToggleExplore}
                  >
                    <span className="profile-toggle-knob" />
                  </button>
                </div>
                <div className="profile-rec-actions">
                  <button
                    className="profile-action-btn"
                    onClick={() => setConfirmOnboarding(true)}
                  >
                    <i className="fa-solid fa-sliders" />
                    <div className="profile-action-btn-text">
                      <span className="profile-action-btn-label">
                        Redo questionnaire
                      </span>
                      <span className="profile-action-btn-sub">
                        Change your preferences.
                      </span>
                    </div>
                  </button>
                  <button
                    className="profile-action-btn"
                    onClick={handleClearDeck}
                  >
                    <i className="fa-solid fa-shuffle" />
                    <div className="profile-action-btn-text">
                      <span className="profile-action-btn-label">
                        Reset deck
                      </span>
                      <span className="profile-action-btn-sub">
                        Discards the current deck and loads fresh games next
                        time you open Discover.
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Cerrar sesión */}
            <div className="glass-card profile-card-actions">
              <button
                className="btn-logout"
                onClick={() => setConfirmLogout(true)}
              >
                <i className="fa-solid fa-right-from-bracket" /> Log out
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /profile-inner */}

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={usuario}
        onSave={handleSaveProfile}
      />

      <ConfirmModal
        isOpen={confirmOnboarding}
        onClose={() => setConfirmOnboarding(false)}
        onConfirm={() => {
          setConfirmOnboarding(false);
          navigate("/onboarding");
        }}
        title="Redo the questionnaire?"
        description="Your current answers will be replaced with new ones. Recommendations will be based on the updated questionnaire. Your backlog games are untouched."
        confirmLabel="Yes, redo"
      />

      <ConfirmModal
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Log out?"
        confirmLabel="Log out"
        variant="danger"
      />

      {toastMsg && (
        <div className="toast-container">
          <div className="toast">{toastMsg}</div>
        </div>
      )}
    </div>
  );
}
