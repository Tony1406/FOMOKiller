import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './register.css';
import { register } from '../../services/api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            if (username === '' || email === '' || password === '') {
                setErrorMsg('Todos los campos son obligatorios');
                return;
            }
            if (password.length < 6) {
                setErrorMsg('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            await register(username, email, password);
            navigate('/login');
        } catch (error: any) {
            console.error("Error al registrar:", error);
            setErrorMsg(error.response?.data?.message || 'Error al registrar la cuenta');
        }
    }
    return (
        <div className="login-wrap page-enter">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-title">Crea tu Cuenta</div>
                </div>
                {errorMsg && <div className="login-error-message">{errorMsg}</div>}
                <form className="login-form" onSubmit={handleRegister}>
                    <div className="login-form-group">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input type="text" id="username" placeholder="Tu nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password">Contraseña</label>
                        <div className="password-wrap">
                            <input type={showPassword ? 'text' : 'password'} id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>
                                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login-btn">Crear Cuenta</button>
                </form>
                <div className="login-footer">
                    ¿Ya eres miembro?
                    <NavLink to="/login" className="login-link">Inicia Sesión</NavLink>
                </div>
            </div>
        </div>
    );
}
