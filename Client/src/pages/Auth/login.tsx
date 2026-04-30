import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import ps2heads from '../../assets/ps2heads.jpg';
import './login.css';
import { login } from '../../services/api';

export default function LoginPage() {
    const [email, setEmail]               = useState('');
    const [password, setPassword]         = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg]         = useState('');

    const { setUser } = useContext(AuthContext);
    const navigate    = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            if (!email || !password) { setErrorMsg('All fields are required'); return; }
            const respuesta = await login(email, password);
            if (respuesta.error) { setErrorMsg(respuesta.error); return; }
            setUser(respuesta.user);
            if (respuesta.user?.role === 'admin') navigate('/admin');
            else if (!respuesta.user?.hasCompletedOnboarding) navigate('/onboarding');
            else navigate('/app');
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || 'Incorrect password or connection error');
        }
    };

    return (
        <div className="auth-wrap page-enter">
            <Link to="/" className="auth-back-btn">
                <i className="fa-solid fa-arrow-left" /> Home
            </Link>

            <div className="auth-card">
                {/* form left, image right */}
                <div className="auth-form-panel">
                    <div className="auth-form-inner">
                        <div className="auth-header">
                            <div className="auth-title">Log <strong>In</strong></div>
                        </div>

                        {errorMsg && <div className="login-error-message">{errorMsg}</div>}

                        <form className="auth-form" onSubmit={handleLogin}>
                            <div className="auth-field">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="you@email.com"
                                    value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="auth-field">
                                <label htmlFor="password">Password</label>
                                <div className="password-wrap">
                                    <input type={showPassword ? 'text' : 'password'} id="password"
                                        placeholder="••••••••" value={password}
                                        onChange={e => setPassword(e.target.value)} />
                                    <button type="button" className="password-toggle"
                                        onClick={() => setShowPassword(v => !v)}>
                                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="auth-btn">Log In</button>
                        </form>

                        <div className="auth-footer">
                            Don't have an account?
                            <Link to="/register" className="auth-link">Sign up</Link>
                        </div>
                    </div>
                </div>

                {/* image right */}
                <div className="auth-visual-panel">
                    <img src={ps2heads} alt="PS2 heads" className="auth-visual-img" />
                    <div className="auth-visual-overlay" />
                </div>
            </div>
        </div>
    );
}
