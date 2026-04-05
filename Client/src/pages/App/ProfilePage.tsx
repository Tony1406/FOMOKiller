import { useState, useEffect, useContext } from "react";
import {
  getUserProfile,
  getBacklog,
  updateUserProfile,
} from "../../services/api";
import EditProfileModal from "../../components/modals/EditProfileModal";
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
    } catch (error) {
      console.error("Error al cargar datos del perfil:", error);
    }
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

            <button
              className="profile-edit-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              <i className="fa-solid fa-pencil" /> {guardando ? "Guardando..." : "Editar perfil"}
            </button>
            <button className="profile-avatar-btn">
              <i className="fa-solid fa-camera" /> Cambiar foto
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
                <span className="stat-number">0h</span>
                <span className="stat-label">Tiempo total jugado</span>
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
                <i className="fa-brands fa-steam platforms-icon" title="Steam" />
                <i className="fa-brands fa-playstation platforms-icon" title="PlayStation" />
                <i className="fa-brands fa-xbox platforms-icon" title="Xbox" />
                <i className="fa-solid fa-gamepad platforms-icon" title="Nintendo Switch" />
              </div>
            </div>

            {/* Tarjeta de acciones */}
            <div className="glass-card profile-card-actions">
              <button className="profile-action-btn">
                <i className="fa-solid fa-sliders" /> Volver a hacer
                cuestionario
              </button>
              <button className="btn-logout" onClick={handleLogout}>
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
    </div>
  );
}
