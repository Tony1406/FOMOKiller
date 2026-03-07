import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoSimple from '../../assets/Logo_simple.png';
import './LandingPage.css';

export default function LandingPage() {
    const columnsRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Generar columnas estilo PS2
        if (columnsRef.current) {
            columnsRef.current.innerHTML = '';
            const count = 60;
            for (let i = 0; i < count; i++) {
                const col = document.createElement('div');
                col.className = 'ps2-column';
                const h = Math.random() * 80 + 20;
                const x = (i / count) * 100;
                const delay = Math.random() * 4;
                const dur = 3 + Math.random() * 4;
                col.style.cssText = `
                    left: ${x}%;
                    height: ${h}%;
                    animation-delay: ${delay}s;
                    animation-duration: ${dur}s;
                    opacity: ${0.15 + Math.random() * 0.35};
                `;
                columnsRef.current.appendChild(col);
            }
        }

        // Generar partículas flotantes
        if (particlesRef.current) {
            particlesRef.current.innerHTML = '';
            const count = 40;
            for (let i = 0; i < count; i++) {
                const p = document.createElement('div');
                p.className = 'ps2-particle';
                const size = 1 + Math.random() * 3;
                p.style.cssText = `
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    width: ${size}px;
                    height: ${size}px;
                    animation-delay: ${Math.random() * 6}s;
                    animation-duration: ${4 + Math.random() * 8}s;
                `;
                particlesRef.current.appendChild(p);
            }
        }
    }, []);

    return (
        <div className="landing-root">
            {/* PS2 Background Effects */}
            <div className="ps2-bg">
                <div className="ps2-columns" ref={columnsRef}></div>
                <div className="ps2-particles" ref={particlesRef}></div>
                <div className="ps2-scanlines"></div>
                <div className="ps2-vignette"></div>
            </div>

            {/* Navigation */}
            <nav className="land-nav">
                <div className="land-nav-inner">
                    <Link to="/" className="land-nav-logo">
                        <img src={logoSimple} alt="FOMOKiller" className="land-nav-logo-img" />
                        <span className="land-nav-logo-text">FOMO<span className="land-nav-logo-accent">Killer</span></span>
                    </Link>
                    <div className="land-nav-links">
                        <a href="#inicio" className="land-nav-link">Inicio</a>
                        <a href="#mision" className="land-nav-link">Misión</a>
                        <a href="#features" className="land-nav-link">Features</a>
                        <a href="#descarga" className="land-nav-link">Descarga</a>
                        <a href="#contacto" className="land-nav-link">Contacto</a>
                        <Link to="/login" className="land-nav-cta">
                            <i className="fa-solid fa-play"></i>
                            Iniciar Sesión
                        </Link>
                    </div>
                    <button className="land-nav-mobile-toggle" onClick={() => {
                        document.querySelector('.land-nav-links')?.classList.toggle('open');
                    }}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="inicio" className="land-hero">
                <div className="land-hero-content">
                    <div className="land-hero-badge">
                        <span className="badge-dot"></span>
                        NUEVA GENERACIÓN DE BACKLOG
                    </div>
                    <h1 className="land-hero-title">
                        <span className="title-line">Mata tu</span>
                        <span className="title-line title-accent">
                            FOMO
                            <svg className="title-underline" viewBox="0 0 300 12" preserveAspectRatio="none">
                                <path d="M0 6 Q75 0 150 6 Q225 12 300 6" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                        <span className="title-line title-sub">gamer.</span>
                    </h1>
                    <p className="land-hero-desc">
                        Organiza tu backlog, descubre nuevos juegos con swipe,
                        y enfócate en lo que realmente quieres jugar.
                        Sin ruido. Sin FOMO.
                    </p>
                    <div className="land-hero-actions">
                        <Link to="/app" className="land-btn land-btn-primary">
                            <i className="fa-solid fa-gamepad"></i>
                            Empezar a Jugar
                        </Link>
                        <Link to="/register" className="land-btn land-btn-ghost">
                            <i className="fa-solid fa-user-plus"></i>
                            Crear Cuenta
                        </Link>
                    </div>
                    <div className="land-hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-num">500+</span>
                            <span className="hero-stat-label">Juegos</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-num">∞</span>
                            <span className="hero-stat-label">Diversión</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-num">0</span>
                            <span className="hero-stat-label">FOMO</span>
                        </div>
                    </div>
                </div>
                <div className="land-hero-visual">
                    <div className="hero-phone-mockup">
                        <div className="phone-screen">
                            <div className="phone-header">
                                <span className="phone-app-name">FOMOKiller</span>
                                <span className="phone-status">● Online</span>
                            </div>
                            <div className="phone-card">
                                <div className="phone-card-letter">E</div>
                                <div className="phone-card-info">
                                    <div className="phone-card-title">Elden Ring</div>
                                    <div className="phone-card-sub">FromSoftware · 2022</div>
                                </div>
                            </div>
                            <div className="phone-card">
                                <div className="phone-card-letter">H</div>
                                <div className="phone-card-info">
                                    <div className="phone-card-title">Hades II</div>
                                    <div className="phone-card-sub">Supergiant · 2024</div>
                                </div>
                            </div>
                            <div className="phone-card">
                                <div className="phone-card-letter">B</div>
                                <div className="phone-card-info">
                                    <div className="phone-card-title">Baldur's Gate 3</div>
                                    <div className="phone-card-sub">Larian · 2023</div>
                                </div>
                            </div>
                            <div className="phone-actions">
                                <span className="phone-btn-pass"><i className="fa-solid fa-xmark"></i></span>
                                <span className="phone-btn-like"><i className="fa-solid fa-heart"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section id="mision" className="land-section land-mission">
                <div className="land-section-inner">
                    <div className="section-tag">NUESTRA MISIÓN</div>
                    <h2 className="land-section-title">
                        Juega lo que <span className="text-glow">importa</span>
                    </h2>
                    <p className="land-section-desc">
                        En un mundo con miles de lanzamientos cada año, el FOMO gamer es real.
                        FOMOKiller te ayuda a filtrar el ruido y centrarte en los juegos que realmente merece la pena jugar.
                    </p>

                    <div className="mission-values">
                        <div className="mission-card">
                            <div className="mission-card-icon">
                                <i className="fa-solid fa-crosshairs"></i>
                            </div>
                            <h3>Enfoque</h3>
                            <p>Prioriza tus juegos para no perderte entre 100 títulos a medio empezar.</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-card-icon">
                                <i className="fa-solid fa-users"></i>
                            </div>
                            <h3>Comunidad</h3>
                            <p>Descubre qué juegan tus amigos y recibe recomendaciones reales, no algoritmos.</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-card-icon">
                                <i className="fa-solid fa-trophy"></i>
                            </div>
                            <h3>Logros</h3>
                            <p>Marca juegos como completados y celebra tu progreso. Cada juego terminado cuenta.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="land-section land-features">
                <div className="land-section-inner">
                    <div className="section-tag">CARACTERÍSTICAS</div>
                    <h2 className="land-section-title">
                        Todo lo que <span className="text-glow">necesitas</span>
                    </h2>

                    <div className="features-grid">
                        <div className="feature-card feature-card-large">
                            <div className="feature-card-glow"></div>
                            <div className="feature-icon-wrap">
                                <i className="fa-solid fa-heart"></i>
                            </div>
                            <h3>Swipe & Discover</h3>
                            <p>Desliza para descubrir juegos. Like = backlog. Pass = siguiente. Así de fácil.</p>
                            <div className="feature-tag">FAVORITO</div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrap feature-icon-cyan">
                                <i className="fa-solid fa-compass"></i>
                            </div>
                            <h3>Explorar</h3>
                            <p>Colecciones curadas por género, época y temática.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrap feature-icon-purple">
                                <i className="fa-solid fa-list-check"></i>
                            </div>
                            <h3>Backlog</h3>
                            <p>Tu lista de juegos pendientes, organizada por estado.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrap feature-icon-green">
                                <i className="fa-solid fa-ranking-star"></i>
                            </div>
                            <h3>Top 5</h3>
                            <p>Solo 5 slots. Fuerza a priorizar lo que juegas ahora.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrap feature-icon-orange">
                                <i className="fa-solid fa-comment-dots"></i>
                            </div>
                            <h3>Chat</h3>
                            <p>Habla con amigos y comparte hallazgos. Próximamente.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download / CTA Section */}
            <section id="descarga" className="land-section land-download">
                <div className="land-section-inner">
                    <div className="download-wrap">
                        <div className="download-content">
                            <div className="section-tag">DESCARGA</div>
                            <h2 className="land-section-title">
                                Lleva FOMOKiller <span className="text-glow">contigo</span>
                            </h2>
                            <p className="land-section-desc">
                                Próximamente en iOS y Android. Mientras tanto,
                                usa la versión web desde cualquier dispositivo.
                            </p>
                            <div className="download-buttons">
                                <div className="download-badge">
                                    <i className="fa-brands fa-apple"></i>
                                    <div>
                                        <span className="download-badge-sub">Próximamente en</span>
                                        <span className="download-badge-main">App Store</span>
                                    </div>
                                </div>
                                <div className="download-badge">
                                    <i className="fa-brands fa-google-play"></i>
                                    <div>
                                        <span className="download-badge-sub">Próximamente en</span>
                                        <span className="download-badge-main">Google Play</span>
                                    </div>
                                </div>
                            </div>
                            <Link to="/app" className="land-btn land-btn-primary download-web-btn">
                                <i className="fa-solid fa-globe"></i>
                                Usar versión web ahora
                            </Link>
                        </div>
                        <div className="download-visual">
                            <div className="download-phone-frame">
                                <img src={logoSimple} alt="FOMOKiller" className="download-phone-logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contacto" className="land-section land-contact">
                <div className="land-section-inner">
                    <div className="section-tag">CONTACTO</div>
                    <h2 className="land-section-title">
                        ¿Tienes <span className="text-glow">dudas</span>?
                    </h2>
                    <p className="land-section-desc">
                        Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.
                    </p>
                    <form className="contact-form" onSubmit={e => e.preventDefault()}>
                        <div className="contact-form-row">
                            <div className="contact-field">
                                <label>Nombre</label>
                                <input type="text" placeholder="Tu nombre" />
                            </div>
                            <div className="contact-field">
                                <label>Email</label>
                                <input type="email" placeholder="tu@email.com" />
                            </div>
                        </div>
                        <div className="contact-field">
                            <label>Mensaje</label>
                            <textarea placeholder="¿Cómo podemos ayudarte?" rows={5}></textarea>
                        </div>
                        <button type="submit" className="land-btn land-btn-primary">
                            <i className="fa-solid fa-paper-plane"></i>
                            Enviar Mensaje
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="land-footer">
                <div className="land-footer-inner">
                    <div className="land-footer-brand">
                        <img src={logoSimple} alt="FOMOKiller" className="land-footer-logo" />
                        <span>FOMO<span className="land-nav-logo-accent">Killer</span></span>
                    </div>
                    <div className="land-footer-links">
                        <a href="#inicio">Inicio</a>
                        <a href="#mision">Misión</a>
                        <a href="#features">Features</a>
                        <a href="#contacto">Contacto</a>
                    </div>
                    <div className="land-footer-copy">
                        &copy; 2026 FOMOKiller. Mata tu FOMO, no tus horas.
                    </div>
                </div>
            </footer>
        </div>
    );
}
