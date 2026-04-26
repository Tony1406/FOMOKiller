import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import logoSimple from "../assets/Logo_simple.png";
import "./LandingLayout.css";

export default function LandingLayout() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="landing-root">
      <div className="ps2-bg">
        <div className="land-aurora-bg"></div>
        <div className="ps2-scanlines"></div>
        <div className="ps2-vignette"></div>
      </div>

      <nav className="land-nav">
        <div className="land-nav-inner">
          <div className="land-nav-left">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `land-nav-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>
          </div>
          <Link to="/" className="land-nav-logo">
            <img
              src={logoSimple}
              alt="FOMOKiller"
              className="land-nav-logo-img"
            />
            <span className="land-nav-logo-text">
              FOMO<span className="land-nav-logo-accent">Killer</span>
            </span>
          </Link>
          <div className="land-nav-right">
            <NavLink
              to="/descarga"
              className={({ isActive }) =>
                `land-nav-link ${isActive ? "active" : ""}`
              }
            >
              Get started
            </NavLink>
          </div>
          <div className={`land-nav-links-mobile ${isMenuOpen ? "open" : ""}`}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `land-nav-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/descarga"
              className={({ isActive }) =>
                `land-nav-link ${isActive ? "active" : ""}`
              }
            >
              Get started
            </NavLink>
          </div>
          <button
            className="land-nav-mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>

      <main className="land-page-content">
        <Outlet />
      </main>

      <footer className="land-footer">
        <div className="land-footer-grid">
          <div className="land-footer-col brand-col">
            <div className="land-footer-brand">
              <img
                src={logoSimple}
                alt="FOMOKiller"
                className="land-footer-logo"
              />
              <span className="land-nav-logo-text">
                FOMO<span className="land-nav-logo-accent">Killer</span>
              </span>
            </div>
            <div className="land-footer-social">
              <a href="#" className="social-link">
                <i className="fa-brands fa-discord"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="land-footer-col">
            <h4 className="footer-title">Navigation</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/descarga">Get started</Link>
            </div>
          </div>
        </div>

        <div className="land-footer-bottom">
          <div className="land-footer-separator"></div>
          <div className="land-footer-bottom-inner">
            <p>&copy; 2026 FOMOKiller. All rights reserved.</p>
            <div className="land-footer-bottom-extra">
              <span>Platforms: PC - Console - Mobile</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
