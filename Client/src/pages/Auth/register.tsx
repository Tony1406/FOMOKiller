import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ps2man from '../../assets/ps2man.jpg';
import './login.css';
import { register } from '../../services/api';

export default function Register() {
    const [username, setUsername]         = useState('');
    const [email, setEmail]               = useState('');
    const [password, setPassword]         = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg]         = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            if (!username || !email || !password) { setErrorMsg('All fields are required'); return; }
            if (password.length < 6) { setErrorMsg('Password must be at least 6 characters'); return; }
            const data = await register(username, email, password);
            if (data?.error) {
                setErrorMsg(data.error.toLowerCase().includes('email')
                    ? 'An account with this email already exists.'
                    : data.error);
                return;
            }
            navigate('/login');
        } catch {
            setErrorMsg('Connection error. Please try again.');
        }
    };

    return (
        <div className="auth-wrap page-enter">
            <Link to="/" className="auth-back-btn">
                <i className="fa-solid fa-arrow-left" /> Home
            </Link>

            <div className="auth-card">
                {/* image left */}
                <div className="auth-visual-panel">
                    <img src={ps2man} alt="PS2 man" className="auth-visual-img" />
                    <div className="auth-visual-overlay" />
                </div>

                {/* form right */}
                <div className="auth-form-panel">
                    <div className="auth-form-inner">
                        <div className="auth-header">
                            <div className="auth-title">Create Account</div>
                        </div>

                        {errorMsg && <div className="login-error-message">{errorMsg}</div>}

                        <form className="auth-form" onSubmit={handleRegister}>
                            <div className="auth-field">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" placeholder="Your username"
                                    value={username} onChange={e => setUsername(e.target.value)} />
                            </div>
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
                            <button type="submit" className="auth-btn">Create Account</button>
                        </form>

                        <div className="auth-footer">
                            Already a member?
                            <Link to="/login" className="auth-link">Log In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
