import './ExplorePage.css';

export default function ExplorePage() {
    return (
        <div className="page page-padded page-enter">
            {/* Search Bar */}
            <div className="search-bar" style={{ marginBottom: 20 }}>
                <input type="text" placeholder="Busca tu próximo juego..." />
            </div>

            <div className="section-title">Colecciones</div>
            <div className="section-sub">Descubre juegos curados por categoría</div>
            <div className="collections-grid">
                <div className="collection-card collection-card-wide">
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0a2040 0%, #0047AB 60%, #00C8FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>💎</div>
                    <div className="collection-card-overlay">
                        <div style={{ fontSize: 11, color: 'var(--cyan)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>⭐ Destacada</div>
                        <div className="collection-name">Indie Gems</div>
                        <div className="collection-count">48 juegos</div>
                    </div>
                </div>
                <div className="collection-card">
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #200020 0%, #6E3AFA 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>⚔️</div>
                    <div className="collection-card-overlay">
                        <div className="collection-name">RPG Épicos</div>
                        <div className="collection-count">31 juegos</div>
                    </div>
                </div>
                <div className="collection-card">
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #001a10 0%, #006600 60%, #00E676 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🔁</div>
                    <div className="collection-card-overlay">
                        <div className="collection-name">Roguelikes</div>
                        <div className="collection-count">22 juegos</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
