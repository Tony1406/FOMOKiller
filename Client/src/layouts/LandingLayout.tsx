import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import PrismaticBurst from '../components/Background/PrismaticBurst';
import logoSimple from '../assets/Logo_simple.png';
import './LandingLayout.css';

export default function LandingLayout() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0 });
        setIsMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="landing-root">
            {/* PS2 Background Effects */}
            <div className="ps2-bg">
                <div className="land-aurora-bg">
                    <PrismaticBurst
                        intensity={5}
                        speed={0.5}
                        animationType="rotate3d"
                        colors={["#5227FF", "#1000f5", "#10bff9"]}
                        distort={1}
                        hoverDampness={0}
                        rayCount={0}
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
                    <div className={`land-nav-links-mobile ${isMenuOpen ? 'open' : ''}`}>
                        <NavLink to="/" end className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Inicio</NavLink>
                        <NavLink to="/mision" className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Misión</NavLink>
                        <NavLink to="/descarga" className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Descarga</NavLink>
                        <NavLink to="/contacto" className={({ isActive }) => `land-nav-link ${isActive ? 'active' : ''}`}>Contacto</NavLink>
                    </div>
                    <button className="land-nav-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                <div className="land-footer-grid">
                    <div className="land-footer-col brand-col">
                        <div className="land-footer-brand">
                            <img src={logoSimple} alt="FOMOKiller" className="land-footer-logo" />
                            <span className="land-nav-logo-text">FOMO<span className="land-nav-logo-accent">Killer</span></span>
                        </div>
                        <div className="land-footer-social">
                            <a href="#" className="social-link"><i className="fa-brands fa-discord"></i></a>
                            <a href="#" className="social-link"><i className="fa-brands fa-x-twitter"></i></a>
                            <a href="#" className="social-link"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" className="social-link"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>

                    <div className="land-footer-col">
                        <h4 className="footer-title">Navegación</h4>
                        <div className="footer-links">
                            <Link to="/">Inicio</Link>
                            <Link to="/mision">Misión</Link>
                            <Link to="/descarga">Descarga</Link>
                            <Link to="/contacto">Contacto</Link>
                        </div>
                    </div>
                </div>

                <div className="land-footer-bottom">
                    <div className="land-footer-separator"></div>
                    <div className="land-footer-bottom-inner">
                        <p>&copy; 2026 FOMOKiller. Todos los derechos reservados.</p>
                        <div className="land-footer-bottom-extra">
                            <span>Plataformas: PC - Consola - Movil</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
