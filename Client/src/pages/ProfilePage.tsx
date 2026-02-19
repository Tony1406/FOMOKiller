import './ProfilePage.css';

export default function ProfilePage() {
    return (
        <div className="page page-enter" style={{ overflowY: 'auto' }}>
            <div className="page-padded">
                <div className="profile-hero">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar-ring" />
                        <div className="profile-avatar">🎮</div>
                    </div>
                    <div className="profile-name">SlayerX</div>
                    <div className="profile-handle">@slayerx · Jugador desde 2024</div>

                </div>

                <div className="profile-stats">

                    <div className="stat-box"><div className="stat-value">0</div><div className="stat-label">En Cola</div></div>
                    <div className="stat-box"><div className="stat-value">0</div><div className="stat-label">Completados</div></div>
                    <div className="stat-box"><div className="stat-value">0</div><div className="stat-label">Activos</div></div>
                </div>

                <div style={{ paddingTop: 20 }}>
                    <div className="profile-section-title">Mi cuenta</div>
                    {[
                        { icon: '👤', text: 'Editar perfil' },
                        { icon: '📊', text: 'Estadísticas detalladas' },
                    ].map(item => (
                        <div key={item.text} className="profile-menu-item">
                            <span className="menu-icon">{item.icon}</span>
                            <span className="menu-text">{item.text}</span>
                            <span className="menu-chevron">›</span>
                        </div>
                    ))}

                    <div className="profile-section-title" style={{ marginTop: 20 }}>Preferencias</div>
                    {[
                        { icon: '🎯', text: 'Géneros favoritos' },
                        { icon: '🌐', text: 'Idioma y región' },
                    ].map(item => (
                        <div key={item.text} className="profile-menu-item">
                            <span className="menu-icon">{item.icon}</span>
                            <span className="menu-text">{item.text}</span>
                            <span className="menu-chevron">›</span>
                        </div>
                    ))}

                    <div className="profile-section-title" style={{ marginTop: 20 }}>Social</div>
                    <div className="profile-menu-item" style={{ borderColor: 'rgba(110,58,250,0.3)' }}>
                        <span className="menu-icon">👥</span>
                        <span className="menu-text">Amigos y Social</span>
                        <span className="badge badge-purple" style={{ fontSize: 10 }}>Pronto</span>
                    </div>
                    <div className="profile-menu-item" style={{ borderColor: 'rgba(110,58,250,0.3)' }}>
                        <span className="menu-icon">💬</span>
                        <span className="menu-text">Mensajes</span>
                        <span className="badge badge-purple" style={{ fontSize: 10 }}>Pronto</span>
                    </div>

                    <button style={{ width: '100%', marginTop: 24, marginBottom: 8, padding: '14px', background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--pass)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
