import { useState, useEffect, useContext } from 'react';
import { getUserProfile } from '../services/api';
import { AuthContext } from '../context/AuthContext';
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
                <span className="app-logo-text">FOMOKiller</span>
            </div>
            <div className="app-user-info">
                <span className="app-user-name">{user?.username}</span>
            </div>
        </header>
    );
}
