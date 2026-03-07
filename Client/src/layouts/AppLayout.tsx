import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const AppLayout: React.FC = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="app-main">
                <Header /> {/* solo para moviles */}
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
