import { useState, useEffect } from 'react';
import GameInfoModal from '../../components/modals/GameInfoModal';
import { getAllGames, updateStatus, USER_ID } from '../../services/api';
import './SwipePage.css';

const STORAGE_JUEGOS = 'swipe_deck';
const STORAGE_INDICE = 'swipe_index';

export default function SwipePage() {
    const [juegos, setJuegos] = useState<any[]>([]);
    const [idJuego, setIdJuego] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [mostrarInfo, setMostrarInfo] = useState(false);

    const cargarJuegos = async () => {
        // ¿Tenemos un mazo guardado?
        const deckGuardado = sessionStorage.getItem(STORAGE_JUEGOS);
        const indiceGuardado = sessionStorage.getItem(STORAGE_INDICE);

        if (deckGuardado) {
            setJuegos(JSON.parse(deckGuardado));
            setIdJuego(indiceGuardado ? Number(indiceGuardado) : 0);
            setCargando(false);
            return;
        }

        // Si no hay nada guardado, descargamos y barajamos
        const data = await getAllGames();
        const juegosMezclados = data.sort(() => Math.random() - 0.5);
        sessionStorage.setItem(STORAGE_JUEGOS, JSON.stringify(juegosMezclados));
        sessionStorage.setItem(STORAGE_INDICE, '0');
        setJuegos(juegosMezclados);
        setCargando(false);
    };

    useEffect(() => {
        cargarJuegos();
    }, []);


    const handleVote = async (status: 'LIKED' | 'DISLIKED') => {
        const juego = juegos[idJuego];
        await updateStatus(USER_ID, juego.id, status);
        const nuevoIndice = idJuego + 1;
        setIdJuego(nuevoIndice);
        sessionStorage.setItem(STORAGE_INDICE, String(nuevoIndice));
    };


    if (cargando) {
        return (
            <div className="swipe-page page-enter">
                <div className="swipe-loading-container">
                    <div className="swipe-loading-text">Cargando recomendaciones...</div>
                </div>
            </div>
        );
    }

    const juegoActual = juegos[idJuego];

    return (
        <div className="swipe-page page-enter">
            {/* Ventana de detalles */}
            <GameInfoModal
                isOpen={mostrarInfo}
                onClose={() => setMostrarInfo(false)}
                game={juegoActual}
            />

            <div className="swipe-stack">
                {/* Carta principal */}
                <div className="swipe-card swipe-card-front">
                    <div className="swipe-card-bg">
                        <img src={juegoActual.imageUrl} alt={juegoActual.title} className="swipe-card-image" />
                    </div>

                    <div className="swipe-card-gradient" />

                    <div className="swipe-card-info">
                        <div className="swipe-card-title">{juegoActual.title}</div>

                        <div className="swipe-card-meta">
                            <span>
                                {juegoActual.releaseYear} · {juegoActual.developer}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="swipe-actions">
                <button className="swipe-btn swipe-btn-pass" onClick={() => handleVote('DISLIKED')}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <button className="swipe-btn swipe-btn-info" onClick={() => setMostrarInfo(true)} >
                    <i className="fa-solid fa-info"></i>
                </button>
                <button className="swipe-btn swipe-btn-like" onClick={() => handleVote('LIKED')}>
                    <i className="fa-solid fa-heart"></i>
                </button>
            </div>
        </div>
    );
}
