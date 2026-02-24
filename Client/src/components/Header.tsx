import { useState, useEffect } from 'react';
import { getUserProfile } from '../services/api';
import logoSimple from '../assets/Logo_simple.png';
import './Header.css';

const TEMP_USER_ID = 1;

export default function Header() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        getUserProfile(TEMP_USER_ID)
            .then(setUser)
            .catch(console.error);
    }, []);

    return (
        <header className="app-header">
            <div className="app-logo">
                <img src={logoSimple} alt="FOMOKiller" className="app-logo-img" />
                <span className="app-logo-text">FOMOKiller</span>
            </div>
            <div className="app-user-info">
                <span className="app-user-name">{user?.username || 'SlayerX'}</span>
                <div className="app-user-avatar">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="header-avatar-img" />
                    ) : (
                        user?.username ? user.username.charAt(0).toUpperCase() : '🎮'
                    )}
                </div>
            </div>
        </header>
    );
}
