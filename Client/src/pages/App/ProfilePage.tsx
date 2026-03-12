import { useState, useEffect, useContext } from 'react';
import { getUserProfile, getBacklog, updateUserProfile } from '../../services/api';
import EditProfileModal from '../../components/modals/EditProfileModal';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

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
                if (juego.isFinished === true) {
                    return true;
                }
                if (juego.status === 'COMPLETED') {
                    return true;
                }
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
        navigate('/login');
    };

    return (
        <div className="page page-enter profile-page-scrollable">
            <div className="page-padded">
                <div className="profile-content-wrapper">

                    <div className="profile-page-header">
                        <h2 className="profile-page-title">Mi Perfil</h2>
                    </div>

                    <div className="profile-header-layout">
                        <div className="profile-avatar-column">
                            <div className="profile-avatar-wrap">
                                <div className="profile-avatar-ring" />
                                <div className="profile-avatar">
                                    <img src={usuario?.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"} alt="Avatar" className="profile-avatar-img" />
                                </div>
                            </div>
                        </div>

                        <div className="profile-info-column">
                            <div className="profile-info-top">
                                <span className="profile-username">
                                    {usuario?.username}
                                </span>
                            </div>

                            <div className="profile-realname">
                                @{usuario?.username?.toLowerCase()}
                            </div>

                            <div className="profile-stats-row">
                                <span className="profile-stat-item">
                                    <strong>{completedCount}</strong> completados
                                </span>
                                <span className="profile-stat-item">
                                    <strong>Miembro desde</strong> {usuario?.createdAt ? new Date(usuario.createdAt).getFullYear() : '2025'}
                                </span>
                            </div>

                            <div className="profile-bio">
                                {usuario?.bio || 'Hola, soy un gamer apasionado usando FOMOKiller.'}
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions-row">
                        <button className="profile-action-btn" onClick={() => setIsEditModalOpen(true)}>
                            Editar perfil {guardando && '...'}
                        </button>
                        <button className="profile-action-btn">Preferencias</button>
                    </div>

                    <div className="profile-section-spacing profile-actions-col">
                        <button className="btn-logout" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                        <button
                            className="profile-action-btn profile-back-btn"
                            onClick={() => navigate('/')}
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={usuario}
                onSave={handleSaveProfile}
            />
        </div>
    );
}
