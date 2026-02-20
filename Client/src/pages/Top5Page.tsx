import './Top5Page.css';

export default function Top5Page() {
    return (
        <div className="page page-padded page-enter">
            <div className="top5-header">
                <div className="top5-title"> Top 5 Prioridades</div>
                <div className="top5-subtitle">Tus juegos más importantes ahora mismo</div>
            </div>

            <div className="top5-rule-box">
                <span className="top5-rule-text">
                    Solo puedes tener 5 juegos en prioridad. Para añadir uno nuevo, debes terminar o eliminar otro.
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>3 de 5 slots ocupados</span>
                <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan-glow)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan-glow)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan-glow)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} />
                </div>
            </div>

            <div className="priority-slots">
                <div className="priority-slot">
                    <div className="priority-num priority-num-1">1</div>
                    <div className="game-thumb-placeholder" style={{ width: 44, height: 44, fontSize: 20 }}>E</div>
                    <div className="game-info">
                        <div className="game-title">Elden Ring</div>
                        <div className="game-subtitle">RPG</div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--like)', fontSize: 16 }}>☑</button>
                </div>
                <div className="priority-slot">
                    <div className="priority-num priority-num-2">2</div>
                    <div className="game-thumb-placeholder" style={{ width: 44, height: 44, fontSize: 20 }}>H</div>
                    <div className="game-info">
                        <div className="game-title">Hades II</div>
                        <div className="game-subtitle">Roguelike</div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--like)', fontSize: 16 }}>☑</button>
                </div>
                <div className="priority-slot empty">
                    <div className="priority-num priority-num-4">3</div>
                    <div className="game-thumb-placeholder" style={{ width: 44, height: 44, fontSize: 20, opacity: 0.3 }}>+</div>
                    <span className="empty-slot-text">Slot disponible</span>
                </div>
            </div>

            <button style={{ width: '100%', marginTop: 20, padding: 14, background: 'linear-gradient(135deg, var(--cobalt), var(--cobalt-light))', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                + Añadir desde Backlog
            </button>
        </div>
    );
}
