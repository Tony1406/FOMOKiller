import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile } from '../services/api';
import './UserChip.css';

export default function UserChip() {
    const { user: authUser } = useContext(AuthContext);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!authUser) return;
        getUserProfile(authUser.id).then(setUser).catch(console.error);
    }, [authUser]);

    return (
        <Link to="/app/profile" className="user-chip">
            <img
                src={user?.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"}
                alt="avatar"
                className="user-chip-avatar"
            />
            <span className="user-chip-name">{user?.username || authUser?.username}</span>
        </Link>
    );
}
