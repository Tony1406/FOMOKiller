import { useState, useEffect, useContext } from 'react';
import { getPriorities, setPriority, markFinished, updateStatus } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './Top5Page.css';

export default function Top5Page() {
    const { user } = useContext(AuthContext);
    const [priorities, setPriorities] = useState<any[]>([]);

    const cargarPrioridades = async () => {
        if (!user) return;
        const data = await getPriorities(user.id);
        setPriorities(data);
    };

    useEffect(() => {
        if (user) {
            cargarPrioridades();
        }
    }, [user]);

    const handleRemovePriority = async (gameId: number) => {
        if (!user) return;
        try {
            await setPriority(user.id, gameId, false);
            cargarPrioridades();
        } catch (error) {
            console.error("Error quitando prioridad:", error);
        }
    };

    const handleComplete = async (gameId: number) => {
        if (!user) return;
        try {
            await updateStatus(user.id, gameId, 'COMPLETED');
            await markFinished(user.id, gameId, true);
            await setPriority(user.id, gameId, false);
            cargarPrioridades();
        } catch (error) {
            console.error("Error completando juego:", error);
        }
    };

    const slotCount = priorities.length;
    const emptySlots = 5 - slotCount;

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

            <div className="top5-status-bar">
                <span className="top5-status-text">{slotCount} de 5 slots ocupados</span>
                <div className="top5-dots-container">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className={i < slotCount ? 'top5-dot-active' : 'top5-dot-inactive'}
                        />
                    ))}
                </div>
            </div>

            <div className="priority-slots">
                {priorities.map((juego: any, index: number) => {
                    const game = juego.Game;
                    const letraInicial = game.title[0].toUpperCase();
                    const numClass = `priority-num-${index + 1 <= 3 ? index + 1 : index + 1 <= 4 ? '4' : '5'}`;

                    return (
                        <div key={juego.gameId} className="priority-slot">
                            <div className={`priority-num ${numClass}`}>{index + 1}</div>
                            <div className="game-thumb-placeholder">{letraInicial}</div>
                            <div className="game-info">
                                <div className="game-title">{game.title}</div>
                                <div className="game-subtitle">{game.developer} · {game.releaseYear}</div>
                            </div>
                            <div className="top5-actions">
                                <button
                                    className="top5-btn top5-btn-drop"
                                    onClick={() => handleRemovePriority(juego.gameId)}
                                    title="Quitar de Top 5"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                                <button
                                    className="top5-btn top5-btn-complete"
                                    onClick={() => handleComplete(juego.gameId)}
                                    title="Marcar como completado"
                                >
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}

                {Array.from({ length: emptySlots }).map((_, i) => {
                    const slotNum = slotCount + i + 1;
                    const numClass = `priority-num-${slotNum <= 3 ? slotNum : slotNum <= 4 ? '4' : '5'}`;
                    return (
                        <div key={`empty-${i}`} className="priority-slot empty">
                            <div className={`priority-num ${numClass}`}>{slotNum}</div>
                            <div className="game-thumb-placeholder game-thumb-opacity"></div>
                            <span className="empty-slot-text">Slot disponible</span>
                        </div>
                    );
                })}
            </div>


        </div>
    );
}
