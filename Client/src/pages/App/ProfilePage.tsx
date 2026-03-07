import { useState, useEffect } from 'react';
import { getUserProfile, getBacklog, updateUserProfile, USER_ID } from '../../services/api';
import EditProfileModal from '../../components/modals/EditProfileModal';
import './ProfilePage.css';

export default function ProfilePage() {
    const [usuario, setUsuario] = useState<any>(null);
    const [completedCount, setCompletedCount] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchProfileData = async () => {
        try {
            const userData = await getUserProfile(USER_ID);
            setUsuario(userData);
            const backlogData = await getBacklog(USER_ID);
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
    }, []);

    const handleSaveProfile = async (updatedData: any) => {
        try {
            const savedUser = await updateUserProfile(USER_ID, updatedData);
            setUsuario(savedUser);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error al guardar perfil:", error);
        }
    };

    return (
        <div className="page page-enter profile-page-scrollable">
            <div className="page-padded">
                <div className="profile-content-wrapper">

                    <div className="profile-header-layout">
                        <div className="profile-avatar-column">
                            <div className="profile-avatar-wrap">
                                <div className="profile-avatar-ring" />
                                <div className="profile-avatar">
                                    <img src={usuario?.avatarUrl} alt="Avatar" className="profile-avatar-img" />
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
                                {usuario?.bio}
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions-row">
                        <button className="profile-action-btn" onClick={() => setIsEditModalOpen(true)}>
                            Editar perfil
                        </button>
                        <button className="profile-action-btn">Preferencias</button>
                    </div>

                    <div className="profile-section-spacing">
                        <button className="btn-logout" onClick={() => console.log("Cerrando sesión...")}>
                            Cerrar sesión
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
