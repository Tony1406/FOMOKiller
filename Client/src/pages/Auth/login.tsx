import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import './login.css';
import { login } from '../../services/api';

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            if (email === '' || password === '') {
                setErrorMsg('All fields are required');
                return;
            }
            const respuesta = await login(email, password);
            if (respuesta.error) {
                setErrorMsg(respuesta.error);
                return;
            }
            setUser(respuesta.user);
            if (respuesta.user?.role === 'admin') {
                navigate('/admin');
            } else if (!respuesta.user?.hasCompletedOnboarding) {
                navigate('/onboarding');
            } else {
                navigate('/app');
            }
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            setErrorMsg(error.response?.data?.message || 'Incorrect password or connection error');
        }
    }
    return (
        <div className="login-wrap page-enter">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-title">Log <strong className=''>In</strong></div>
                    <div className="login-subtitle">Welcome back</div>
                </div>
                {errorMsg && <div className="login-error-message">{errorMsg}</div>}
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="login-form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrap">
                            <input type={showPassword ? 'text' : 'password'} id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>
                                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login-btn">Log In</button>
                </form>
                <div className="login-footer">
                    Don't have an account?
                    <Link to="/register" className="login-link">Sign up here</Link>
                </div>
            </div>
        </div>
    );
}

