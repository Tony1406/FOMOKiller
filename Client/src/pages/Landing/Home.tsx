import { Link } from 'react-router-dom';
import logoSimple from '../../assets/Logo_simple.png';
import eyepsImg from '../../assets/eyeps.jpg';
import ps2Poster from '../../assets/ps2poster2.jpg';
import './HomePage.css';

export default function HomePage() {
    return (
        <div className="home-page">
            {/* ═══ HERO ═══ */}
            <section className="home-hero-section">
                {/* Imagen hero – web */}
                <div className="home-hero-img-wrap home-hero-web">
                    <img src={eyepsImg} alt="" className="home-hero-img" />
                    <div className="home-hero-img-overlay"></div>
                </div>
                {/* Imagen hero – mobile */}
                <div className="home-hero-img-wrap home-hero-mobile">
                    <img src={eyepsImg} alt="" className="home-hero-img" />
                    <div className="home-hero-img-overlay home-hero-img-overlay-mobile"></div>
                </div>

                <div className="home-hero">
                    <div className="home-hero-content">

                        <h1 className="home-title">
                            <span className="home-title-line">Mata tu</span>
                            <span className="home-title-line home-title-accent">
                                FOMO
                                <svg className="home-title-underline" viewBox="0 0 300 12" preserveAspectRatio="none">
                                    <path d="M0 6 Q75 0 150 6 Q225 12 300 6" stroke="currentColor" strokeWidth="3" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="home-desc">
                            Organiza tu backlog, descubre nuevos juegos con swipe,
                            y enfócate en lo que realmente quieres jugar.
                            Sin ruido. Sin FOMO.
                        </p>
                        <div className="home-actions">
                            <Link to="/app" className="land-btn land-btn-primary" style={{ width: 'fit-content' }}>
                                <i className="fa-solid fa-gamepad"></i>
                                Empezar a Jugar
                            </Link>
                        </div>
                        <div className="home-stats">
                            <div className="home-stat">
                                <span className="home-stat-num">Organiza</span>
                                <span className="home-stat-label">tu backlog</span>
                            </div>
                            <div className="home-stat-divider"></div>
                            <div className="home-stat">
                                <span className="home-stat-num">Descubre</span>
                                <span className="home-stat-label">Nuevos Juegos</span>
                            </div>
                            <div className="home-stat-divider"></div>
                            <div className="home-stat">
                                <span className="home-stat-num">Comparte</span>
                                <span className="home-stat-label">con amigos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FEATURES ═══ */}
            <section className="home-features">
                <div className="home-section-inner">
                    <div className="section-tag">CARACTERÍSTICAS</div>
                    <h2 className="land-section-title">
                        Todo lo que <span className="text-glow">necesitas</span>
                    </h2>
                    <p className="land-section-desc">
                        Cada herramienta está diseñada para ayudarte a gestionar tu backlog
                        y descubrir juegos de forma inteligente.
                    </p>

                    <div className="home-features-wrapper">
                        <div className="home-features-poster">
                            <img src={ps2Poster} alt="PS2 Poster" className="ps2-poster-img" />
                            <div className="poster-glow"></div>
                        </div>

                        <div className="home-features-content">
                            <div className="home-feat-grid">
                                <div className="home-feat-card home-feat-card-hero">
                                    <div className="home-feat-glow"></div>
                                    <div className="home-feat-icon">
                                        <i className="fa-solid fa-heart"></i>
                                    </div>
                                    <h3>Swipe & Discover</h3>
                                    <p>Desliza para descubrir juegos. Like = backlog. Pass = siguiente.
                                        Cada swipe te acerca a tu próximo juego favorito.</p>
                                    <div className="home-feat-tag">FAVORITO</div>
                                </div>
                                <div className="home-feat-card">
                                    <div className="home-feat-icon home-feat-icon-cyan">
                                        <i className="fa-solid fa-compass"></i>
                                    </div>
                                    <h3>Explorar</h3>
                                    <p>Colecciones curadas por género, época y temática.</p>
                                </div>
                                <div className="home-feat-card">
                                    <div className="home-feat-icon home-feat-icon-purple">
                                        <i className="fa-solid fa-list-check"></i>
                                    </div>
                                    <h3>Backlog</h3>
                                    <p>Tu lista de juegos pendientes, organizada por estado.</p>
                                </div>
                                <div className="home-feat-card">
                                    <div className="home-feat-icon home-feat-icon-green">
                                        <i className="fa-solid fa-ranking-star"></i>
                                    </div>
                                    <h3>Top 5</h3>
                                    <p>Solo 5 slots. Prioriza lo que juegas ahora mismo.</p>
                                </div>
                                <div className="home-feat-card">
                                    <div className="home-feat-icon home-feat-icon-orange">
                                        <i className="fa-solid fa-comment-dots"></i>
                                    </div>
                                    <h3>Chat</h3>
                                    <p>Habla con amigos y comparte hallazgos. Próximamente.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CÓMO FUNCIONA ═══ */}
            <section className="home-how">
                <div className="home-section-inner">
                    <div className="section-tag">¿CÓMO FUNCIONA?</div>
                    <h2 className="land-section-title">
                        3 pasos. <span className="text-glow">0 FOMO.</span>
                    </h2>

                    <div className="home-steps">
                        <div className="home-step">
                            <div className="home-step-num">01</div>
                            <h3>Descubre</h3>
                            <p>Desliza entre cientos de juegos como en Tinder. Like si te interesa, pass si no. Así de simple.</p>
                        </div>
                        <div className="home-step-arrow">
                            <i className="fa-solid fa-chevron-right"></i>
                        </div>
                        <div className="home-step">
                            <div className="home-step-num">02</div>
                            <h3>Organiza</h3>
                            <p>Los juegos que te gustan van a tu backlog. Prioriza con el Top 5 para enfocarte en lo que importa.</p>
                        </div>
                        <div className="home-step-arrow">
                            <i className="fa-solid fa-chevron-right"></i>
                        </div>
                        <div className="home-step">
                            <div className="home-step-num">03</div>
                            <h3>Juega</h3>
                            <p>Sin distracciones, sin FOMO. Marca como completado y pasa al siguiente. Tu progreso, tu ritmo.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CTA FINAL ═══ */}
            <section className="home-cta">
                <div className="home-section-inner home-cta-inner">
                    <img src={logoSimple} alt="" className="home-cta-logo" />
                    <h2 className="land-section-title home-cta-title">
                        ¿Listo para matar tu <span className="text-glow">FOMO</span>?
                    </h2>
                    <p className="land-section-desc home-cta-desc">
                        Únete a la comunidad de personas que ya dejaron de acumular y empezaron a disfrutar.
                    </p>
                    <div className="home-actions" style={{ marginBottom: 0, justifyContent: 'center' }}>
                        <Link to="/app" className="land-btn land-btn-primary">
                            <i className="fa-solid fa-gamepad"></i>
                            Empezar Ahora
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
