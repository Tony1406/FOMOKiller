import { NavLink } from 'react-router-dom';
import './login.css';

export default function LoginPage() {
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
                <div className="login-form">
                    <div className="login-form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" placeholder="tu@email.com" />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="••••••••" />
                    </div>
                    <button className="login-btn">Iniciar Sesión</button>
                </div>
                <div className="login-footer">
                    ¿No tienes cuenta?
                    <NavLink to="/register" className="login-link">Regístrate aquí</NavLink>
                </div>
            </div>
        </div>
    );
}

