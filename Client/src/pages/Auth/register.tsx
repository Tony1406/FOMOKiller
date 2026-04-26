import { Link, useNavigate } from 'react-router-dom';
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
                setErrorMsg('All fields are required');
                return;
            }
            if (password.length < 6) {
                setErrorMsg('Password must be at least 6 characters');
                return;
            }
            const data = await register(username, email, password);
            if (data?.error) {
                if (data.error.toLowerCase().includes('email')) {
                    setErrorMsg('An account with this email already exists. Try another or log in.');
                } else {
                    setErrorMsg(data.error);
                }
                return;
            }
            navigate('/login');
        } catch (error: any) {
            console.error("Error al registrar:", error);
            setErrorMsg('Connection error. Please try again.');
        }
    }
    return (
        <div className="login-wrap page-enter">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-title">Create Your Account</div>
                </div>
                {errorMsg && <div className="login-error-message">{errorMsg}</div>}
                <form className="login-form" onSubmit={handleRegister}>
                    <div className="login-form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
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
                    <button type="submit" className="login-btn">Create Account</button>
                </form>
                <div className="login-footer">
                    Already a member?
                    <Link to="/login" className="login-link">Log In</Link>
                </div>
            </div>
        </div>
    );
}
