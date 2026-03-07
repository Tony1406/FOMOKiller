import './FeaturesPage.css';

export default function FeaturesPage() {
    return (
        <div className="features-page">
            <div className="features-header">
                <div className="section-tag">CARACTERÍSTICAS</div>
                <h1 className="land-section-title">
                    Todo lo que <span className="text-glow">necesitas</span>
                </h1>
                <p className="land-section-desc">
                    Cada herramienta está diseñada para ayudarte a gestionar tu backlog y descubrir juegos de forma inteligente.
                </p>
            </div>

            <div className="features-grid">
                <div className="feat-card feat-card-hero">
                    <div className="feat-card-glow"></div>
                    <div className="feat-icon-wrap">
                        <i className="fa-solid fa-heart"></i>
                    </div>
                    <h3>Swipe & Discover</h3>
                    <p>Desliza para descubrir juegos. Like = backlog. Pass = siguiente. Así de fácil. Cada swipe te acerca a tu próximo juego favorito.</p>
                    <div className="feat-tag">FAVORITO</div>
                </div>
                <div className="feat-card">
                    <div className="feat-icon-wrap feat-icon-cyan">
                        <i className="fa-solid fa-compass"></i>
                    </div>
                    <h3>Explorar</h3>
                    <p>Colecciones curadas por género, época y temática. Navega por categorías y encuentra exactamente lo que buscas.</p>
                </div>
                <div className="feat-card">
                    <div className="feat-icon-wrap feat-icon-purple">
                        <i className="fa-solid fa-list-check"></i>
                    </div>
                    <h3>Backlog</h3>
                    <p>Tu lista de juegos pendientes, organizada por estado. Nunca pierdas de vista lo que quieres jugar.</p>
                </div>
                <div className="feat-card">
                    <div className="feat-icon-wrap feat-icon-green">
                        <i className="fa-solid fa-ranking-star"></i>
                    </div>
                    <h3>Top 5 Prioridades</h3>
                    <p>Solo 5 slots. Te fuerza a priorizar lo que juegas ahora mismo. Termina uno antes de añadir otro.</p>
                </div>
                <div className="feat-card">
                    <div className="feat-icon-wrap feat-icon-orange">
                        <i className="fa-solid fa-comment-dots"></i>
                    </div>
                    <h3>Chat</h3>
                    <p>Habla con amigos, comparte hallazgos y recomienda juegos directamente. Próximamente con IA.</p>
                </div>
            </div>
        </div>
    );
}
