import './BacklogPage.css';

export default function BacklogPage() {
    return (
        <div className="page page-padded page-enter">
            <div className="backlog-header">
                <div className="section-title">Mi Backlog</div>
                <div className="section-sub">6 juegos en tu colección</div>
                <div className="backlog-tabs" style={{ marginTop: 14 }}>
                    <button className="tab-pill active">Todos</button>
                    <button className="tab-pill">Jugando</button>
                    <button className="tab-pill">En Cola</button>
                    <button className="tab-pill">Completados</button>
                </div>
            </div>

            <div className="game-list">
                <div className="game-list-item">
                    <div className="game-thumb-placeholder">⚔️</div>
                    <div className="game-info">
                        <div className="game-title">Elden Ring</div>
                        <div className="game-subtitle">RPG · Souls-like</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                        <span className="badge badge-green">Jugando</span>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>⋯</button>
                    </div>
                </div>
                <div className="game-list-item">
                    <div className="game-thumb-placeholder">🔱</div>
                    <div className="game-info">
                        <div className="game-title">Hades II</div>
                        <div className="game-subtitle">Roguelike</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                        <span className="badge badge-green">Jugando</span>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>⋯</button>
                    </div>
                </div>
                <div className="game-list-item">
                    <div className="game-thumb-placeholder">🐛</div>
                    <div className="game-info">
                        <div className="game-title">Hollow Knight</div>
                        <div className="game-subtitle">Metroidvania</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                        <span className="badge badge-cobalt">En Cola</span>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>⋯</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
