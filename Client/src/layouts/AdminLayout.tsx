import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/modals/ConfirmModal';
import './AdminLayout.css';

const NAV_ITEMS = [
    { to: '/admin/usuarios', icon: 'fa-users', label: 'Usuarios' },
    { to: '/admin/juegos', icon: 'fa-gamepad', label: 'Juegos' },
    { to: '/admin/colecciones', icon: 'fa-layer-group', label: 'Colecciones' },
];

export default function AdminLayout() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [confirmingLogout, setConfirmingLogout] = useState(false);

    const handleLogoutConfirmed = async () => {
        setConfirmingLogout(false);
        await logout();
        navigate('/login');
    };

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <span className="admin-logo">FOMO<span className="admin-logo-killer">Killer</span> <span>ADMIN</span></span>
                </div>

                <nav className="admin-nav">
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
                        >
                            <i className={`fa-solid ${item.icon}`} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-chip">
                        <img
                            src={user?.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"}
                            alt="avatar"
                            className="admin-user-avatar"
                        />
                        <span>{user?.username}</span>
                    </div>
                    <button className="admin-logout-btn" onClick={() => setConfirmingLogout(true)}>
                        <i className="fa-solid fa-right-from-bracket" />
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>

            <ConfirmModal
                isOpen={confirmingLogout}
                onClose={() => setConfirmingLogout(false)}
                onConfirm={handleLogoutConfirmed}
                title="¿Cerrar sesión?"
                description="Volverás a la pantalla de inicio de sesión."
                confirmLabel="Cerrar sesión"
                variant="danger"
            />
        </div>
    );
}
