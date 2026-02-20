import logoSimple from '../assets/Logo_simple.png';
import './Header.css';

export default function Header() {
    return (
        <header className="app-header">
            <div className="app-logo">
                <img src={logoSimple} alt="FOMOKiller" className="app-logo-img" />
                <span className="app-logo-text">FOMOKiller</span>
            </div>
            <div className="app-user-info">
                <span className="app-user-name">SlayerX</span>
                <div className="app-user-avatar">🎮</div>
            </div>
        </header>
    );
}
