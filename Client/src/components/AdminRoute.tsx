import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute() {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
    return <Outlet />;
}
