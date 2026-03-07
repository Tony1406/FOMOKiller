import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Balatro from '../components/Background/Balatro';
import logoSimple from '../assets/Logo_simple.png';
import './LandingLayout.css';

export default function LandingLayout() {
    const location = useLocation();

    useEffect(() => {
        // Scroll to top + close mobile nav on route change
        window.scrollTo({ top: 0 });
        document.querySelector('.land-nav-links-mobile')?.classList.remove('open');
    }, [location.pathname]);

    return (
        <div className="landing-root">
            {/* PS2 Background Effects */}
            <div className="ps2-bg">
                <div className="land-aurora-bg">
                    <Balatro
                        color1="#0047AB"
                        color2="#071C3A"
                        color3="#2979FF"
                        spinSpeed={1.15}
                        contrast={1}
                    />
                </div>
                <div className="ps2-scanlines"></div>
                <div className="ps2-vignette"></div>
            </div>

            {/* Navigation */}
            <nav className="land-nav">
                <div className="land-nav-inner">
                    <div className="land-nav-left">
                        <NavLink to="/" end className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Inicio</NavLink>
                        <NavLink to="/mision" className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Misión</NavLink>
                    </div>
                    <Link to="/" className="land-nav-logo">
                        <img src={logoSimple} alt="FOMOKiller" className="land-nav-logo-img" />
                        <span className="land-nav-logo-text">FOMO<span className="land-nav-logo-accent">Killer</span></span>
                    </Link>
                    <div className="land-nav-right">
                        <NavLink to="/descarga" className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Descarga</NavLink>
                        <NavLink to="/contacto" className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Contacto</NavLink>
                    </div>
                    {/* Mobile: all links in a dropdown */}
                    <div className="land-nav-links-mobile">
                        <NavLink to="/" end className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Inicio</NavLink>
                        <NavLink to="/mision" className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Misión</NavLink>
                        <NavLink to="/descarga" className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Descarga</NavLink>
                        <NavLink to="/contacto" className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Contacto</NavLink>
                    </div>
                    <button className="land-nav-mobile-toggle" onClick={() => {
                        document.querySelector('.land-nav-links-mobile')?.classList.toggle('open');
                    }}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>
            </nav>

            {/* Page Content – changes per route */}
            <main className="land-page-content">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="land-footer">
                <div className="land-footer-inner">
                    <div className="land-footer-brand">
                        <img src={logoSimple} alt="FOMOKiller" className="land-footer-logo" />
                        <span>FOMO<span className="land-nav-logo-accent">Killer</span></span>
                    </div>
                    <div className="land-footer-links">
                        <Link to="/">Inicio</Link>
                        <Link to="/mision">Misión</Link>

                        <Link to="/contacto">Contacto</Link>
                    </div>
                    <div className="land-footer-copy">
                        &copy; 2026 FOMOKiller. Mata tu FOMO, no tus horas.
                    </div>
                </div>
            </footer>
        </div>
    );
}
