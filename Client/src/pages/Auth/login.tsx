import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './login.css';
import { login } from '../../services/api';

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            if (email === '' || password === '') {
                setErrorMsg('Todos los campos son obligatorios');
                return;
            }
            const respuesta = await login(email, password);
            if (respuesta.error) {
                setErrorMsg(respuesta.error);
                return;
            }
            localStorage.setItem('fomokiller_token', respuesta.token);
            localStorage.setItem('fomokiller_user', JSON.stringify(respuesta.user));
            setUser(respuesta.user);
            navigate('/app');
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            setErrorMsg(error.response?.data?.message || 'Contraseña incorrecta o error de conexión');
        }
    }
    return (
        <div className="login-wrap page-enter">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">
                        <i className="fa-solid fa-gamepad"></i>
                        <span>FOMOKiller</span>
                    </div>
                    <div className="login-title">Iniciar Sesión</div>
                    <div className="login-subtitle">Bienvenido de nuevo</div>
                </div>
                {errorMsg && <div className="login-error-message">{errorMsg}</div>}
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="login-form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="login-btn">Iniciar Sesión</button>
                </form>
                <div className="login-footer">
                    ¿No tienes cuenta?
                    <NavLink to="/register" className="login-link">Regístrate aquí</NavLink>
                </div>
            </div>
        </div>
    );
}

