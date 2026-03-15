import { useState, useEffect, useContext } from 'react';
import { getBacklog, updateStatus, markFinished, setPriority } from '../../services/api';
import GameInfoModal from '../../components/modals/GameInfoModal';
import { AuthContext } from '../../context/AuthContext';
import './BacklogPage.css';

export default function BacklogPage() {
    const { user } = useContext(AuthContext);
    const [backlog, setBacklog] = useState<any[]>([]);
    const [pestañaActiva, setPestañaActiva] = useState('Todos');
    const [juegoSeleccionado, setJuegoSeleccionado] = useState<any>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');


    const cargarBacklog = async () => {
        if (!user) return;
        const data = await getBacklog(user.id);
        setBacklog(data);
    };

    useEffect(() => {
        if (user) {
            cargarBacklog();
        }
    }, [user]);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMsg(msg);
        setToastType(type);
        setTimeout(() => setToastMsg(null), 2000);
    };

    const handleUpdateStatus = async (gameId: number, status: string) => {
        if (!user) return;
        try {
            await updateStatus(user.id, gameId, status);

            let terminado = false;
            if (status === 'COMPLETED') {
                terminado = true;
            } else {
                terminado = false;
            }
            await markFinished(user.id, gameId, terminado);

            cargarBacklog();
        } catch (error) {
            console.error("Error actualizando estado:", error);
        }
    };

    const handleSetPriority = async (juego: any) => {
        if (!user) return;
        const newPriority = !juego.isPriority;
        try {
            const response = await setPriority(user.id, juego.gameId, newPriority);

            if (response.ok) {
                if (newPriority) {
                    showToast('Enviado a Top 5', 'success');
                } else {
                    showToast('Eliminado de Top 5', 'success');
                }
                cargarBacklog();
            } else {
                const data = await response.json();
                if (response.status === 400) {
                    showToast('Ya tienes 5 juegos en Top 5', 'error');
                } else {
                    showToast(data.error || 'Error al cambiar prioridad', 'error');
                }
            }
        } catch (error) {
            console.error("Error cambiando prioridad:", error);
            showToast('Error de conexión', 'error');
        }
    };

    const filteredGames = backlog.filter((juego) => {
        if (pestañaActiva === 'Todos') {
            return true;
        }

        if (pestañaActiva === 'Completados') {
            if (juego.status === 'COMPLETED') {
                return true;
            } else {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="page page-padded page-enter">
            <div className="backlog-header">
                <div className="section-title">Mi Backlog</div>
                <div className="section-sub">
                    {`${filteredGames.length} juegos en esta lista`}
                </div>

                <div className="backlog-tabs backlog-tabs-spacing">
                    <button
                        className={`tab-pill ${pestañaActiva === 'Todos' ? 'active' : ''}`}
                        onClick={() => setPestañaActiva('Todos')}
                    >
                        Todos
                    </button>
                    <button
                        className={`tab-pill ${pestañaActiva === 'Completados' ? 'active' : ''}`}
                        onClick={() => setPestañaActiva('Completados')}
                    >
                        Completados
                    </button>
                </div>
            </div>

            <div className="game-list">

                {filteredGames.map((juego: any) => {
                    const game = juego.Game;
                    const letraInicial = game.title[0].toUpperCase();


                    return (
                        <div key={juego.gameId} className="game-list-item">
                            <div className="game-thumb-placeholder game-thumb-letter">{letraInicial}</div>

                            <div className="game-info">
                                <div className="game-title">{game?.title}</div>
                                <div className="game-subtitle">
                                    {game?.developer} · {game?.releaseYear}
                                </div>
                            </div>

                            <div className="game-actions">
                                <button className="action-btn-info" onClick={() => setJuegoSeleccionado(game)}>
                                    <i className="fa-solid fa-info-circle"></i>
                                </button>

                                <button
                                    className={`action-btn-secondary${juego.isPriority ? ' action-btn-star--active' : ''}`}
                                    onClick={() => handleSetPriority(juego)}
                                    title={juego.isPriority ? 'Quitar de Top 5' : 'Añadir a Top 5'}
                                >
                                    <i className="fa-solid fa-star"></i>
                                </button>

                                <button
                                    className='action-btn-drop'
                                    onClick={() => handleUpdateStatus(juego.gameId, 'DROPPED')}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>

                                <button
                                    className={juego.status === 'COMPLETED' ? 'action-btn-completado active' : 'action-btn-completado'}
                                    disabled={juego.isPriority}
                                    onClick={() => {
                                        let siguienteEstado = 'COMPLETED';
                                        if (juego.status === 'COMPLETED') {
                                            siguienteEstado = 'LIKED';
                                        }
                                        handleUpdateStatus(juego.gameId, siguienteEstado);
                                    }}
                                >
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <GameInfoModal
                isOpen={juegoSeleccionado != null}
                onClose={() => setJuegoSeleccionado(null)}
                game={juegoSeleccionado}
            />

            {toastMsg && (
                <div className="toast-container">
                    <div className={`toast ${toastType === 'error' ? 'toast-error' : ''}`}>
                        {toastMsg}
                    </div>
                </div>
            )}
        </div>
    );
}
