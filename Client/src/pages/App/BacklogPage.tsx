import { useState, useEffect } from 'react';
import { getBacklog, updateStatus, markFinished, USER_ID } from '../../services/api';
import GameInfoModal from '../../components/modals/GameInfoModal';
import './BacklogPage.css';

export default function BacklogPage() {
    const [backlog, setBacklog] = useState<any[]>([]);
    const [pestañaActiva, setPestañaActiva] = useState('Todos');
    const [juegoSeleccionado, setJuegoSeleccionado] = useState<any>(null);


    const cargarBacklog = async () => {
        const data = await getBacklog(USER_ID);
        setBacklog(data);
    };

    useEffect(() => {
        cargarBacklog();
    }, []);

    const handleUpdateStatus = async (gameId: number, status: string) => {
        try {
            await updateStatus(USER_ID, gameId, status);

            let terminado = false;
            if (status === 'COMPLETED') {
                terminado = true;
            } else {
                terminado = false;
            }
            await markFinished(USER_ID, gameId, terminado);

            cargarBacklog();
        } catch (error) {
            console.error("Error actualizando estado:", error);
        }
    };

    const handleSetPriority = (gameId: number) => {
        console.log("Clic en prioridad para el juego:", gameId);
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
                                    className='action-btn-secondary'
                                    onClick={() => handleSetPriority(juego)}
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
        </div>
    );
}
