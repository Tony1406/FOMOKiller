import { useState, useEffect } from 'react';
import { getUserProfile, getBacklog, updateUserProfile } from '../services/api';
import EditProfileModal from '../components/EditProfileModal';
import './ProfilePage.css';

const TEMP_USER_ID = 1;

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [completedCount, setCompletedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userData = await getUserProfile(TEMP_USER_ID);
                setUser(userData);

                const backlogData = await getBacklog(TEMP_USER_ID);
                const count = backlogData.filter((game: any) => game.isFinished || game.status === 'COMPLETED').length;
                setCompletedCount(count);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = async (updatedData: any) => {
        try {
            const savedUser = await updateUserProfile(TEMP_USER_ID, updatedData);
            setUser(savedUser);
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
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="Avatar" className="profile-avatar-img" />
                                    ) : (
                                        user?.username ? user.username.charAt(0).toUpperCase() : ''
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="profile-info-column">
                            <div className="profile-info-top">
                                <span className="profile-username">{loading ? 'Cargando...' : user?.username || 'Usuario'}</span>
                            </div>

                            <div className="profile-realname">
                                @{user?.username?.toLowerCase() || 'user'}
                            </div>

                            <div className="profile-stats-row">
                                <span className="profile-stat-item"><strong>{completedCount}</strong>     completados</span>
                                <span className="profile-stat-item"><strong> Miembro desde {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</strong>  </span>
                            </div>

                            {user?.bio && (
                                <div className="profile-bio">
                                    {user.bio}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-actions-row">
                        <button className="profile-action-btn" onClick={handleEditProfile}>Editar perfil</button>
                        <button className="profile-action-btn">Preferencias</button>
                    </div>

                    <div className="profile-section-spacing">
                        <button className="btn-logout">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onSave={handleSaveProfile}
            />
        </div>
    );
}
