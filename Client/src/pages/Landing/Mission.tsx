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
                    Creado para <span className="text-glow">gamers reales</span>
                </h2>

                <div className="audience-grid">
                    <div className="audience-card">
                        <div className="audience-emoji">🎮</div>
                        <h3>El Acumulador</h3>
                        <p>Tienes 200 juegos en Steam y no sabes por cuál empezar. Sales llenan tu biblioteca pero nunca juegas nada.</p>
                    </div>
                    <div className="audience-card">
                        <div className="audience-emoji">📱</div>
                        <h3>El Casual Ocupado</h3>
                        <p>Solo tienes 1-2 horas al día para jugar y no quieres perderlas eligiendo. Necesitas un filtro rápido y eficaz.</p>
                    </div>
                    <div className="audience-card">
                        <div className="audience-emoji">🏆</div>
                        <h3>El Completista</h3>
                        <p>Quieres terminar lo que empiezas antes de comprar otro juego. El Top 5 es tu herramienta perfecta.</p>
                    </div>
                    <div className="audience-card">
                        <div className="audience-emoji">👥</div>
                        <h3>El Social Gamer</h3>
                        <p>Te importa lo que juegan tus amigos y quieres compartir descubrimientos. El chat y las recomendaciones son para ti.</p>
                    </div>
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
                        <div className="manifesto-value">
                            <span className="manifesto-icon">✦</span>
                            Simplicidad sobre el ruido
                        </div>
                        <div className="manifesto-value">
                            <span className="manifesto-icon">✦</span>
                            Comunidad sobre el algoritmo
                        </div>
                        <div className="manifesto-value">
                            <span className="manifesto-icon">✦</span>
                            Disfrute sobre la obligación
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
