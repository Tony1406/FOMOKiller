import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import UserChip from '../components/UserChip';

const AppLayout: React.FC = () => {
    const location = useLocation();
    const isProfile = location.pathname === '/app/profile';

    return (
        <div className="app-layout">
            <Navbar />
            <div className="app-main">
                <Header /> {/* solo para moviles */}
                {isProfile ? null : <UserChip />}
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
