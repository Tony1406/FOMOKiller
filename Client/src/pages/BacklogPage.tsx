import { useState, useEffect } from 'react';
import { getBacklog, updateStatus, markFinished } from '../services/api';
import GameInfoModal from '../components/GameInfoModal';
import './BacklogPage.css';

const TABS = ['Todos', 'Completados'];

const statusFilterMap: Record<string, string | null> = {
    'Todos': null,
    'Completados': 'COMPLETED',
};

const TEMP_USER_ID = 1;

export default function BacklogPage() {
    const [backlog, setBacklog] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Todos');
    const [selectedGame, setSelectedGame] = useState<any>(null);

    const loadBacklog = () => {
        setLoading(true);
        getBacklog(TEMP_USER_ID)
            .then(setBacklog)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadBacklog();
    }, []);

    const handleUpdateStatus = async (gameId: number, status: string) => {
        try {
            await updateStatus(TEMP_USER_ID, gameId, status);

            // Si el estado es COMPLETED, marcamos también isFinished como true
            // Si cambiamos de COMPLETED a otra cosa (ej. LIKED), marcamos isFinished como false
            const isFinished = status === 'COMPLETED';
            await markFinished(TEMP_USER_ID, gameId, isFinished);

            loadBacklog(); // Recargar tras actualizar
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleSetPriority = async (gameId: number, currentPriority: boolean) => {
        // La funcionalidad de prioridad está desactivada por ahora
        console.log("Prioridad clickeada para el juego:", gameId, "Estado actual:", currentPriority);
    };

    const filtered = backlog.filter((entry) => {
        const statusFilter = statusFilterMap[activeTab];
        return statusFilter === null || entry.status === statusFilter;
    });

    return (
        <div className="page page-padded page-enter">
            <div className="backlog-header">
                <div className="section-title">Mi Backlog</div>
                <div className="section-sub">
                    {loading ? 'Cargando...' : `${filtered.length} juegos en esta lista`}
                </div>

                <div className="backlog-tabs backlog-tabs-spacing">
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

            <div className="game-list">
                {loading && (
                    <div className="section-sub">Cargando juegos...</div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="section-sub">
                        No tienes juegos completados
                    </div>
                )}

                {filtered.map((entry: any) => {
                    const game = entry.Game;
                    const firstLetter = game?.title ? game.title.charAt(0).toUpperCase() : '?';

                    return (
                        <div key={`${entry.userId}-${entry.gameId}`} className="game-list-item">
                            <div className="game-thumb-placeholder game-thumb-letter">{firstLetter}</div>

                            <div className="game-info">
                                <div className="game-title">{game?.title ?? '—'}</div>
                                <div className="game-subtitle">
                                    {game?.developer ?? ''}{game?.releaseYear ? ` · ${game.releaseYear}` : ''}
                                </div>
                            </div>

                            <div className="game-status-actions">
                            </div>

                            <div className="game-actions">
                                <button
                                    className="action-btn-info"
                                    onClick={(e) => { e.stopPropagation(); setSelectedGame(game); }}
                                    title="Ver info"
                                >
                                    <i className="fa-solid fa-info-circle"></i>
                                </button>
                                <button
                                    className={`action-btn-secondary ${entry.isPriority ? 'active' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleSetPriority(entry.gameId, entry.isPriority); }}
                                    title={entry.isPriority ? "Quitar de prioridad" : "Marcar como prioridad"}
                                >
                                    <i className="fa-solid fa-star"></i>
                                </button>
                                <button
                                    className={`action-btn-drop ${entry.status === 'DROPPED' ? 'active' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleUpdateStatus(entry.gameId, 'DROPPED'); }}
                                    title="Dropear juego"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                                <button
                                    className={`action-btn-completado ${entry.status === 'COMPLETED' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newStatus = entry.status === 'COMPLETED' ? 'LIKED' : 'COMPLETED';
                                        handleUpdateStatus(entry.gameId, newStatus);
                                    }}
                                    title="Marcar como completado"
                                >
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <GameInfoModal
                isOpen={!!selectedGame}
                onClose={() => setSelectedGame(null)}
                game={selectedGame}
            />
        </div>
    );
}
