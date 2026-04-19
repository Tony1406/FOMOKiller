import eyeps from '../../assets/eyeps.jpg';
import fondoPS2 from '../../assets/fondoPS2.png';
import ps2poster2 from '../../assets/ps2poster2.jpg';
import swipeIcon from '../../assets/swipe.png';
import exploreIcon from '../../assets/explorar.png';
import backlogIcon from '../../assets/backlog.png';
import top5Icon from '../../assets/top5.png';
import './HomePage.css';
import './MissionPage.css';

export default function HomePage() { 
    return (
        <div className="home-page">
            {/* ═══ HERO ═══ */}
            <section className="home-hero-section">
                {/* Imagen hero – web */}
                <div className="home-hero-img-wrap home-hero-web">
                    <img src={fondoPS2} alt="" className="home-hero-img" />
                    <div className="home-hero-img-overlay"></div>
                </div>
                {/* Imagen hero – mobile */}
                <div className="home-hero-img-wrap home-hero-mobile">
                    <img src={fondoPS2} alt="" className="home-hero-img" />
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
                            Organiza tu backlog, descubre nuevos juegos,
                            y enfócate en lo que realmente quieres jugar.
                        </p>
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
                                <span className="home-stat-num">Prioriza</span>
                                <span className="home-stat-label">lo que importa</span>
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
                        y descubrir juegos.
                    </p>

                    <div className="home-features-wrapper">
                        <div className="home-features-poster">
                            <img src={eyeps} alt="PS2 Poster" className="ps2-poster-img" />
                            <div className="poster-glow"></div>
                        </div>

                        <div className="home-features-content">
                            <div className="home-feat-grid">
                                <div className="home-feat-card">
                                    <div className="home-feat-icon home-feat-icon-cyan">
                                        <i className="fa-solid fa-hand-pointer" />
                                    </div>
                                    <div className="home-feat-info">
                                        <h3>Swipe & Discover</h3>
                                        <p>Desliza para descubrir juegos. Like = agregar a tu backlog. Pass = siguiente.</p>
                                    </div>
                                </div>
                                <div className="home-feat-card">
                                    <div className="home-feat-icon home-feat-icon-purple">
                                        <i className="fa-solid fa-compass" />
                                    </div>
                                    <div className="home-feat-info">
                                        <h3>Explorar</h3>
                                        <p>Colecciones curadas por género, época y temática.</p>
                                    </div>
                                </div>
                                <div className="home-feat-card">
                                    <div className="home-feat-icon home-feat-icon-green">
                                        <i className="fa-solid fa-list-check" />
                                    </div>
                                    <div className="home-feat-info">
                                        <h3>Backlog</h3>
                                        <p>Tu lista de juegos pendientes.</p>
                                    </div>
                                </div>
                                <div className="home-feat-card">
                                    <div className="home-feat-icon home-feat-icon-orange">
                                        <i className="fa-solid fa-trophy" />
                                    </div>
                                    <div className="home-feat-info">
                                        <h3>Top 5</h3>
                                        <p>Solo 5 slots. Prioriza tus juegos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ MISIÓN ═══ */}
            <section className="mission-page">
                <div className="mission-header">
                    <div className="section-tag">NUESTRA MISIÓN</div>
                    <h2 className="land-section-title">
                        Juega lo que <span className="text-glow">importa</span>
                    </h2>
                    <p className="land-section-desc">
                        En un mundo con miles de lanzamientos cada año, el FOMO gamer es real.
                        FOMOKiller te ayuda a filtrar el ruido y centrarte en los juegos que realmente merece la pena jugar.
                    </p>
                </div>

                <div className="mission-values-wrapper">
                    <div className="mission-values">
                        <div className="mission-card">
                            <div className="mission-card-icon"><i className="fa-solid fa-crosshairs"></i></div>
                            <div className="mission-card-info">
                                <h3>Enfoque</h3>
                                <p>Prioriza tus juegos para no perderte entre 100 títulos a medio empezar. Con nuestro sistema Top 5, solo juegas lo que realmente te importa.</p>
                            </div>
                        </div>
                        <div className="mission-card">
                            <div className="mission-card-icon"><i className="fa-solid fa-trophy"></i></div>
                            <div className="mission-card-info">
                                <h3>Logros</h3>
                                <p>Marca juegos como completados y celebra tu progreso. Cada juego terminado es una victoria contra el FOMO.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mission-poster">
                        <img src={ps2poster2} alt="" className="mission-poster-img" />
                    </div>
                </div>

                <section className="mission-audience">
                    <div className="section-tag">¿PARA QUIÉN ES FOMOKILLER?</div>
                    <h2 className="land-section-title">Creado para:</h2>
                    <div className="audience-grid">
                        <div className="audience-card">
                            <div className="mission-card-icon"><i className="fa-solid fa-cubes"></i></div>
                            <h3>El Acumulador</h3>
                            <p>Tienes 200 juegos en Steam y no sabes por cuál empezar. Los descuentos llenan tu biblioteca pero nunca juegas a nada.</p>
                        </div>
                        <div className="audience-card">
                            <div className="mission-card-icon"><i className="fa-solid fa-clock"></i></div>
                            <h3>El Ocupado</h3>
                            <p>Tienes poco tiempo para jugar y no quieres perderlo eligiendo. Necesitas un filtro rápido y eficaz.</p>
                        </div>
                        <div className="audience-card">
                            <div className="mission-card-icon"><i className="fa-solid fa-medal"></i></div>
                            <h3>El Completista</h3>
                            <p>Quieres terminar lo que empiezas antes de comprar otro juego. El Top 5 es tu herramienta perfecta.</p>
                        </div>
                    </div>
                </section>

                <section className="mission-research">
                    <div className="section-tag">INVESTIGACIÓN Y DATOS</div>
                    <h2 className="land-section-title">El impacto del <span className="text-glow">"Pile of Shame"</span></h2>
                    <div className="research-grid">
                        <div className="research-item">
                            <div className="research-value">$19B</div>
                            <div className="research-label">Inversión Perdida</div>
                            <p>Se estima que los usuarios de Steam han gastado más de 19 mil millones de dólares en juegos que nunca se han ejecutado ni una sola vez.</p>
                        </div>
                        <div className="research-item">
                            <div className="research-value">51%</div>
                            <div className="research-label">Bibliotecas Intactas</div>
                            <p>Más de la mitad de los juegos en la biblioteca del jugador promedio permanecen sin jugar debido a la fatiga de decisión.</p>
                        </div>
                        <div className="research-item">
                            <div className="research-value">25%</div>
                            <div className="research-label">Abandono Total</div>
                            <p>Uno de cada cuatro juegos comprados digitalmente jamás llega a iniciarse, víctimas de compras impulsivas y ofertas masivas.</p>
                        </div>
                    </div>
                    <div className="research-source">
                        <p>* Datos basados en análisis de cuentas públicas de Steam y estudios de consumo digital (2024).</p>
                    </div>
                </section>

                <div className="mission-manifesto">
                    <div className="manifesto-card">
                        <h2><i className="fa-solid fa-quote-left"></i></h2>
                        <p className="manifesto-text">
                            No necesitas jugar todos los juegos. Necesitas jugar <strong>los juegos correctos</strong>.
                            FOMOKiller existe para que dejes de acumular y empieces a disfrutar.
                        </p>
                        <div className="manifesto-values-list">
                            <div className="manifesto-value"><span className="manifesto-icon">✦</span>Simplicidad</div>
                            <div className="manifesto-value"><span className="manifesto-icon">✦</span>Enfoque</div>
                            <div className="manifesto-value"><span className="manifesto-icon">✦</span>Disfrute</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
