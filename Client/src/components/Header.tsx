import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import { AuthContext } from '../auth/AuthContext';
import logoSimple from '../assets/Logo_simple.png';
import './Header.css';


export default function Header() {
    const { user: authUser } = useContext(AuthContext);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!authUser) return;
        getUserProfile(authUser.id)
            .then(setUser)
            .catch(console.error);
    }, [authUser]);

    return (
        <header className="app-header">
            <div className="app-logo">
                <img src={logoSimple} alt="FOMOKiller" className="app-logo-img" />
                <span className="app-logo-text"><span className="fomokiller-brand">FOMO<span className="fomokiller-accent">Killer</span></span></span>
            </div>
            <Link to="/app/profile" className="app-user-info">
                <span className="app-user-name">{user?.username}</span>
                <img
                    src={user?.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"}
                    alt="avatar"
                    className="app-user-avatar"
                />
            </Link>
        </header>
    );
}
