import { useState, useEffect, useContext } from "react";
import {
  getUserProfile,
  getBacklog,
  updateUserProfile,
  getPreferences,
  getPriorities,
} from "../../services/api";
import EditProfileModal from "../../components/modals/EditProfileModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
      const listaCompletados = backlogData.filter((juego: any) => {
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
        ? 'Modo libre activado — verás todos los juegos en orden aleatorio'
        : 'Modo "Para ti" activado — recomendaciones basadas en tus preferencias',
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
      showToast("Datos actualizados");
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
    fantasy:   { label: "Fantasía",        icon: "fa-solid fa-hat-wizard" },
    scifi:     { label: "Ciencia Ficción", icon: "fa-solid fa-rocket" },
    horror:    { label: "Terror",          icon: "fa-solid fa-skull" },
    openworld: { label: "Mundo Abierto",   icon: "fa-solid fa-compass" },
    realism:   { label: "Realismo",        icon: "fa-solid fa-trophy" },
  };
  const worldMeta = prefs?.worldType ? (WORLD_META[prefs.worldType] ?? null) : null;

  const PLATFORM_ICONS: Record<string, { icon: string; title: string }> = {
    "PC":              { icon: "fa-brands fa-steam",      title: "PC / Steam" },
    "PlayStation 5":   { icon: "fa-brands fa-playstation", title: "PlayStation 5" },
    "PlayStation 4":   { icon: "fa-brands fa-playstation", title: "PlayStation 4" },
    "Xbox Series S/X": { icon: "fa-brands fa-xbox",        title: "Xbox" },
    "Nintendo Switch": { icon: "fa-solid fa-gamepad",      title: "Nintendo Switch" },
    "iOS":             { icon: "fa-brands fa-apple",       title: "iOS" },
    "Android":         { icon: "fa-brands fa-android",     title: "Android" },
  };
  const userPlatforms: string[] = prefs?.platforms ?? [];

  return (
    <div className="profile-page page-enter">
      <div className="profile-inner">
        {/* Cabecera */}
        <div className="profile-topbar">
          <h2 className="profile-title">Mi Perfil</h2>
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
                "Hola, soy un gamer apasionado usando FOMOKiller."}
            </p>

            <div className="profile-identity-tags">
              {worldMeta && (
                <div className="profile-identity-tag">
                  <span className="profile-identity-label">
                    Género favorito
                  </span>
                  <span className="profile-identity-value">
                    {worldMeta.label}
                  </span>
                </div>
              )}
              {prefs?.minYear && prefs?.maxYear && (
                <div className="profile-identity-tag">
                  <span className="profile-identity-label">Época preferida</span>
                  <span className="profile-identity-value">
                    {prefs.minYear} — {prefs.maxYear}
                  </span>
                </div>
              )}
              <div className="profile-identity-tag">
                <span className="profile-identity-label">Jugando ahora</span>
                <span className="profile-identity-value">
                  {topGame ?? "..."}
                </span>
              </div>
            </div>

            <button
              className="profile-edit-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              <i className="fa-solid fa-pencil" />{" "}
              {guardando ? "Guardando..." : "Editar perfil"}
            </button>
          </div>

          {/* Columna derecha */}
          <div className="profile-right-col">
            {/* Fila de stats */}
            <div className="profile-stats-row">
              <div className="glass-card profile-stat-card">
                <span className="stat-number">{completedCount}</span>
                <span className="stat-label">Completados</span>
              </div>
              <div className="glass-card profile-stat-card">
                <span className="stat-number">{joinYear}</span>
                <span className="stat-label">Miembro desde</span>
              </div>
            </div>

            {/* Plataformas */}
            <div className="glass-card profile-platforms-card">
              <span className="platforms-label">Plataformas</span>
              <div className="platforms-icons">
                {userPlatforms.length > 0 ? (
                  userPlatforms.map((p) => {
                    const meta = PLATFORM_ICONS[p];
                    if (!meta) return null;
                    return (
                      <i
                        key={p}
                        className={`${meta.icon} platforms-icon`}
                        title={meta.title}
                      />
                    );
                  })
                ) : (
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    Completa el cuestionario
                  </span>
                )}
              </div>
            </div>

            {/* Tarjeta de recomendaciones */}
            {prefs && (
              <div className="glass-card profile-card-actions">
                <div className="profile-rec-header">
                  <i className="fa-solid fa-wand-magic-sparkles" />
                  <span>Recomendaciones</span>
                </div>
                <div className="profile-rec-row">
                  <div className="profile-rec-info">
                    <span className="profile-rec-label">Modo libre</span>
                    <span className="profile-rec-sub">
                      Muestra todos los juegos en orden aleatorio. Desactívalo
                      para ver recomendaciones basadas en tus preferencias.
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
                        Rehacer cuestionario
                      </span>
                      <span className="profile-action-btn-sub">
                        Cambia tus preferencias.
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
                        Reiniciar mazo
                      </span>
                      <span className="profile-action-btn-sub">
                        Descarta el mazo actual y carga juegos frescos la
                        próxima vez que abras Discover.
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
                <i className="fa-solid fa-right-from-bracket" /> Cerrar sesión
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
        title="¿Rehacer el cuestionario?"
        description="Tus respuestas actuales se reemplazarán con las nuevas. Las recomendaciones se basarán en el cuestionario actualizado. Tus juegos del backlog no se tocan."
        confirmLabel="Sí, rehacer"
      />

      <ConfirmModal
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="¿Cerrar sesión?"
        confirmLabel="Cerrar sesión"
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
