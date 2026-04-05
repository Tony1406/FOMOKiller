import { NavLink } from 'react-router-dom';
import logoSimple from '../assets/Logo_simple.png';
import exploreIcon from '../assets/explorar.png';
import backlogIcon from '../assets/backlog.png';
import swipeIcon from '../assets/swipe.png';
import top5Icon from '../assets/top5.png';
import profileIcon from '../assets/perfil.png';


import './Navbar.css';

export default function Navbar() {
    return (
        <nav className="app-nav">
            <div className="nav-logo">
                <div className="nav-item nav-logo-btn">
                    <img src={logoSimple} alt="FOMOKiller" className="nav-logo-simple" />
                    <span className="app-logo-text"><span className="fomokiller-brand">FOMO<span className="fomokiller-accent">Killer</span></span></span>
                </div>
            </div>

            <div className="nav-main-items">
                <NavLink to="/app/swipe" end className="nav-item">
                    <span className="nav-icon">
                        <img src={swipeIcon} alt="swipe" className="nav-icon-img" />
                    </span>
                    <span className="nav-label">Swipe</span>
                </NavLink>
                <NavLink to="/app/explore" className="nav-item">
                    <span className="nav-icon">
                        <img src={exploreIcon} alt="Explore" className="nav-icon-img" />
                    </span>
                    <span className="nav-label">Explorar</span>
                </NavLink>
                <NavLink to="/app/backlog" className="nav-item">
                    <span className="nav-icon">
                        <img src={backlogIcon} alt="Backlog" className="nav-icon-img" />
                    </span>
                    <span className="nav-label">Backlog</span>
                </NavLink>
                <NavLink to="/app/top5" className="nav-item">
                    <span className="nav-icon">
                        <img src={top5Icon} alt="top5" className="nav-icon-img" />
                    </span>
                    <span className="nav-label">Top 5</span>
                </NavLink>
                <NavLink to="/app/profile" className="nav-item">
                    <span className="nav-icon">
                        <img src={profileIcon} alt="profile" className="nav-icon-img" />
                    </span>
                    <span className="nav-label">Perfil</span>
                </NavLink>
            </div>
        </nav>
    );
}
