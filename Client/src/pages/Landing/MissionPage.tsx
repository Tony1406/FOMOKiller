import './MissionPage.css';

export default function MissionPage() {
    return (
        <div className="mission-page">
            <div className="mission-header">
                <div className="section-tag">NUESTRA MISIÓN</div>
                <h1 className="land-section-title">
                    Juega lo que <span className="text-glow">importa</span>
                </h1>
                <p className="land-section-desc">
                    En un mundo con miles de lanzamientos cada año, el FOMO gamer es real.
                    FOMOKiller te ayuda a filtrar el ruido y centrarte en los juegos que realmente merece la pena jugar.
                </p>
            </div>

            <div className="mission-values">
                <div className="mission-card">
                    <div className="mission-card-icon">
                        <i className="fa-solid fa-crosshairs"></i>
                    </div>
                    <h3>Enfoque</h3>
                    <p>Prioriza tus juegos para no perderte entre 100 títulos a medio empezar. Con nuestro sistema Top 5, solo juegas lo que realmente te importa.</p>
                </div>
                <div className="mission-card">
                    <div className="mission-card-icon">
                        <i className="fa-solid fa-users"></i>
                    </div>
                    <h3>Comunidad</h3>
                    <p>Descubre qué juegan tus amigos y recibe recomendaciones reales, no algoritmos genéricos. La mejor recomendación viene de quien te conoce.</p>
                </div>
                <div className="mission-card">
                    <div className="mission-card-icon">
                        <i className="fa-solid fa-trophy"></i>
                    </div>
                    <h3>Logros</h3>
                    <p>Marca juegos como completados y celebra tu progreso. Cada juego terminado es una victoria contra el FOMO.</p>
                </div>
            </div>

            {/* Para quiénes va dirigido */}
            <section className="mission-audience">
                <div className="section-tag">¿PARA QUIÉN ES FOMOKILLER?</div>
                <h2 className="land-section-title">
                    Creado para:
                </h2>

                <div className="audience-grid">
                    <div className="audience-card">
                        <div className="mission-card-icon">
                            <i className="fa-solid fa-cubes"></i>
                        </div>
                        <h3>El Acumulador</h3>
                        <p>Tienes 200 juegos en Steam y no sabes por cuál empezar. Los descuentos llenan tu biblioteca pero nunca juegas a nada.</p>
                    </div>
                    <div className="audience-card">
                        <div className="mission-card-icon">
                            <i className="fa-solid fa-clock"></i>
                        </div>
                        <h3>El Ocupado</h3>
                        <p>Tienes poco tiempo para jugar y no quieres perderlo eligiendo. Necesitas un filtro rápido y eficaz.</p>
                    </div>
                    <div className="audience-card">
                        <div className="mission-card-icon">
                            <i className="fa-solid fa-medal"></i>
                        </div>
                        <h3>El Completista</h3>
                        <p>Quieres terminar lo que empiezas antes de comprar otro juego. El Top 5 es tu herramienta perfecta.</p>
                    </div>
                    <div className="audience-card">
                        <div className="mission-card-icon">
                            <i className="fa-solid fa-headset"></i>
                        </div>
                        <h3>El Social</h3>
                        <p>Te importa lo que juegan tus amigos y quieres compartir descubrimientos. El chat y las recomendaciones son para ti.</p>
                    </div>
                </div>
            </section>

            {/* Nueva Sección de Investigación */}
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
                        "No necesitas jugar todos los juegos. Necesitas jugar <strong>los juegos correctos</strong>.
                        FOMOKiller existe para que dejes de acumular y empieces a disfrutar."
                    </p>
                    <div className="manifesto-values-list">
                        <div className="manifesto-value">
                            <span className="manifesto-icon">✦</span>
                            Simplicidad
                        </div>
                        <div className="manifesto-value">
                            <span className="manifesto-icon">✦</span>
                            Comunidad
                        </div>
                        <div className="manifesto-value">
                            <span className="manifesto-icon">✦</span>
                            Disfrute
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
