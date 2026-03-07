import { NavLink } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
    return (
        <div className="login-wrap page-enter">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-title">Crea tu Cuenta</div>
                </div>
                <div className="login-form">
                    <div className="login-form-group">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input type="text" id="username" placeholder="Tu nombre de usuario" />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" placeholder="tu@email.com" />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="••••••••" />
                    </div>
                    <button className="login-btn">Crear Cuenta</button>
                </div>
                <div className="login-footer">
                    ¿Ya eres miembro?
                    <NavLink to="/login" className="login-link">Inicia Sesión</NavLink>
                </div>
            </div>
        </div>
    );
}
