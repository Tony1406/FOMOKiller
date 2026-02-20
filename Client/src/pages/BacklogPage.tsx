import { useState, useEffect } from 'react';
import { getBacklog } from '../services/api';
import './BacklogPage.css';

// Mapeo de status a badge visual
const statusConfig: Record<string, { label: string; className: string }> = {
    LIKED: { label: 'Me Flipa', className: 'badge badge-green' },
    DISLIKED: { label: 'No mola', className: 'badge badge-red' },
    COMPLETED: { label: 'Completado', className: 'badge badge-cobalt' },
    DROPPED: { label: 'Abandonado', className: 'badge badge-muted' },
};

const TABS = ['Todos', 'Me Flipa', 'Completados', 'Abandonados'];

const statusFilterMap: Record<string, string | null> = {
    'Todos': null,
    'Me Flipa': 'LIKED',
    'Completados': 'COMPLETED',
    'Abandonados': 'DROPPED',
};

// userId hardcodeado temporalmente (sin auth)
const TEMP_USER_ID = 1;

export default function BacklogPage() {
    const [backlog, setBacklog] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Todos');

    useEffect(() => {
        getBacklog(TEMP_USER_ID)
            .then(setBacklog)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Filtrar por tab activo
    const filtered = backlog.filter((entry) => {
        const statusFilter = statusFilterMap[activeTab];
        return statusFilter === null || entry.status === statusFilter;
    });

    return (
        <div className="page page-padded page-enter">
            <div className="backlog-header">
                <div className="section-title">Mi Backlog</div>
                <div className="section-sub">
                    {loading ? 'Cargando...' : `${backlog.length} juegos en tu colección`}
                </div>

                {/* Tabs de filtro */}
                <div className="backlog-tabs" style={{ marginTop: 14 }}>
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            className={`tab-pill${activeTab === tab ? ' active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista de juegos */}
            <div className="game-list">
                {loading && (
                    <div className="section-sub">Cargando juegos...</div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="section-sub">
                        No hay juegos en esta categoría 🎮
                    </div>
                )}

                {filtered.map((entry: any) => {
                    const game = entry.Game;
                    const badge = statusConfig[entry.status] ?? { label: entry.status, className: 'badge badge-muted' };
                    const firstLetter = game?.title ? game.title.charAt(0).toUpperCase() : '?';

                    return (
                        <div key={`${entry.userId}-${entry.gameId}`} className="game-list-item">
                            <div className="game-thumb-placeholder" style={{ fontSize: 24, fontWeight: 'bold' }}>{firstLetter}</div>

                            <div className="game-info">
                                <div className="game-title">{game?.title ?? '—'}</div>
                                <div className="game-subtitle">
                                    {game?.developer ?? ''}{game?.releaseYear ? ` · ${game.releaseYear}` : ''}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                <span className={badge.className}>{badge.label}</span>
                                {entry.isFinished && (
                                    <span style={{ fontSize: 14 }}>✅</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
