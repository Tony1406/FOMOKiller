import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AdminLayout.css';

const NAV_ITEMS = [
    { to: '/admin/usuarios', icon: 'fa-users', label: 'Usuarios' },
    { to: '/admin/juegos', icon: 'fa-gamepad', label: 'Juegos' },
    { to: '/admin/colecciones', icon: 'fa-layer-group', label: 'Colecciones' },
];

export default function AdminLayout() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
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
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket" />
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
